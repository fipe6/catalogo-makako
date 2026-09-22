import { supabase } from '@/lib/supabase'
import { Catalogo } from '@/components/catalogo'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  console.log('[Page] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

  const { data, error } = await supabase
    .from('inventario')
    .select('id, producto, stock_actual, stock_minimo, precio_venta, activo, updated_at')
    .eq('activo', true)
    .order('producto')

  console.log('[Page] Data recibida:', data?.length, 'productos')
  console.log('[Page] Error:', error)

  return (
    <>
      <header className="header">
        <h1>Makako Suplementos</h1>
        <p className="subtitle">Catálogo de productos</p>
      </header>
      <Catalogo initialData={data ?? []} />
    </>
  )
}
