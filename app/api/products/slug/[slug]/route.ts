import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '../../../../../lib/jsonDb';

export async function GET(_: NextRequest, context: { params: { slug: string } }) {
  const slug = context.params.slug;
  const product = await getProductBySlug(slug);
  if (!product) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(product, { headers: { 'Cache-Control': 'no-store' } });
}

