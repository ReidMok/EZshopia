import { NextRequest, NextResponse } from 'next/server';
import { createTestOrderForStore, listOrdersForStore } from '../../../../../lib/jsonDb';
import { requireAuth, isRoleAllowed } from '../../../../../lib/requireAuth';

export async function GET(req: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!isRoleAllowed(auth, ['MERCHANT_OWNER', 'MERCHANT_STAFF'])) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (auth.storeKey !== store) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const orders = await listOrdersForStore(store);
  return NextResponse.json(orders, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!isRoleAllowed(auth, ['MERCHANT_OWNER', 'MERCHANT_STAFF'])) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (auth.storeKey !== store) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const created = await createTestOrderForStore(store);
  return NextResponse.json(created, { headers: { 'Cache-Control': 'no-store' } });
}

