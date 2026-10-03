import { supabase } from '@/lib/supabase'
import { formatCLP, monthLabel, toYearMonth } from '@/lib/format'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type VentaEntry = {
  fecha: string
  total: number
  margen: number
  cantidad: number
  producto: string
}

type GastoEntry = {
  fecha: string
  monto: number
  tipo: string
  categoria?: string
  descripcion?: string
}

type MetaEntry = {
  mes: string
  meta: number
}

type MonthData = {
  ym: string
  ventas: number
  margen: number
  gastos: number
  neto: number
  meta: number
}

async function getMonthlyData(): Promise<MonthData[]> {
  const [ventasRes, gastosRes, metasRes] = await Promise.all([
    supabase.from('app_data').select('valor').eq('clave', 'macaco:ventas').single(),
    supabase.from('app_data').select('valor').eq('clave', 'macaco:gastos').single(),
    supabase.from('app_data').select('valor').eq('clave', 'macaco:config').single(),
  ])

  const ventas: VentaEntry[] = ventasRes.data?.valor ?? []
  const gastos: GastoEntry[] = gastosRes.data?.valor ?? []
  const config = metasRes.data?.valor ?? {}
  const metaMensual: number = config.metaMensual ?? 0

  const byMonth: Record<string, MonthData> = {}

  for (const v of ventas) {
    if (!v.fecha) continue
    const ym = toYearMonth(v.fecha)
    if (!byMonth[ym]) byMonth[ym] = { ym, ventas: 0, margen: 0, gastos: 0, neto: 0, meta: metaMensual }
    byMonth[ym].ventas += v.total ?? 0
    byMonth[ym].margen += v.margen ?? 0
  }

  for (const g of gastos) {
    if (!g.fecha || g.tipo !== 'negocio') continue
    const ym = toYearMonth(g.fecha)
    if (!byMonth[ym]) byMonth[ym] = { ym, ventas: 0, margen: 0, gastos: 0, neto: 0, meta: metaMensual }
    byMonth[ym].gastos += g.monto ?? 0
  }

  for (const m of Object.values(byMonth)) {
    m.neto = m.margen - m.gastos
  }

  return Object.values(byMonth).sort((a, b) => b.ym.localeCompare(a.ym))
}

export default async function AdminPage() {
  const months = await getMonthlyData()

  return (
    <div className="admin-section">
      <h2 className="admin-title">Historial mensual</h2>
      {months.length === 0 ? (
        <p className="admin-empty">No hay datos registrados.</p>
      ) : (
        <div className="month-list">
          {months.map((m) => {
            const pct = m.meta > 0 ? Math.round((m.ventas / m.meta) * 100) : null
            const netoPositivo = m.neto >= 0
            return (
              <div key={m.ym} className="month-card">
                <div className="month-card-header">
                  <span className="month-label">{monthLabel(m.ym)}</span>
                  {pct !== null && (
                    <span className={'month-badge ' + (pct >= 100 ? 'badge-green' : pct >= 70 ? 'badge-orange' : 'badge-red')}>
                      {pct}% meta
                    </span>
                  )}
                </div>
                <div className="month-stats">
                  <div className="stat-row">
                    <span className="stat-label">Ventas</span>
                    <span className="stat-value">{formatCLP(m.ventas)}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Ganancia bruta</span>
                    <span className="stat-value">{formatCLP(m.margen)}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Gastos negocio</span>
                    <span className="stat-value neg">{formatCLP(m.gastos)}</span>
                  </div>
                  <div className="stat-row stat-total">
                    <span className="stat-label">Resultado neto</span>
                    <span className={'stat-value ' + (netoPositivo ? 'pos' : 'neg')}>{formatCLP(m.neto)}</span>
                  </div>
                  {m.meta > 0 && (
                    <div className="month-progress">
                      <div className="progress-bar">
                        <div
                          className={'progress-fill ' + (pct! >= 100 ? 'fill-green' : pct! >= 70 ? 'fill-orange' : 'fill-red')}
                          style={{ width: Math.min(pct ?? 0, 100) + '%' }}
                        />
                      </div>
                      <span className="progress-label">Meta: {formatCLP(m.meta)}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
