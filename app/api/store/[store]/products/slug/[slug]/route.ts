import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlugForStore } from '../../../../../../../lib/jsonDb';

export async function GET(_: NextRequest, context: { params: { store: string; slug: string } }) {
  const { store, slug } = context.params;
  const product = await getProductBySlugForStore(store, slug);
  if (!product) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(product, { headers: { 'Cache-Control': 'no-store' } });
}

