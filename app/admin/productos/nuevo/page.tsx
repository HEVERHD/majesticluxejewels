export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/productos"
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-gray-900">Nuevo producto</h1>
          <p className="text-sm text-gray-500">Agrega una nueva joya al catálogo</p>
        </div>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
