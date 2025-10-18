/**
 * Company Transparency API
 * GET /api/transparency/company - Look up company information
 */

import { getCompanyData } from '@/lib/api-integrations';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const companyName = searchParams.get('name');
    const jurisdiction = searchParams.get('jurisdiction');

    if (!companyName) {
      return NextResponse.json(
        { error: 'Company name required' },
        { status: 400 }
      );
    }

    const companies = await getCompanyData(
      companyName,
      jurisdiction || undefined
    );

    return NextResponse.json({
      companies,
      count: companies.length,
      query: companyName,
      jurisdiction: jurisdiction || 'all',
    });
  } catch (error) {
    console.error('Company lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to lookup company' },
      { status: 500 }
    );
  }
}
