import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'makako_admin';

function expectedToken(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error('Falta configurar ADMIN_PASSWORD');
  }
  return createHmac('sha256', secret).update('admin-session').digest('hex');
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const cookieVal = store.get(COOKIE_NAME)?.value;
  if (!cookieVal) return false;
  try {
    const expected = expectedToken();
    const a = Buffer.from(cookieVal);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}
