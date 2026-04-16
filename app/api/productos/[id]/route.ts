import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) return Response.json({ error: "No encontrado" }, { status: 404 });
  return Response.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { name, description, price, images, featured, stock, active, categoryId } = body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      slug: slugify(name),
      description,
      price: parseFloat(price),
      images: images || [],
      featured: featured || false,
      stock: parseInt(stock) || 0,
      active: active !== false,
      categoryId: categoryId || null,
    },
    include: { category: true },
  });

  return Response.json(product);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return Response.json({ ok: true });
}
