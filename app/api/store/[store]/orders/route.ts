import { NextRequest, NextResponse } from 'next/server';
import { createTestOrderForStore, listOrdersForStore } from '../../../../../lib/jsonDb';

export async function GET(_: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const orders = await listOrdersForStore(store);
  return NextResponse.json(orders, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(_: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const created = await createTestOrderForStore(store);
  return NextResponse.json(created, { headers: { 'Cache-Control': 'no-store' } });
}

