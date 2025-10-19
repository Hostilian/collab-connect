import { createRateLimitResponse, getRateLimitHeaders, rateLimit, rateLimiters } from '@/lib/ratelimit';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Apply rate limiting
  const result = await rateLimit(request, rateLimiters.search);

  if (!result.success) {
    return createRateLimitResponse(result.limit, new Date(result.reset));
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const type = searchParams.get('type') || 'all'; // users, groups, properties
    const verified = searchParams.get('verified') === 'true';

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        {
          status: 400,
          headers: getRateLimitHeaders(result.limit, result.remaining, result.reset),
        }
      );
    }

    const offset = (page - 1) * limit;
    const searchTerm = `%${query.trim().toLowerCase()}%`;

    let users: any[] = [];
    let groups: any[] = [];
    let totalUsers = 0;
    let totalGroups = 0;

    // Search users
    if (type === 'all' || type === 'users') {
      const whereClause: any = {
        OR: [
          { name: { contains: query.trim(), mode: 'insensitive' } },
          { email: { contains: query.trim(), mode: 'insensitive' } },
        ],
      };

      if (verified) {
        whereClause.emailVerified = { not: null };
      }

      [users, totalUsers] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            emailVerified: true,
            createdAt: true,
            profile: {
              select: {
                bio: true,
                location: true,
                latitude: true,
                longitude: true,
                verificationLevel: true,
                phoneVerified: true,
              },
            },
          },
          skip: offset,
          take: limit,
          orderBy: [
            { emailVerified: 'desc' },
            { createdAt: 'desc' },
          ],
        }),
        prisma.user.count({ where: whereClause }),
      ]);
    }

    // Search groups
    if (type === 'all' || type === 'groups') {
      const groupWhereClause = {
        OR: [
          { name: { contains: query.trim(), mode: 'insensitive' } },
          { description: { contains: query.trim(), mode: 'insensitive' } },
        ],
      };

      [groups, totalGroups] = await Promise.all([
        prisma.group.findMany({
          where: groupWhereClause,
          select: {
            id: true,
            name: true,
            description: true,
            purpose: true,
            createdAt: true,
            _count: {
              select: {
                members: true,
              },
            },
          },
          skip: offset,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.group.count({ where: groupWhereClause }),
      ]);
    }

    const results = {
      query,
      type,
      total: totalUsers + totalGroups,
      page,
      limit,
      results: {
        users: users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          verified: !!user.emailVerified,
          phoneVerified: user.profile?.phoneVerified || false,
          verificationLevel: user.profile?.verificationLevel || 'unverified',
          bio: user.profile?.bio,
          location: user.profile?.location,
          coordinates: user.profile?.latitude && user.profile?.longitude
            ? { lat: user.profile.latitude, lng: user.profile.longitude }
            : null,
          createdAt: user.createdAt,
        })),
        groups: groups.map((group) => ({
          id: group.id,
          name: group.name,
          description: group.description,
          purpose: group.purpose,
          memberCount: group._count.members,
          createdAt: group.createdAt,
        })),
      },
    };

    return NextResponse.json(results, {
      headers: getRateLimitHeaders(result.limit, result.remaining, result.reset),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: getRateLimitHeaders(result.limit, result.remaining, result.reset),
      }
    );
  }
}
