import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getSupabaseAdmin, mapProductRow } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: (data || []).map(mapProductRow) });
}

function slugFileName(brand: string, name: string, ext: string) {
  const base = `${brand}-${name}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${base}-${Date.now()}.${ext}`;
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const formData = await request.formData();
  const brand = String(formData.get('brand') || '').trim();
  const name = String(formData.get('name') || '').trim();
  const price = Number(formData.get('price'));
  const category = String(formData.get('category') || '');
  const badgeRaw = String(formData.get('badge') || '');
  const badge = badgeRaw === '' ? null : badgeRaw;
  const description = String(formData.get('description') || '').trim();
  const inStock = formData.get('inStock') === 'true';
  const imageFile = formData.get('image') as File | null;

  if (!brand || !name || !price || !category || !imageFile) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const ext = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = slugFileName(brand, name, ext);
  const arrayBuffer = await imageFile.arrayBuffer();

  const { error: uploadError } = await admin.storage
    .from('product-images')
    .upload(fileName, Buffer.from(arrayBuffer), {
      contentType: imageFile.type || 'image/jpeg',
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: `Error subiendo imagen: ${uploadError.message}` }, { status: 500 });
  }

  const { data: publicUrlData } = admin.storage.from('product-images').getPublicUrl(fileName);

  const colors = ['#1a0000', '#001a00', '#00001a', '#1a0d00', '#1a001a', '#001a1a', '#0a0a0a'];
  const imageBg = `linear-gradient(135deg, ${colors[Math.floor(Math.random() * colors.length)]} 0%, #0d0d0d 100%)`;

  const { data: maxRow } = await admin
    .from('products')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (maxRow?.sort_order ?? 0) + 10;

  const { data: inserted, error: insertError } = await admin
    .from('products')
    .insert({
      brand,
      name,
      price,
      category,
      badge,
      description,
      in_stock: inStock,
      image_url: publicUrlData.publicUrl,
      image_bg: imageBg,
      sort_order: nextSortOrder,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, product: mapProductRow(inserted) });
}
