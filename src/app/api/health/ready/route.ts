import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, string> = {};
  const errors: string[] = [];

  // Check database connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'ok';
  } catch (_error) {
    checks.database = 'error';
    errors.push('Database connection failed');
  }

  // Check if Resend API key is configured
  if (process.env.RESEND_API_KEY) {
    checks.email = 'ok';
  } else {
    checks.email = 'not_configured';
  }

  const isReady = errors.length === 0;
  const status = isReady ? 'ready' : 'not_ready';

  return NextResponse.json(
    {
      status,
      checks,
      ...(errors.length > 0 && { errors }),
    },
    { status: isReady ? 200 : 503 }
  );
}
