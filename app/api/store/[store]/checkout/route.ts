import { NextRequest, NextResponse } from 'next/server';
import { createOrderFromCheckout } from '../../../../../lib/jsonDb';

export async function POST(req: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const body = await req.json().catch(() => ({}));

  const email = (body?.email || '').toString().trim().toLowerCase();
  const customerName = (body?.customerName || '').toString().trim();
  const shippingAddress = body?.shippingAddress;
  const items = Array.isArray(body?.items) ? body.items : [];

  if (!email || !customerName || !shippingAddress?.address1 || !shippingAddress?.city || !shippingAddress?.country || !shippingAddress?.zip) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  const created = await createOrderFromCheckout(store, {
    email,
    customerName,
    shippingAddress,
    items,
  });

  if ((created as any)?.error) return NextResponse.json(created, { status: 400 });
  return NextResponse.json(created, { headers: { 'Cache-Control': 'no-store' } });
}

