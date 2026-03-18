import { NextRequest, NextResponse } from 'next/server';
import { getStoreBootstrap } from '../../../../../lib/jsonDb';

export async function GET(_: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const data = await getStoreBootstrap(store);
  if (!data) return NextResponse.json({ error: 'store_not_found' }, { status: 404 });
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
}

