'use client'

import { useState, useEffect, useCallback } from 'react'

type Producto = {
  id: string
  producto: string
  stock_actual: number
  stock_minimo: number | null
  precio_venta: number | null
  activo: boolean
  updated_at: string | null
}

function formatCLP(price: number): string {
  return '$' + price.toLocaleString('es-CL')
}

function stockStatus(actual: number, minimo: number | null) {
  if (actual <= 0) return { label: 'Agotado', className: 'stock-badge stock-out' }
  if (minimo && actual <= minimo) return { label: 'Quedan pocos', className: 'stock-badge stock-low' }
  return { label: 'Disponible', className: 'stock-badge stock-ok' }
}

export function Catalogo({ initialData }: { initialData: Producto[] }) {
  const [productos, setProductos] = useState<Producto[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/inventario?t=' + Date.now(), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      })
      const json = await res.json()
      console.log('[Catalogo refresh] Data recibida:', json.data?.length, 'productos')
      console.log('[Catalogo refresh] Timestamp servidor:', json.timestamp)
      if (json.error) {
        console.error('[Catalogo refresh] Error:', json.error)
        setError(json.error.message || 'Error al cargar datos')
      } else if (json.data) {
        setProductos(json.data)
        setLastUpdate(new Date())
      }
    } catch (err) {
      console.error('[Catalogo refresh] Fetch error:', err)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refresh()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) refresh()
    }
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [refresh])

  const disponibles = productos.filter((p) => p.stock_actual > 0)
  const agotados = productos.filter((p) => p.stock_actual <= 0)

  return (
    <>
      <div className="debug-bar">
        Supabase: {process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').split('.')[0]} |
        Productos: {productos.length} |
        Fuente: tabla inventario (directo)
      </div>

      <div className="toolbar">
        <span>
          {disponibles.length} disponibles
          {agotados.length > 0 && ` · ${agotados.length} agotados`}
          {' · '}
          {lastUpdate.toLocaleTimeString('es-CL')}
        </span>
        <button className="refresh-btn" onClick={refresh} disabled={loading}>
          <span className={loading ? 'spinning' : ''}>&#x21bb;</span>
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {disponibles.length === 0 && !loading ? (
        <div className="empty-state">
          <p>No hay productos disponibles en este momento.</p>
        </div>
      ) : (
        <div className="grid">
          {disponibles.map((p) => {
            const status = stockStatus(p.stock_actual, p.stock_minimo)
            return (
              <div key={p.id} className="card">
                <div className="card-name">{p.producto}</div>
                <div className="card-bottom">
                  <span className="card-price">
                    {p.precio_venta ? formatCLP(p.precio_venta) : 'Consultar'}
                  </span>
                  <span className={status.className}>{status.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {agotados.length > 0 && (
        <>
          <div className="toolbar" style={{ marginTop: '1rem' }}>
            <span>Agotados temporalmente</span>
          </div>
          <div className="grid">
            {agotados.map((p) => (
              <div key={p.id} className="card" style={{ opacity: 0.5 }}>
                <div className="card-name">{p.producto}</div>
                <div className="card-bottom">
                  <span className="card-price">
                    {p.precio_venta ? formatCLP(p.precio_venta) : 'Consultar'}
                  </span>
                  <span className="stock-badge stock-out">Agotado</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
