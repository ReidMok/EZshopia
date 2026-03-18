import { NextRequest, NextResponse } from 'next/server';
import { createProduct, listProducts } from '../../../lib/jsonDb';

export async function GET() {
  const products = await listProducts();
  return NextResponse.json(products, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const product = await createProduct(body);
  return NextResponse.json(product, { headers: { 'Cache-Control': 'no-store' } });
}

