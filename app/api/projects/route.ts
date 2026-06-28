import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const publicOnly = searchParams.get("public") === "true";

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true },
    where: publicOnly ? { showOnWebsite: true } : undefined,
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const body = await req.json();
  const project = await prisma.project.create({
    data: {
      ...body,
      customerId: Number(body.customerId),
      value: Number(body.value),
      showOnWebsite: body.showOnWebsite ?? false,
      startDate: body.startDate ? new Date(body.startDate) : null,
    },
  });
  return NextResponse.json(project);
}

export async function PATCH(req: Request) {
  const { id, showOnWebsite } = await req.json();
  const project = await prisma.project.update({
    where: { id: Number(id) },
    data: { showOnWebsite },
  });
  return NextResponse.json(project);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.project.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
