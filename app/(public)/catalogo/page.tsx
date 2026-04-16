export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/catalog/ProductCard";
import CategoryFilter from "@/components/catalog/CategoryFilter";

type Props = {
  searchParams: Promise<{ categoria?: string; buscar?: string }>;
};

async function getProducts(categorySlug?: string, search?: string) {
  const where: Record<string, unknown> = { active: true };

  if (categorySlug) {
    const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (cat) where.categoryId = cat.id;
  }

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  return prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export default async function CatalogoPage({ searchParams }: Props) {
  const { categoria, buscar } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(categoria, buscar),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0f0f0f] py-16 px-6 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Colección</p>
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-white">
          Nuestro Catálogo
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Filtros */}
        <Suspense>
          <CategoryFilter categories={categories} />
        </Suspense>

        {/* Contador */}
        <p className="text-sm text-[#6b6b6b] mb-8">
          {products.length} {products.length === 1 ? "pieza" : "piezas"}{" "}
          {categoria ? `en "${categories.find((c) => c.slug === categoria)?.name}"` : "en total"}
        </p>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-[#0f0f0f] mb-3">No hay piezas disponibles</p>
            <p className="text-sm text-[#6b6b6b]">Intenta con otra categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
