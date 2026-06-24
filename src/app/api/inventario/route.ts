import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  console.log('[API /inventario] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

  const { data, error } = await supabase
    .from('inventario')
    .select('id, producto, stock_actual, stock_minimo, precio_venta, activo, updated_at')
    .eq('activo', true)
    .gt('stock_actual', 0)
    .order('producto')

  console.log('[API /inventario] Data recibida:', data?.length, 'productos')
  console.log('[API /inventario] Error:', error)

  return NextResponse.json(
    { data, error, timestamp: new Date().toISOString() },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  )
}
