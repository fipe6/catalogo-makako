import type { Metadata } from 'next';
import { isAdminAuthenticated } from '@/lib/auth';
import LoginForm from './LoginForm';
import AdminDashboard from './AdminDashboard';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminProductosPage() {
  const authed = await isAdminAuthenticated();
  return authed ? <AdminDashboard /> : <LoginForm />;
}
