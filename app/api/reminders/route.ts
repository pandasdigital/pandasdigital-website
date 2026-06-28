import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const reminders = await prisma.reminder.findMany({
    orderBy: { dueDate: "asc" },
    include: { customer: true },
  });
  return NextResponse.json(reminders);
}

export async function POST(req: Request) {
  const body = await req.json();
  const reminder = await prisma.reminder.create({
    data: {
      ...body,
      customerId: body.customerId ? Number(body.customerId) : null,
      dueDate: new Date(body.dueDate),
    },
  });
  return NextResponse.json(reminder);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.reminder.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  const { id, done } = await req.json();
  const reminder = await prisma.reminder.update({
    where: { id: Number(id) },
    data: { done },
  });
  return NextResponse.json(reminder);
}
