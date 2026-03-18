import { NextResponse } from 'next/server';
import { getBootstrap } from '../../../lib/jsonDb';

export async function GET() {
  const db = await getBootstrap();
  return NextResponse.json(db, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

