import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Product } from '@/data/products';

let cachedClient: SupabaseClient | null = null;
let cachedAdmin: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!cachedClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('Falta configurar NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    cachedClient = createClient(url, key);
  }
  return cachedClient;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!cachedAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      throw new Error('Falta configurar NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    }
    cachedAdmin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return cachedAdmin;
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
