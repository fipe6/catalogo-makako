import { createClient } from '@supabase/supabase-js';
import type { Product } from '@/data/products';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('Falta configurar SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

interface ProductRow {
  id: string;
  brand: string;
  name: string;
  price: number;
  category: string;
  badge: string | null;
  description: string;
  in_stock: boolean;
  image_url: string;
  image_bg: string;
  sort_order: number;
}

export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    brand: row.brand,
    name: row.name,
    price: row.price,
    category: row.category as Product['category'],
    badge: row.badge as Product['badge'],
    description: row.description,
    inStock: row.in_stock,
    image: row.image_url,
    imageBg: row.image_bg,
  };
}
