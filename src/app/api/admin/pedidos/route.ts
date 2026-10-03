import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('fecha_pedido', { ascending: false })

  return NextResponse.json({ data, error })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { proveedor, producto, cantidad, precio_unitario, fecha_pedido, fecha_estimada_llegada, numero_seguimiento, notas } = body

  if (!proveedor || !producto || !cantidad) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('pedidos')
    .insert({
      proveedor,
      producto,
      cantidad: parseInt(cantidad),
      precio_unitario: precio_unitario ? parseInt(precio_unitario) : null,
      fecha_pedido: fecha_pedido || new Date().toISOString().slice(0, 10),
      fecha_estimada_llegada: fecha_estimada_llegada || null,
      numero_seguimiento: numero_seguimiento || null,
      notas: notas || null,
      estado: 'pendiente',
    })
    .select()
    .single()

  return NextResponse.json({ data, error }, { status: error ? 500 : 201 })
}
