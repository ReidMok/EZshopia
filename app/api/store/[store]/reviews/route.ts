import { NextRequest, NextResponse } from 'next/server';
import { listPublicReviewsForStore, setReviewVisibility } from '../../../../../lib/jsonDb';
import { requireAuth, isRoleAllowed } from '../../../../../lib/requireAuth';

export async function GET(req: NextRequest, context: { params: { store: string } }) {
  const store = context.params.store;
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!isRoleAllowed(auth, ['MERCHANT_OWNER', 'MERCHANT_STAFF'])) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (auth.storeKey !== store) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const reviews = await listPublicReviewsForStore(store);
  return NextResponse.json(reviews, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(req: NextRequest, context: { params: { store: string } }) {
  const { store } = context.params;
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!isRoleAllowed(auth, ['MERCHANT_OWNER', 'MERCHANT_STAFF'])) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (auth.storeKey !== store) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

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

