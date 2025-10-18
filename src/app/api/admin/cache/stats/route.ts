import { getCacheStats } from '@/lib/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stats = await getCacheStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Cache stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cache stats' },
      { status: 500 }
    );
  }
}
