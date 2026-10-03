'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function PedidoForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    proveedor: '',
    producto: '',
    cantidad: '',
    precio_unitario: '',
    fecha_pedido: new Date().toISOString().slice(0, 10),
    fecha_estimada_llegada: '',
    numero_seguimiento: '',
    notas: '',
  })

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (json.error) {
        setError(json.error.message ?? 'Error al guardar')
      } else {
        setOpen(false)
        setForm({ proveedor: '', producto: '', cantidad: '', precio_unitario: '', fecha_pedido: new Date().toISOString().slice(0, 10), fecha_estimada_llegada: '', numero_seguimiento: '', notas: '' })
        router.refresh()
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button className="btn-primary" onClick={() => setOpen(true)}>
        + Nuevo pedido
      </button>
    )
  }

  return (
    <form className="pedido-form" onSubmit={submit}>
      <div className="form-header">
        <h3>Nuevo pedido</h3>
        <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>✕</button>
      </div>
      {error && <div className="error-banner">{error}</div>}
      <div className="form-grid">
        <label className="form-field">
          <span>Proveedor *</span>
          <input required value={form.proveedor} onChange={(e) => set('proveedor', e.target.value)} placeholder="Ej: NutriPro" />
        </label>
        <label className="form-field">
          <span>Producto *</span>
          <input required value={form.producto} onChange={(e) => set('producto', e.target.value)} placeholder="Nombre del producto" />
        </label>
        <label className="form-field">
          <span>Cantidad *</span>
          <input required type="number" min="1" value={form.cantidad} onChange={(e) => set('cantidad', e.target.value)} />
        </label>
        <label className="form-field">
          <span>Precio unitario (CLP)</span>
          <input type="number" min="0" value={form.precio_unitario} onChange={(e) => set('precio_unitario', e.target.value)} />
        </label>
        <label className="form-field">
          <span>Fecha pedido</span>
          <input type="date" value={form.fecha_pedido} onChange={(e) => set('fecha_pedido', e.target.value)} />
        </label>
        <label className="form-field">
          <span>Llegada estimada</span>
          <input type="date" value={form.fecha_estimada_llegada} onChange={(e) => set('fecha_estimada_llegada', e.target.value)} />
        </label>
        <label className="form-field">
          <span>N° seguimiento</span>
          <input value={form.numero_seguimiento} onChange={(e) => set('numero_seguimiento', e.target.value)} placeholder="Opcional" />
        </label>
        <label className="form-field form-field-full">
          <span>Notas</span>
          <textarea value={form.notas} onChange={(e) => set('notas', e.target.value)} rows={2} placeholder="Opcional" />
        </label>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>Cancelar</button>
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar pedido'}</button>
      </div>
    </form>
  )
}
