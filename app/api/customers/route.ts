import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: { projects: true, subscriptions: true },
  })
  return NextResponse.json(customers)
}

export async function POST(req: Request) {
  const body = await req.json()
  const customer = await prisma.customer.create({ data: body })
  return NextResponse.json(customer)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  await prisma.customer.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}