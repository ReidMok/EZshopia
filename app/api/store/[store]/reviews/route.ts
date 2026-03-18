import { NextRequest, NextResponse } from 'next/server';
import { listPublicReviewsForStore, setReviewVisibility } from '../../../../../lib/jsonDb';

export async function GET(_: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const reviews = await listPublicReviewsForStore(store);
  return NextResponse.json(reviews, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(req: NextRequest, context: { params: { store: string } }) {
  const { store } = context.params;
  const body = await req.json().catch(() => ({}));
  const productId = body?.productId as string | undefined;
  const reviewId = body?.reviewId as string | undefined;
  const visibility = body?.visibility as 'VISIBLE' | 'HIDDEN' | undefined;
  if (!productId || !reviewId || !visibility) return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  const updated = await setReviewVisibility(productId, reviewId, visibility);
  if (!updated) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  // Store param currently not used because reviews keyed by productId; kept for route consistency.
  return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store' } });
}

