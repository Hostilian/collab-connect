// API endpoint to serve user locations for the map
import { prisma } from '@/lib/prisma';
import { getClientId, getRateLimitHeaders, rateLimiters } from '@/lib/ratelimit';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Rate limiting
        const identifier = getClientId(request);

        if (rateLimiters.map) {
            const { success, limit, remaining: _remaining, reset } = await rateLimiters.map.limit(identifier);

            if (!success) {
                const retryAfter = Math.ceil((new Date(reset).getTime() - Date.now()) / 1000);
                return NextResponse.json(
                    {
                        error: 'Too Many Requests',
                        message: 'Rate limit exceeded. Please try again later.',
                    },
                    {
                        status: 429,
                        headers: {
                            'Retry-After': retryAfter.toString(),
                            ...getRateLimitHeaders(limit, 0, reset),
                        },
                    }
                );
            }
        }

        const { searchParams } = new URL(request.url);

        // Pagination parameters
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '100');
        const skip = (page - 1) * limit;

        // Filter parameters
    const verifiedFilter = searchParams.get('verified'); // 'true' | 'false'
        const minLat = parseFloat(searchParams.get('minLat') || '-90');
        const maxLat = parseFloat(searchParams.get('maxLat') || '90');
        const minLng = parseFloat(searchParams.get('minLng') || '-180');
        const maxLng = parseFloat(searchParams.get('maxLng') || '180');

        // Build query filters
        const profileIs: {
            AND: [
                { latitude: { gte: number; lte: number } },
                { longitude: { gte: number; lte: number } },
            ];
            isVerified?: boolean;
        } = {
            AND: [
                { latitude: { gte: minLat, lte: maxLat } },
                { longitude: { gte: minLng, lte: maxLng } },
            ],
        };

        const where = {
            profile: { is: profileIs },
        };

        // Add verification filter if specified
        if (verifiedFilter === 'true') {
            profileIs.isVerified = true;
        } else if (verifiedFilter === 'false') {
            profileIs.isVerified = false;
        }

        // Fetch users with location data
        const users = await prisma.user.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                profile: {
                    select: {
                        bio: true,
                        latitude: true,
                        longitude: true,
                        location: true,
                        isVerified: true,
                        verifiedAt: true,
                    },
                },
                collaborations: {
                    take: 1,
                    orderBy: { joinedAt: 'desc' },
                    select: {
                        collaboration: {
                            select: { title: true, createdAt: true },
                        },
                    },
                },
            },
        });

        // Count total matching users for pagination
        const total = await prisma.user.count({ where });

        // Define User type from query
    type UserWithProfile = typeof users[number];

        // Transform data for map display
        const mapUsers = users
            .filter((user: UserWithProfile) => user.profile?.latitude != null && user.profile?.longitude != null)
            .map((user: UserWithProfile) => {
                const lastMember = user.collaborations[0];
                const lastTitle = lastMember?.collaboration?.title;
                const lastDate = lastMember?.collaboration?.createdAt;
                return {
                    id: user.id,
                    name: user.name || 'Anonymous User',
                    latitude: user.profile!.latitude!,
                    longitude: user.profile!.longitude!,
                    bio: user.profile!.bio || 'No bio yet',
                    verified: user.profile!.isVerified,
                    location: user.profile!.location || null,
                    lastCollaboration: lastTitle && lastDate
                        ? `${lastTitle} • ${new Date(lastDate).toLocaleDateString()}`
                        : null,
                };
            });

        return NextResponse.json({
            users: mapUsers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Map API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch map data' },
            { status: 500 }
        );
    }
}
