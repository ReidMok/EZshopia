import { NextRequest, NextResponse } from 'next/server';
import { createProductForStore, listProductsForStore } from '../../../../../lib/jsonDb';
import { requireAuth, isRoleAllowed } from '../../../../../lib/requireAuth';

export async function GET(req: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!isRoleAllowed(auth, ['MERCHANT_OWNER', 'MERCHANT_STAFF'])) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (auth.storeKey !== store) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const products = await listProductsForStore(store);
  if (!products) return NextResponse.json({ error: 'store_not_found' }, { status: 404 });
  return NextResponse.json(products, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!isRoleAllowed(auth, ['MERCHANT_OWNER', 'MERCHANT_STAFF'])) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (auth.storeKey !== store) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const created = await createProductForStore(store, body);
  if (!created) return NextResponse.json({ error: 'store_not_found' }, { status: 404 });
  return NextResponse.json(created, { headers: { 'Cache-Control': 'no-store' } });
}

