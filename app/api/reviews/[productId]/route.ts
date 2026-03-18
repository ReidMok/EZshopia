import { NextRequest, NextResponse } from 'next/server';
import { getOrCreatePublicReviews } from '../../../../lib/jsonDb';

export async function GET(_: NextRequest, context: { params: { productId: string } }) {
  const reviews = await getOrCreatePublicReviews(context.params.productId);
  return NextResponse.json(reviews, { headers: { 'Cache-Control': 'no-store' } });
}

