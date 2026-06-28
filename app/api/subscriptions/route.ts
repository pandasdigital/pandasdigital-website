import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const subs = await prisma.subscription.findMany({
    orderBy: { renewalDate: "asc" },
    include: { customer: true },
  });
  return NextResponse.json(subs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const sub = await prisma.subscription.create({
    data: {
      ...body,
      customerId: body.customerId ? Number(body.customerId) : null,
      cost: Number(body.cost),
      renewalDate: new Date(body.renewalDate),
    },
  });
  return NextResponse.json(sub);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.subscription.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
