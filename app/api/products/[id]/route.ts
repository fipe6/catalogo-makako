import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const admin = getSupabaseAdmin();

  const { data: product } = await admin
    .from('products')
    .select('image_url')
    .eq('id', id)
    .maybeSingle();

  const { error } = await admin.from('products').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (product?.image_url) {
    const fileName = product.image_url.split('/product-images/')[1];
    if (fileName) {
      await admin.storage.from('product-images').remove([fileName]);
    }
  }

  return NextResponse.json({ ok: true });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const formData = await request.formData();
  const admin = getSupabaseAdmin();

  const badgeRaw = String(formData.get('badge') || '');

  const updates: Record<string, unknown> = {
    brand: String(formData.get('brand') || '').trim(),
    name: String(formData.get('name') || '').trim(),
    price: Number(formData.get('price')),
    category: String(formData.get('category') || ''),
    badge: badgeRaw === '' ? null : badgeRaw,
    description: String(formData.get('description') || '').trim(),
    in_stock: formData.get('inStock') === 'true',
    updated_at: new Date().toISOString(),
  };

  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${id}-${Date.now()}.${ext}`;
    const arrayBuffer = await imageFile.arrayBuffer();

    const { error: uploadError } = await admin.storage
      .from('product-images')
      .upload(fileName, Buffer.from(arrayBuffer), {
        contentType: imageFile.type || 'image/jpeg',
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = admin.storage.from('product-images').getPublicUrl(fileName);
    updates.image_url = publicUrlData.publicUrl;
  }

  const { data: updated, error } = await admin
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, product: updated });
}
