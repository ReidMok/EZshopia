import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatusForStore } from '../../../../../../lib/jsonDb';
import type { Order } from '../../../../../../types';
import { requireAuth, isRoleAllowed } from '../../../../../../lib/requireAuth';

export async function PUT(req: NextRequest, context: { params: { store: string; orderId: string } }) {
  const { store, orderId } = context.params;
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!isRoleAllowed(auth, ['MERCHANT_OWNER', 'MERCHANT_STAFF'])) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (auth.storeKey !== store) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const status = body?.status as Order['status'] | undefined;
  if (!status) return NextResponse.json({ error: 'missing_status' }, { status: 400 });
  const updated = await updateOrderStatusForStore(store, orderId, status);
  if (!updated) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store' } });
}

