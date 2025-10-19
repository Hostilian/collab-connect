import { prisma } from '@/lib/prisma';
import { createRateLimitResponse, getRateLimitHeaders, rateLimit, rateLimiters } from '@/lib/ratelimit';
import { NextResponse } from 'next/server';

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

    interface UserResult {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
      emailVerified: Date | null;
      createdAt: Date;
      profile: {
        bio: string | null;
        location: string | null;
        latitude: number | null;
        longitude: number | null;
        isVerified: boolean;
      } | null;
    }

    interface GroupResult {
      id: string;
      name: string;
      description: string | null;
      type: string;
      createdAt: Date;
      _count: {
        members: number;
      };
    }

    let users: UserResult[] = [];
    let groups: GroupResult[] = [];
    let totalUsers = 0;
    let totalGroups = 0;

    // Search users
    if (type === 'all' || type === 'users') {
      const whereClause = {
        OR: [
          { name: { contains: query.trim(), mode: 'insensitive' as const } },
          { email: { contains: query.trim(), mode: 'insensitive' as const } },
        ],
        ...(verified ? { emailVerified: { not: null } } : {}),
      };


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
                isVerified: true,
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
          { name: { contains: query.trim(), mode: 'insensitive' as const } },
          { description: { contains: query.trim(), mode: 'insensitive' as const } },
        ],
      };

      [groups, totalGroups] = await Promise.all([
        prisma.group.findMany({
          where: groupWhereClause,
          select: {
            id: true,
            name: true,
            description: true,
            type: true,
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
          isVerified: user.profile?.isVerified || false,
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
          type: group.type,
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
