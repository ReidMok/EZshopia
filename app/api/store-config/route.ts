import { NextRequest, NextResponse } from 'next/server';
import { getStoreConfig, updateStoreConfig } from '../../../lib/jsonDb';

export async function GET() {
  const config = await getStoreConfig();
  return NextResponse.json(config, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(req: NextRequest) {
  const patch = await req.json().catch(() => ({}));
  const updated = await updateStoreConfig(patch);
  return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store' } });
}

