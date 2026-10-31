export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import CatalogoClient from "@/components/catalog/CatalogoClient";
import { CatalogSkeleton } from "@/components/catalog/ProductCardSkeleton";

async function getData() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { products, categories };
}

export default async function CatalogoPage() {
  const { products, categories } = await getData();

  return (
    <div className="min-h-screen bg-white animate-page-entry">
      {/* Header */}
      <div className="bg-[#0f0f0f] py-16 px-6 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Colección</p>
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-white">
          Nuestro Catálogo
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogoClient products={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
