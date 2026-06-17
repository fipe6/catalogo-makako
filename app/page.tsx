import { getSupabase, mapProductRow } from '@/lib/supabase';
import CatalogClient from './CatalogClient';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { data } = await getSupabase()
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });

  const products = (data || []).map(mapProductRow);

  return <CatalogClient products={products} />;
}
