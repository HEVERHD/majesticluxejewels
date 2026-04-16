export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import CategoriesManager from "@/components/admin/CategoriesManager";

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-gray-900 mb-1">Categorías</h1>
        <p className="text-sm text-gray-500">Organiza tus productos por tipo de joya</p>
      </div>
      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
