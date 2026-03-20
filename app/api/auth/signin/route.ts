import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '../../../../lib/jsonDb';
import { AUTH_COOKIE_NAME, signAuthToken } from '../../../../lib/authToken';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = (body.email || '').toString();
  const password = (body.password || '').toString();

  if (!email || !password) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  try {
    const { user, storeConfig } = await authenticateUser({ email, password });

    const token = signAuthToken(
      { userId: user.id, email: user.email, storeKey: user.storeKey, role: user.role as any },
      7 * 24 * 60 * 60 * 1000
    );

    const res = NextResponse.json(
      {
        user: { id: user.id, email: user.email, storeKey: user.storeKey, role: user.role },
        storeConfig,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      secure: process.env.NODE_ENV === 'production',
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'signin_failed' }, { status: 401 });
  }
}

