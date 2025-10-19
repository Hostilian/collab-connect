/**
 * Property Search Integration
 * Integrates with property APIs and manages favorites
 */

import { prisma } from './prisma';

interface PropertySearchParams {
  query?: string;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  limit?: number;
  offset?: number;
}

/**
 * Search properties (from external API or database)
 */
export async function searchProperties(params: PropertySearchParams) {
  try {
    const {
      city,
      state,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      propertyType,
      bounds,
      limit = 50,
      offset = 0,
    } = params;

    // Build where clause
    const where: {
      isActive: boolean;
      city?: string;
      state?: string;
      price?: { gte?: number; lte?: number };
      bedrooms?: { gte: number };
      bathrooms?: { gte: number };
      propertyType?: string;
      AND?: Array<{
        latitude?: { gte?: number; lte?: number };
        longitude?: { gte?: number; lte?: number };
      }>;
    } = {
      isActive: true,
    };

    if (city) where.city = city;
    if (state) where.state = state;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }
    if (bedrooms) where.bedrooms = { gte: bedrooms };
    if (bathrooms) where.bathrooms = { gte: bathrooms };
    if (propertyType) where.propertyType = propertyType;

    // Handle bounding box search
    if (bounds) {
      where.AND = [
        { latitude: { gte: bounds.south, lte: bounds.north } },
        { longitude: { gte: bounds.west, lte: bounds.east } },
      ];
    }

    const [properties, total] = await Promise.all([
      prisma.propertyListing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.propertyListing.count({ where }),
    ]);

    return {
      properties,
      total,
      hasMore: offset + properties.length < total,
    };
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
}

/**
 * Add property to favorites
 */
export async function addToFavorites(
  userId: string,
  propertyId: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.propertyFavorite.create({
      data: {
        userId,
        propertyId,
        notes,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return { success: false, error: 'Property already in favorites' };
    }
    console.error('Error adding to favorites:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add to favorites',
    };
  }
}

/**
 * Remove property from favorites
 */
export async function removeFromFavorites(
  userId: string,
  propertyId: string
): Promise<{ success: boolean }> {
  try {
    await prisma.propertyFavorite.deleteMany({
      where: {
        userId,
        propertyId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return { success: false };
  }
}

/**
 * Get user's favorite properties
 */
export async function getFavorites(userId: string) {
  const favorites = await prisma.propertyFavorite.findMany({
    where: { userId },
    include: {
      property: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return favorites;
}

/**
 * Save search history
 */
export async function saveSearchHistory(
  userId: string,
  query: string,
  filters: Record<string, unknown>,
  resultCount: number
) {
  try {
    await prisma.propertySearch.create({
      data: {
        userId,
        query,
        filters: filters as never,
        resultCount,
      },
    });
  } catch (error) {
    console.error('Error saving search history:', error);
  }
}

/**
 * Get user's search history
 */
export async function getSearchHistory(userId: string, limit = 20) {
  const searches = await prisma.propertySearch.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return searches;
}

/**
 * Get property details
 */
export async function getPropertyDetails(propertyId: string, userId?: string) {
  const property = await prisma.propertyListing.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    return null;
  }

  let isFavorite = false;
  if (userId) {
    const favorite = await prisma.propertyFavorite.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });
    isFavorite = !!favorite;
  }

  return {
    ...property,
    isFavorite,
  };
}
