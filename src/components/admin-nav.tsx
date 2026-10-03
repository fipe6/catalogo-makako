'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Resumen mensual' },
  { href: '/admin/inventario', label: 'Rotación' },
  { href: '/admin/pedidos', label: 'Pedidos' },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="admin-nav">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={'admin-nav-link' + (pathname === l.href ? ' active' : '')}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  )
}
