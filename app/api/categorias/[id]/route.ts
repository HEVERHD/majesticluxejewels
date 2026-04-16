import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const { name } = await request.json();

  const category = await prisma.category.update({
    where: { id },
    data: { name, slug: slugify(name) },
  });
  return Response.json(category);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return Response.json({ ok: true });
}
