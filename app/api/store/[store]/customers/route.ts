import { NextRequest, NextResponse } from 'next/server';
import { listCustomersForStore, upsertCustomerForStore } from '../../../../../lib/jsonDb';
import type { Customer } from '../../../../../types';

export async function GET(_: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const customers = await listCustomersForStore(store);
  return NextResponse.json(customers, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(req: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const customer = (await req.json().catch(() => null)) as Customer | null;
  if (!customer?.id) return NextResponse.json({ error: 'missing_customer_id' }, { status: 400 });
  const saved = await upsertCustomerForStore(store, customer);
  return NextResponse.json(saved, { headers: { 'Cache-Control': 'no-store' } });
}

