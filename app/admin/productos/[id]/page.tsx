export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

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
          <h1 className="font-serif text-3xl text-gray-900">Editar producto</h1>
          <p className="text-sm text-gray-500 truncate max-w-xs">{product.name}</p>
        </div>
      </div>
      <ProductForm
        categories={categories}
        initialData={{
          id: product.id,
          name: product.name,
          description: product.description || "",
          price: product.price.toString(),
          images: product.images,
          featured: product.featured,
          stock: product.stock.toString(),
          active: product.active,
          categoryId: product.categoryId || "",
        }}
      />
    </div>
  );
}
