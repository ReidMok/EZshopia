import { NextRequest, NextResponse } from 'next/server';
import { createProductForStore, listProductsForStore } from '../../../../../lib/jsonDb';

export async function GET(_: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const products = await listProductsForStore(store);
  if (!products) return NextResponse.json({ error: 'store_not_found' }, { status: 404 });
  return NextResponse.json(products, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const body = await req.json().catch(() => ({}));
  const created = await createProductForStore(store, body);
  if (!created) return NextResponse.json({ error: 'store_not_found' }, { status: 404 });
  return NextResponse.json(created, { headers: { 'Cache-Control': 'no-store' } });
}

