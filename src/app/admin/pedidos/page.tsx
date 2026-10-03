import { supabase } from '@/lib/supabase'
import { formatCLP } from '@/lib/format'
import { PedidoForm } from '@/components/pedido-form'
import { PedidoAcciones } from '@/components/pedido-acciones'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Pedido = {
  id: string
  proveedor: string
  producto: string
  cantidad: number
  precio_unitario: number | null
  fecha_pedido: string
  fecha_estimada_llegada: string | null
  fecha_real_llegada: string | null
  numero_seguimiento: string | null
  estado: 'pendiente' | 'en_camino' | 'recibido' | 'cancelado'
  notas: string | null
}

type LeadTimeStat = {
  proveedor: string
  promedio: number
  pedidos: number
}

function calcLeadTimes(pedidos: Pedido[]): LeadTimeStat[] {
  const byProv: Record<string, number[]> = {}
  for (const p of pedidos) {
    if (p.estado === 'recibido' && p.fecha_pedido && p.fecha_real_llegada) {
      const dias = Math.round(
        (new Date(p.fecha_real_llegada).getTime() - new Date(p.fecha_pedido).getTime()) / 86400000
      )
      if (!byProv[p.proveedor]) byProv[p.proveedor] = []
      byProv[p.proveedor].push(dias)
    }
  }
  return Object.entries(byProv)
    .map(([proveedor, tiempos]) => ({
      proveedor,
      promedio: Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length),
      pedidos: tiempos.length,
    }))
    .sort((a, b) => a.promedio - b.promedio)
}

const ESTADO_LABEL: Record<string, string> = {
  pendiente: 'Pendiente',
  en_camino: 'En camino',
  recibido: 'Recibido',
  cancelado: 'Cancelado',
}

async function getPedidos(): Promise<Pedido[]> {
  const { data } = await supabase.from('pedidos').select('*').order('fecha_pedido', { ascending: false })
  return data ?? []
}

export default async function PedidosPage() {
  const pedidos = await getPedidos()
  const leadTimes = calcLeadTimes(pedidos)
  const activos = pedidos.filter((p) => p.estado !== 'cancelado' && p.estado !== 'recibido')
  const historial = pedidos.filter((p) => p.estado === 'recibido' || p.estado === 'cancelado')

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2 className="admin-title">Pedidos y envíos</h2>
        <PedidoForm />
      </div>

      {leadTimes.length > 0 && (
        <div className="lead-times">
          <h3 className="section-sub">Lead time por proveedor</h3>
          <div className="lead-grid">
            {leadTimes.map((l) => (
              <div key={l.proveedor} className="lead-card">
                <div className="lead-prov">{l.proveedor}</div>
                <div className="lead-days">{l.promedio}d</div>
                <div className="lead-count">{l.pedidos} pedido{l.pedidos !== 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activos.length > 0 && (
        <>
          <h3 className="section-sub">En curso</h3>
          <div className="pedidos-list">
            {activos.map((p) => (
              <div key={p.id} className={'pedido-card estado-' + p.estado}>
                <div className="pedido-header">
                  <div>
                    <span className="pedido-producto">{p.producto}</span>
                    <span className="pedido-prov"> · {p.proveedor}</span>
                  </div>
                  <span className={'estado-badge estado-' + p.estado}>{ESTADO_LABEL[p.estado]}</span>
                </div>
                <div className="pedido-meta">
                  <span>Cant: {p.cantidad}</span>
                  {p.precio_unitario && <span>Total: {formatCLP(p.precio_unitario * p.cantidad)}</span>}
                  <span>Pedido: {p.fecha_pedido}</span>
                  {p.fecha_estimada_llegada && <span>Llega est.: {p.fecha_estimada_llegada}</span>}
                  {p.numero_seguimiento && <span>Track: {p.numero_seguimiento}</span>}
                </div>
                {p.notas && <div className="pedido-notas">{p.notas}</div>}
                <PedidoAcciones id={p.id} estado={p.estado} />
              </div>
            ))}
          </div>
        </>
      )}

      {activos.length === 0 && (
        <p className="admin-empty">No hay pedidos activos.</p>
      )}

      {historial.length > 0 && (
        <>
          <h3 className="section-sub" style={{ marginTop: '1.5rem' }}>Historial</h3>
          <div className="pedidos-list">
            {historial.map((p) => (
              <div key={p.id} className={'pedido-card estado-' + p.estado}>
                <div className="pedido-header">
                  <div>
                    <span className="pedido-producto">{p.producto}</span>
                    <span className="pedido-prov"> · {p.proveedor}</span>
                  </div>
                  <span className={'estado-badge estado-' + p.estado}>{ESTADO_LABEL[p.estado]}</span>
                </div>
                <div className="pedido-meta">
                  <span>Cant: {p.cantidad}</span>
                  {p.precio_unitario && <span>Total: {formatCLP(p.precio_unitario * p.cantidad)}</span>}
                  <span>Pedido: {p.fecha_pedido}</span>
                  {p.fecha_real_llegada && (
                    <span>
                      Llegó: {p.fecha_real_llegada}
                      {' '}({Math.round((new Date(p.fecha_real_llegada).getTime() - new Date(p.fecha_pedido).getTime()) / 86400000)}d)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
