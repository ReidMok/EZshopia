import { NextRequest, NextResponse } from 'next/server';
import { authenticateMerchantOwnerUser } from '../../../../lib/jsonDb';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = (body.email || '').toString();
  const password = (body.password || '').toString();

  if (!email || !password) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  try {
    const { user, storeConfig } = await authenticateMerchantOwnerUser({ email, password });
    return NextResponse.json(
      {
        user: { id: user.id, email: user.email, storeKey: user.storeKey, role: user.role },
        storeConfig,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'signin_failed' }, { status: 401 });
  }
}

