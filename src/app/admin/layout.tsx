import { AdminNav } from '@/components/admin-nav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="header">
        <h1>Makako Admin</h1>
        <p className="subtitle">Gestión del negocio</p>
      </header>
      <AdminNav />
      <main className="admin-main">{children}</main>
    </>
  )
}
