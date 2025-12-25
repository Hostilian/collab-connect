import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

// GET /api/deliveries/[id] - Get a single delivery
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params

  const delivery = await prisma.delivery.findUnique({
    where: { id },
    include: { courier: { include: { user: { select: { name: true, image: true } } } } },
  })

  if (!delivery) {
    return NextResponse.json({ error: "Delivery not found" }, { status: 404 })
  }

  return NextResponse.json(delivery)
}

// PATCH /api/deliveries/[id] - Update delivery status
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const body = await request.json()
  const { status, courierId } = body

  const updateData: Record<string, unknown> = {}

  if (status) {
    updateData.status = status
    if (status === "ACCEPTED") updateData.acceptedAt = new Date()
    if (status === "PICKED_UP") updateData.pickedUpAt = new Date()
    if (status === "DELIVERED") updateData.deliveredAt = new Date()
    if (status === "CANCELLED") {
      updateData.cancelledAt = new Date()
      updateData.cancellationReason = body.cancellationReason
    }
  }

  if (courierId) {
    updateData.courierId = courierId
  }

  const delivery = await prisma.delivery.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json(delivery)
}
