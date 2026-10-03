'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Estado = 'pendiente' | 'en_camino' | 'recibido' | 'cancelado'

const NEXT_STATE: Record<string, Estado | null> = {
  pendiente: 'en_camino',
  en_camino: 'recibido',
  recibido: null,
  cancelado: null,
}

const NEXT_LABEL: Record<string, string> = {
  pendiente: 'Marcar en camino',
  en_camino: 'Marcar recibido',
}

export function PedidoAcciones({ id, estado }: { id: string; estado: Estado }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const next = NEXT_STATE[estado]

  async function avanzar() {
    if (!next) return
    setLoading(true)
    try {
      await fetch(`/api/admin/pedidos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: next }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  async function cancelar() {
    setLoading(true)
    try {
      await fetch(`/api/admin/pedidos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'cancelado' }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (estado === 'recibido' || estado === 'cancelado') return null

  return (
    <div className="pedido-acciones">
      {next && (
        <button className="btn-sm btn-primary" onClick={avanzar} disabled={loading}>
          {NEXT_LABEL[estado]}
        </button>
      )}
      <button className="btn-sm btn-ghost" onClick={cancelar} disabled={loading}>
        Cancelar
      </button>
    </div>
  )
}
