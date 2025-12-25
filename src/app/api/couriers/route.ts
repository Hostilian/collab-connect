import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/couriers - List all active couriers
export async function GET() {
  const couriers = await prisma.courier.findMany({
    where: { isActive: true, isVerified: true },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { rating: "desc" },
  })

  return NextResponse.json(couriers)
}

// POST /api/couriers - Register as a courier
export async function POST(request: Request) {
  const body = await request.json()
  const { userId } = body

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 })
  }

  // Check if already a courier
  const existing = await prisma.courier.findUnique({ where: { userId } })
  if (existing) {
    return NextResponse.json({ error: "Already registered as courier" }, { status: 400 })
  }

  const courier = await prisma.courier.create({
    data: { userId },
  })

  return NextResponse.json(courier, { status: 201 })
}
