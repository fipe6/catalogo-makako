import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, setAdminSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }
  await setAdminSession();
  return NextResponse.json({ ok: true });
}
