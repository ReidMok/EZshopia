import { NextRequest, NextResponse } from 'next/server';
import { updateProductById } from '../../../../../../lib/jsonDb';

export async function PUT(req: NextRequest, context: { params: { store: string; id: string } }) {
  const { id } = context.params;
  const patch = await req.json().catch(() => ({}));
  const updated = await updateProductById(id, patch);
  if (!updated) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store' } });
}

