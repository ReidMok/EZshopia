import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatusForStore } from '../../../../../../lib/jsonDb';
import type { Order } from '../../../../../../types';

export async function PUT(req: NextRequest, context: { params: { store: string; orderId: string } }) {
  const { store, orderId } = context.params;
  const body = await req.json().catch(() => ({}));
  const status = body?.status as Order['status'] | undefined;
  if (!status) return NextResponse.json({ error: 'missing_status' }, { status: 400 });
  const updated = await updateOrderStatusForStore(store, orderId, status);
  if (!updated) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store' } });
}

