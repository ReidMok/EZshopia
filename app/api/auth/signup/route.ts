import { NextRequest, NextResponse } from 'next/server';
import { createMerchantOwnerUser } from '../../../../lib/jsonDb';
import { AUTH_COOKIE_NAME, signAuthToken } from '../../../../lib/authToken';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = (body.email || '').toString();
  const password = (body.password || '').toString();
  const storeKey = (body.storeKey || '').toString();
  const storeName = (body.storeName || '').toString();

  if (!email || !password || !storeKey) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'password_too_short' }, { status: 400 });
  }

  try {
    const user = await createMerchantOwnerUser({ email, password, storeKey, storeName });

    const token = signAuthToken(
      { userId: user.id, email: user.email, storeKey: user.storeKey, role: user.role as any },
      7 * 24 * 60 * 60 * 1000
    );

    const res = NextResponse.json(
      { user: { id: user.id, email: user.email, storeKey: user.storeKey, role: user.role } },
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
    return NextResponse.json({ error: e?.message || 'signup_failed' }, { status: 400 });
  }
}

