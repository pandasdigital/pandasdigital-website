import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(inquiries);
}

export async function POST(req: Request) {
  const body = await req.json();
  const inquiry = await prisma.inquiry.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      service: body.service || null,
      budget: body.budget || null,
      message: body.message,
    },
  });
  return NextResponse.json(inquiry);
}

export async function PATCH(req: Request) {
  const { id, read } = await req.json();
  const inquiry = await prisma.inquiry.update({
    where: { id: Number(id) },
    data: { read },
  });
  return NextResponse.json(inquiry);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.inquiry.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
