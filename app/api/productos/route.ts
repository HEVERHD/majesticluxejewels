import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const search = searchParams.get("search");
  const all = searchParams.get("all"); // admin: incluye inactivos

  const where: Record<string, unknown> = {};
  if (!all) where.active = true;
  if (category) where.categoryId = category;
  if (featured) where.featured = true;
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(products);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });

  try {
    const body = await request.json();
    const { name, description, price, images, featured, stock, active, categoryId } = body;

    if (!name || !price) {
      return Response.json({ error: "Nombre y precio son requeridos" }, { status: 400 });
    }

    const slug = slugify(name);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
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

    return Response.json(product, { status: 201 });
  } catch (error) {
    console.error("[PRODUCTS POST]", error);
    return Response.json({ error: "Error del servidor" }, { status: 500 });
  }
}
