import { NextRequest, NextResponse } from 'next/server';
import { getStoreBootstrap } from '../../../../../lib/jsonDb';
import { requireAuth, isRoleAllowed } from '../../../../../lib/requireAuth';

export async function GET(req: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  // Merchant admin only
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!isRoleAllowed(auth, ['MERCHANT_OWNER', 'MERCHANT_STAFF'])) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (auth.storeKey !== store) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const data = await getStoreBootstrap(store);
  if (!data) return NextResponse.json({ error: 'store_not_found' }, { status: 404 });
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
}

