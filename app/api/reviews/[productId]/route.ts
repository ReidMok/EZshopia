import { NextRequest, NextResponse } from 'next/server';
import { getOrCreatePublicReviews } from '../../../../lib/jsonDb';

export async function GET(_: NextRequest, context: { params: { productId: string } }) {
  const reviews = await getOrCreatePublicReviews(context.params.productId);
  // Only return visible reviews to storefront
  const visible = (reviews || []).filter((r: any) => (r.visibility || 'VISIBLE') === 'VISIBLE');
  return NextResponse.json(visible, { headers: { 'Cache-Control': 'no-store' } });
}

