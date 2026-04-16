export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Plus } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

async function getProducts() {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function ProductosPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-gray-900 mb-1">Productos</h1>
          <p className="text-sm text-gray-500">{products.length} productos en total</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 bg-[#b8964a] text-white px-5 py-3 text-sm hover:bg-[#8a6e35] transition-colors"
        >
          <Plus size={16} /> Nuevo producto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-gray-100 p-16 text-center">
          <p className="font-serif text-xl text-gray-400 mb-4">No hay productos aún</p>
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex items-center gap-2 bg-[#b8964a] text-white px-6 py-3 text-sm hover:bg-[#8a6e35] transition-colors"
          >
            <Plus size={16} /> Agregar primer producto
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs tracking-[0.1em] uppercase text-gray-500 font-medium w-16">
                  Img
                </th>
                <th className="text-left px-4 py-4 text-xs tracking-[0.1em] uppercase text-gray-500 font-medium">
                  Producto
                </th>
                <th className="text-left px-4 py-4 text-xs tracking-[0.1em] uppercase text-gray-500 font-medium hidden md:table-cell">
                  Categoría
                </th>
                <th className="text-left px-4 py-4 text-xs tracking-[0.1em] uppercase text-gray-500 font-medium hidden sm:table-cell">
                  Precio
                </th>
                <th className="text-left px-4 py-4 text-xs tracking-[0.1em] uppercase text-gray-500 font-medium hidden lg:table-cell">
                  Stock
                </th>
                <th className="text-left px-4 py-4 text-xs tracking-[0.1em] uppercase text-gray-500 font-medium">
                  Estado
                </th>
                <th className="text-right px-6 py-4 text-xs tracking-[0.1em] uppercase text-gray-500 font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-12 bg-[#f8f4ef] overflow-hidden shrink-0">
                      {p.images[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[#b8964a] text-lg">◈</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</p>
                    {p.featured && (
                      <span className="text-[10px] text-[#b8964a] tracking-wide uppercase">★ Destacado</span>
                    )}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-500">{p.category?.name || "—"}</span>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-sm text-gray-700">{formatPrice(p.price)}</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-sm text-gray-500">{p.stock}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block text-[10px] px-2 py-1 uppercase tracking-wide ${
                        p.active
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {p.active ? "Activo" : "Oculto"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/productos/${p.id}`}
                        className="text-xs text-[#b8964a] hover:underline"
                      >
                        Editar
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
