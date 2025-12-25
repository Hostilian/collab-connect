import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/deliveries - List deliveries (for couriers)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const courierId = searchParams.get("courierId")

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (courierId) where.courierId = courierId

  const deliveries = await prisma.delivery.findMany({
    where,
    orderBy: { scheduledDate: "asc" },
    take: 50,
  })

  return NextResponse.json(deliveries)
}

// POST /api/deliveries - Create a new delivery request
export async function POST(request: Request) {
  const body = await request.json()

  const {
    pickupAddress,
    pickupLat,
    pickupLng,
    pickupNotes,
    dropoffAddress,
    dropoffLat,
    dropoffLng,
    dropoffNotes,
    scheduledDate,
    itemType,
    itemDescription,
    customerName,
    customerPhone,
    customerEmail,
    distanceKm,
    currency,
    totalPrice,
    courierPayout,
    platformFee,
  } = body

  // Basic validation
  if (!pickupAddress || !dropoffAddress || !customerName || !customerPhone) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  const delivery = await prisma.delivery.create({
    data: {
      pickupAddress,
      pickupLat: pickupLat ?? 0,
      pickupLng: pickupLng ?? 0,
      pickupNotes,
      dropoffAddress,
      dropoffLat: dropoffLat ?? 0,
      dropoffLng: dropoffLng ?? 0,
      dropoffNotes,
      scheduledDate: new Date(scheduledDate),
      itemType: itemType ?? "envelope",
      itemDescription,
      customerName,
      customerPhone,
      customerEmail,
      distanceKm: distanceKm ?? 0,
      currency: currency ?? "CZK",
      totalPrice: totalPrice ?? 0,
      courierPayout: courierPayout ?? 0,
      platformFee: platformFee ?? 0,
    },
  })

  return NextResponse.json(delivery, { status: 201 })
}
