export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Package, Clock, CheckCircle, Truck, XCircle, CreditCard } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pendiente",  color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Confirmado", color: "bg-blue-100 text-blue-800" },
  SHIPPED:   { label: "Enviado",    color: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "Entregado",  color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelado",  color: "bg-red-100 text-red-800" },
};

const PAYMENT_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:  { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  PAID:     { label: "Pagado",    color: "bg-green-100 text-green-800" },
  FAILED:   { label: "Fallido",   color: "bg-red-100 text-red-800" },
  REFUNDED: { label: "Reembolsado", color: "bg-gray-100 text-gray-800" },
};

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    confirmed: orders.filter((o) => o.status === "CONFIRMED").length,
    shipped: orders.filter((o) => o.status === "SHIPPED").length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0f0f0f] mb-1">Pedidos</h1>
        <p className="text-sm text-[#6b6b6b]">Gestiona y actualiza el estado de los pedidos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, icon: Package, color: "text-[#c9a84c]" },
          { label: "Pendientes", value: stats.pending, icon: Clock, color: "text-yellow-600" },
          { label: "Confirmados", value: stats.confirmed, icon: CheckCircle, color: "text-blue-600" },
          { label: "Enviados", value: stats.shipped, icon: Truck, color: "text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#e8e0d5] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wide text-[#6b6b6b]">{s.label}</span>
              <s.icon size={16} className={s.color} />
            </div>
            <p className="text-2xl font-semibold text-[#0f0f0f]">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {orders.length === 0 ? (
        <div className="bg-white border border-[#e8e0d5] p-16 text-center">
          <Package size={40} className="text-[#e8e0d5] mx-auto mb-3" />
          <p className="text-[#6b6b6b]">Aún no hay pedidos</p>
        </div>
      ) : (
        <div className="bg-white border border-[#e8e0d5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8e0d5] bg-[#f8f4ef]">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-[#6b6b6b] font-medium">Pedido</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-[#6b6b6b] font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-[#6b6b6b] font-medium">Total</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-[#6b6b6b] font-medium">Pago</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-[#6b6b6b] font-medium">Estado</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-[#6b6b6b] font-medium">Fecha</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.PENDING;
                  const paymentInfo = PAYMENT_LABELS[order.paymentStatus] || PAYMENT_LABELS.PENDING;
                  return (
                    <tr key={order.id} className="border-b border-[#f0ebe3] hover:bg-[#faf8f5] transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-[#c9a84c] font-medium">{order.orderNumber}</span>
                        <p className="text-xs text-[#6b6b6b] mt-0.5">{order.items.length} artículo(s)</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#0f0f0f]">{order.firstName} {order.lastName}</p>
                        <p className="text-xs text-[#6b6b6b]">{order.phone}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-[#0f0f0f]">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-[#6b6b6b] flex items-center gap-1">
                            <CreditCard size={10} />
                            {order.paymentMethod === "COD" ? "Contra entrega" : "Wompi"}
                          </span>
                          <span className={`inline-flex text-[10px] px-2 py-0.5 rounded-full font-medium w-fit ${paymentInfo.color}`}>
                            {paymentInfo.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex text-[10px] px-2 py-1 rounded-full font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#6b6b6b]">
                        {new Date(order.createdAt).toLocaleDateString("es-CO", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/pedidos/${order.id}`}
                          className="text-xs text-[#c9a84c] hover:text-[#9a7a2e] font-medium transition-colors"
                        >
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
