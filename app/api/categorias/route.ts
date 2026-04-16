import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return Response.json(categories);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });

  try {
    const { name } = await request.json();
    if (!name) return Response.json({ error: "Nombre requerido" }, { status: 400 });

    const slug = slugify(name);
    const category = await prisma.category.create({ data: { name, slug } });
    return Response.json(category, { status: 201 });
  } catch (error) {
    console.error("[CATEGORIES POST]", error);
    return Response.json({ error: "Error del servidor" }, { status: 500 });
  }
}
