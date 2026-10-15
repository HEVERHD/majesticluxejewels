export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Package, Tag, Star, ShoppingCart, Clock, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

async function getStats() {
  const [
    totalProducts,
    totalCategories,
    featuredProducts,
    totalOrders,
    pendingOrders,
    recentOrders,
    recentProducts,
  ] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.category.count(),
    prisma.product.count({ where: { featured: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
    prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: "PAID" },
  });

  return {
    totalProducts, totalCategories, featuredProducts,
    totalOrders, pendingOrders, recentOrders, recentProducts,
    totalRevenue: totalRevenue._sum.total || 0,
  };
}

const STATUS_COLORS: Record<string, string> = {
  PENDING:   "bg-yellow-900/30 text-yellow-400",
  CONFIRMED: "bg-blue-900/30 text-blue-400",
  SHIPPED:   "bg-purple-900/30 text-purple-400",
  DELIVERED: "bg-green-900/30 text-green-400",
  CANCELLED: "bg-red-900/30 text-red-400",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente", CONFIRMED: "Confirmado",
  SHIPPED: "Enviado",   DELIVERED: "Entregado", CANCELLED: "Cancelado",
};

export default async function AdminDashboard() {
  const {
    totalProducts, totalCategories, featuredProducts,
    totalOrders, pendingOrders, recentOrders, recentProducts, totalRevenue,
  } = await getStats();

  const stats = [
    { label: "Pedidos totales",   value: totalOrders,     icon: ShoppingCart, accent: "text-[#c9a84c]",  bg: "bg-[#c9a84c]/10" },
    { label: "Pendientes",        value: pendingOrders,   icon: Clock,        accent: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Productos activos", value: totalProducts,   icon: Package,      accent: "text-blue-400",   bg: "bg-blue-400/10"  },
    { label: "Destacados",        value: featuredProducts,icon: Star,         accent: "text-purple-400", bg: "bg-purple-400/10"},
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#0f0f0f]">Dashboard</h1>
          <p className="text-sm text-[#6b6b6b] mt-0.5">Bienvenida al panel de Majestic Luxe Jewels</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="hidden sm:inline-flex items-center gap-2 bg-[#c9a84c] text-white text-xs tracking-widest uppercase px-5 py-3 hover:bg-[#9a7a2e] transition-colors"
        >
          <Package size={14} />
          Nuevo producto
        </Link>
      </div>

      {/* Revenue banner */}
      {totalRevenue > 0 && (
        <div className="bg-[#0f0f0f] p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#c9a84c] mb-1">
              Ingresos confirmados (pagos Wompi)
            </p>
            <p className="font-serif text-3xl text-white font-semibold">
              {formatPrice(totalRevenue)}
            </p>
          </div>
          <TrendingUp size={32} className="text-[#c9a84c]/40" />
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, accent, bg }) => (
          <div key={label} className="bg-white border border-[#e8e0d5] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-9 h-9 ${bg} flex items-center justify-center`}>
                <Icon size={16} className={accent} />
              </div>
            </div>
            <p className="font-serif text-3xl font-semibold text-[#0f0f0f]">{value}</p>
            <p className="text-[10px] uppercase tracking-wide text-[#6b6b6b] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent orders */}
        <div className="bg-white border border-[#e8e0d5]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e0d5]">
            <h2 className="font-serif text-base font-medium text-[#0f0f0f]">Últimos pedidos</h2>
            <Link href="/admin/pedidos" className="text-[10px] uppercase tracking-widest text-[#c9a84c] hover:text-[#9a7a2e] flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-[#f0ebe3]">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-[#6b6b6b] px-6 py-8 text-center">Aún no hay pedidos</p>
            ) : recentOrders.map((o) => (
              <Link
                key={o.id}
                href={`/admin/pedidos/${o.id}`}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-[#faf8f5] transition-colors group"
              >
                <div>
                  <p className="text-xs font-mono text-[#c9a84c] font-semibold">{o.orderNumber}</p>
                  <p className="text-xs text-[#6b6b6b] mt-0.5">{o.firstName} {o.lastName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#0f0f0f]">{formatPrice(o.total)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${STATUS_COLORS[o.status] || STATUS_COLORS.PENDING}`}>
                    {STATUS_LABELS[o.status] || o.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick actions */}
          <div className="bg-white border border-[#e8e0d5]">
            <div className="px-6 py-4 border-b border-[#e8e0d5]">
              <h2 className="font-serif text-base font-medium text-[#0f0f0f]">Acciones rápidas</h2>
            </div>
            <div className="p-4 space-y-2">
              {[
                { href: "/admin/productos/nuevo", icon: Package, label: "Agregar nuevo producto",  primary: true },
                { href: "/admin/categorias",      icon: Tag,     label: "Gestionar categorías",    primary: false },
                { href: "/admin/pedidos",         icon: ShoppingCart, label: "Ver todos los pedidos", primary: false },
                { href: "/",                      icon: ArrowRight, label: "Ver tienda en vivo",   primary: false, external: true },
              ].map(({ href, icon: Icon, label, primary, external }) => (
                <Link
                  key={href}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    primary
                      ? "bg-[#c9a84c] text-white hover:bg-[#9a7a2e]"
                      : "border border-[#e8e0d5] text-[#6b6b6b] hover:border-[#c9a84c] hover:text-[#c9a84c]"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent products */}
          <div className="bg-white border border-[#e8e0d5]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e0d5]">
              <h2 className="font-serif text-base font-medium text-[#0f0f0f]">Últimos productos</h2>
              <Link href="/admin/productos" className="text-[10px] uppercase tracking-widest text-[#c9a84c] hover:text-[#9a7a2e] flex items-center gap-1 transition-colors">
                Ver todos <ArrowRight size={11} />
              </Link>
            </div>
            <div className="divide-y divide-[#f0ebe3]">
              {recentProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/productos/${p.id}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-[#faf8f5] transition-colors"
                >
                  <p className="text-sm text-[#0f0f0f] truncate">{p.name}</p>
                  <span className="text-[10px] text-[#c9a84c] uppercase tracking-wide shrink-0 ml-4">
                    {p.category?.name || "Sin cat."}
                  </span>
                </Link>
              ))}
              {recentProducts.length === 0 && (
                <p className="text-sm text-[#6b6b6b] px-6 py-6 text-center">No hay productos aún</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
