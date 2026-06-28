import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: true },
    });
    return NextResponse.json(invoices ?? []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const count = await prisma.invoice.count();
    const invoiceNo = `PD-${String(count + 1).padStart(4, "0")}-${new Date().getFullYear()}`;
    const invoice = await prisma.invoice.create({
      data: {
        ...body,
        invoiceNo,
        customerId: Number(body.customerId),
        subtotal: Number(body.subtotal),
        discount: Number(body.discount || 0),
        total: Number(body.total),
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
      include: { customer: true },
    });
    return NextResponse.json(invoice);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...data } = await req.json();
    const invoice = await prisma.invoice.update({
      where: { id: Number(id) },
      data: { ...data, dueDate: data.dueDate ? new Date(data.dueDate) : null },
      include: { customer: true },
    });
    return NextResponse.json(invoice);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.invoice.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
