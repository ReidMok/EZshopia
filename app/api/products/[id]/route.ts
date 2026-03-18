import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProductById } from '../../../../lib/jsonDb';

export async function GET(_: NextRequest, context: { params: { id: string } }) {
  const product = await getProductById(context.params.id);
  if (!product) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(product, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const patch = await req.json().catch(() => ({}));
  const updated = await updateProductById(context.params.id, patch);
  if (!updated) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store' } });
}

