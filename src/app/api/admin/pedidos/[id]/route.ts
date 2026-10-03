import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const { estado, fecha_real_llegada, numero_seguimiento, notas } = body

  const updates: Record<string, unknown> = {}
  if (estado) updates.estado = estado
  if (fecha_real_llegada !== undefined) updates.fecha_real_llegada = fecha_real_llegada
  if (numero_seguimiento !== undefined) updates.numero_seguimiento = numero_seguimiento
  if (notas !== undefined) updates.notas = notas

  if (estado === 'recibido' && !fecha_real_llegada) {
    updates.fecha_real_llegada = new Date().toISOString().slice(0, 10)
  }

  const { data, error } = await supabase
    .from('pedidos')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()

  return NextResponse.json({ data, error }, { status: error ? 500 : 200 })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('pedidos').delete().eq('id', params.id)
  return NextResponse.json({ error }, { status: error ? 500 : 200 })
}
