import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '../../../../lib/authToken';

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  res.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}

