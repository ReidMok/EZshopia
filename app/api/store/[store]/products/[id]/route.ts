import { NextRequest, NextResponse } from 'next/server';
import { updateProductById } from '../../../../../../lib/jsonDb';
import { requireAuth, isRoleAllowed } from '../../../../../../lib/requireAuth';

export async function PUT(req: NextRequest, context: { params: { store: string; id: string } }) {
  const { id } = context.params;
  const store = context.params.store;
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!isRoleAllowed(auth, ['MERCHANT_OWNER', 'MERCHANT_STAFF'])) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (auth.storeKey !== store) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const patch = await req.json().catch(() => ({}));
  const updated = await updateProductById(id, patch);
  if (!updated) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store' } });
}

