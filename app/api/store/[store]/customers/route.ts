import { NextRequest, NextResponse } from 'next/server';
import { listCustomersForStore, upsertCustomerForStore } from '../../../../../lib/jsonDb';
import type { Customer } from '../../../../../types';
import { requireAuth, isRoleAllowed } from '../../../../../lib/requireAuth';

export async function GET(req: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!isRoleAllowed(auth, ['MERCHANT_OWNER', 'MERCHANT_STAFF'])) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (auth.storeKey !== store) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const customers = await listCustomersForStore(store);
  return NextResponse.json(customers, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(req: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!isRoleAllowed(auth, ['MERCHANT_OWNER', 'MERCHANT_STAFF'])) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (auth.storeKey !== store) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const customer = (await req.json().catch(() => null)) as Customer | null;
  if (!customer?.id) return NextResponse.json({ error: 'missing_customer_id' }, { status: 400 });
  const saved = await upsertCustomerForStore(store, customer);
  return NextResponse.json(saved, { headers: { 'Cache-Control': 'no-store' } });
}

