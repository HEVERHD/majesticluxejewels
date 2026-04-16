export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Package, Tag, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const [totalProducts, totalCategories, featuredProducts, recentProducts] =
    await Promise.all([
      prisma.product.count({ where: { active: true } }),
      prisma.category.count(),
      prisma.product.count({ where: { featured: true } }),
      prisma.product.findMany({
        where: { active: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return { totalProducts, totalCategories, featuredProducts, recentProducts };
}

export default async function AdminDashboard() {
  const { totalProducts, totalCategories, featuredProducts, recentProducts } =
    await getStats();

  const stats = [
    { label: "Productos activos", value: totalProducts, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Categorías", value: totalCategories, icon: Tag, color: "bg-purple-50 text-purple-600" },
    { label: "Destacados", value: featuredProducts, icon: Star, color: "bg-amber-50 text-amber-600" },
    { label: "Visitas (próx.)", value: "—", icon: TrendingUp, color: "bg-green-50 text-green-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">Bienvenido al panel de administración</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500 font-medium">{label}</span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="font-serif text-4xl text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="font-serif text-lg text-gray-900 mb-4">Acciones rápidas</h2>
          <div className="space-y-3">
            <Link
              href="/admin/productos/nuevo"
              className="flex items-center gap-3 px-4 py-3 bg-[#b8964a] text-white text-sm hover:bg-[#8a6e35] transition-colors"
            >
              <Package size={16} />
              Agregar nuevo producto
            </Link>
            <Link
              href="/admin/categorias"
              className="flex items-center gap-3 px-4 py-3 border border-gray-200 text-gray-700 text-sm hover:border-[#b8964a] hover:text-[#b8964a] transition-colors"
            >
              <Tag size={16} />
              Gestionar categorías
            </Link>
          </div>
        </div>

        {/* Últimos productos */}
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="font-serif text-lg text-gray-900 mb-4">Últimos productos</h2>
          <div className="space-y-3">
            {recentProducts.map((p) => (
              <Link
                key={p.id}
                href={`/admin/productos/${p.id}`}
                className="flex items-center justify-between text-sm hover:text-[#b8964a] transition-colors py-1 border-b border-gray-50 last:border-0"
              >
                <span className="text-gray-700 truncate">{p.name}</span>
                <span className="text-gray-400 shrink-0 ml-4">
                  {p.category?.name || "Sin cat."}
                </span>
              </Link>
            ))}
            {recentProducts.length === 0 && (
              <p className="text-sm text-gray-400">No hay productos aún</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
