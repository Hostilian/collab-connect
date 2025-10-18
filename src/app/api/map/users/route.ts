// API endpoint to serve user locations for the map
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Pagination parameters
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '100');
        const skip = (page - 1) * limit;

        // Filter parameters
        const verificationLevel = searchParams.get('verificationLevel'); // 'verified', 'pending', 'unverified'
        const minLat = parseFloat(searchParams.get('minLat') || '-90');
        const maxLat = parseFloat(searchParams.get('maxLat') || '90');
        const minLng = parseFloat(searchParams.get('minLng') || '-180');
        const maxLng = parseFloat(searchParams.get('maxLng') || '180');

        // Build query filters
        type WhereClause = {
            profile?: {
                isNot: null;
                AND: Array<{ latitude?: { gte: number; lte: number }; longitude?: { gte: number; lte: number } }>;
            };
            verificationLevel?: string;
        };

        const where: WhereClause = {
            profile: {
                isNot: null,
                AND: [
                    { latitude: { gte: minLat, lte: maxLat } },
                    { longitude: { gte: minLng, lte: maxLng } },
                ],
            },
        };

        // Add verification filter if specified
        if (verificationLevel) {
            where.verificationLevel = verificationLevel;
        }

        // Fetch users with location data
        const users = await prisma.user.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                verificationLevel: true,
                profile: {
                    select: {
                        bio: true,
                        latitude: true,
                        longitude: true,
                        city: true,
                        state: true,
                    },
                },
                collaborationsInitiated: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        title: true,
                        createdAt: true,
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
            .filter((user: UserWithProfile) => user.profile?.latitude && user.profile?.longitude)
            .map((user: UserWithProfile) => ({
                id: user.id,
                name: user.name || 'Anonymous User',
                latitude: user.profile!.latitude,
                longitude: user.profile!.longitude,
                bio: user.profile!.bio || 'No bio yet',
                verificationLevel: user.verificationLevel || 'unverified',
                location: user.profile!.city && user.profile!.state
                    ? `${user.profile!.city}, ${user.profile!.state}`
                    : null,
                lastCollaboration: user.collaborationsInitiated[0]
                    ? `${user.collaborationsInitiated[0].title} • ${new Date(user.collaborationsInitiated[0].createdAt).toLocaleDateString()}`
                    : null,
            }));

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
