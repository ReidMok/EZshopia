import { NextRequest, NextResponse } from 'next/server';
import { getStoreConfigByKey, updateStoreConfigByKey } from '../../../../../lib/jsonDb';

export async function GET(_: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const config = await getStoreConfigByKey(store);
  if (!config) return NextResponse.json({ error: 'store_not_found' }, { status: 404 });
  return NextResponse.json(config, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(req: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const patch = await req.json().catch(() => ({}));
  const updated = await updateStoreConfigByKey(store, patch);
  if (!updated) return NextResponse.json({ error: 'store_not_found' }, { status: 404 });
  return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store' } });
}

