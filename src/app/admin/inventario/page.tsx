import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type VentaEntry = {
  fecha: string
  producto: string
  cantidad: number
}

type InventarioRow = {
  producto: string
  stock_actual: number
  stock_minimo: number | null
  updated_at: string | null
}

type RotacionRow = {
  producto: string
  stock_actual: number
  stock_minimo: number | null
  unidades_vendidas_30d: number
  promedio_diario: number
  dias_restantes: number | null
  urgencia: 'critico' | 'bajo' | 'ok' | 'lento'
}

async function getRotacion(): Promise<RotacionRow[]> {
  const hace30 = new Date()
  hace30.setDate(hace30.getDate() - 30)
  const hace30str = hace30.toISOString().slice(0, 10)

  const [invRes, ventasRes] = await Promise.all([
    supabase
      .from('inventario')
      .select('producto, stock_actual, stock_minimo, updated_at')
      .eq('activo', true)
      .order('producto'),
    supabase.from('app_data').select('valor').eq('clave', 'macaco:ventas').single(),
  ])

  const inventario: InventarioRow[] = invRes.data ?? []
  const todasVentas: VentaEntry[] = ventasRes.data?.valor ?? []

  const ventas30d = todasVentas.filter((v) => v.fecha >= hace30str)
  const vendidoPorProducto: Record<string, number> = {}
  for (const v of ventas30d) {
    vendidoPorProducto[v.producto] = (vendidoPorProducto[v.producto] ?? 0) + (v.cantidad ?? 1)
  }

  return inventario.map((p): RotacionRow => {
    const vendidos = vendidoPorProducto[p.producto] ?? 0
    const promedio = vendidos / 30
    const diasRestantes = promedio > 0 ? Math.floor(p.stock_actual / promedio) : null

    let urgencia: RotacionRow['urgencia'] = 'lento'
    if (diasRestantes !== null) {
      if (diasRestantes <= 7) urgencia = 'critico'
      else if (p.stock_minimo !== null && p.stock_actual <= p.stock_minimo) urgencia = 'bajo'
      else if (diasRestantes <= 21) urgencia = 'bajo'
      else urgencia = 'ok'
    }

    return {
      producto: p.producto,
      stock_actual: p.stock_actual,
      stock_minimo: p.stock_minimo,
      unidades_vendidas_30d: vendidos,
      promedio_diario: promedio,
      dias_restantes: diasRestantes,
      urgencia,
    }
  }).sort((a, b) => {
    const order = { critico: 0, bajo: 1, ok: 2, lento: 3 }
    return order[a.urgencia] - order[b.urgencia]
  })
}

export default async function RotacionPage() {
  const rows = await getRotacion()

  return (
    <div className="admin-section">
      <h2 className="admin-title">Rotación de inventario</h2>
      <p className="admin-subtitle">Basado en ventas de los últimos 30 días</p>
      <div className="rot-table-wrap">
        <table className="rot-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th className="num">Stock</th>
              <th className="num">Vendidos (30d)</th>
              <th className="num">Días restantes</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.producto} className={'rot-row-' + r.urgencia}>
                <td>{r.producto}</td>
                <td className="num">{r.stock_actual}</td>
                <td className="num">{r.unidades_vendidas_30d}</td>
                <td className="num">{r.dias_restantes !== null ? r.dias_restantes + 'd' : '—'}</td>
                <td>
                  <span className={'rot-badge rot-' + r.urgencia}>
                    {r.urgencia === 'critico' ? 'Crítico' :
                     r.urgencia === 'bajo' ? 'Bajo' :
                     r.urgencia === 'ok' ? 'OK' : 'Sin rotación'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
