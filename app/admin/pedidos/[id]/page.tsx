export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import OrderStatusForm from "./OrderStatusForm";
import { ArrowLeft, MapPin, Phone, Mail, Package } from "lucide-react";

export default async function PedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/pedidos" className="text-[#6b6b6b] hover:text-[#c9a84c] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-[#0f0f0f]">{order.orderNumber}</h1>
          <p className="text-xs text-[#6b6b6b]">
            {new Date(order.createdAt).toLocaleString("es-CO")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Items */}
          <div className="bg-white border border-[#e8e0d5] p-5">
            <h2 className="font-serif text-sm font-semibold text-[#0f0f0f] mb-4 flex items-center gap-2">
              <Package size={16} className="text-[#c9a84c]" />
              Artículos ({order.items.length})
            </h2>
            <ul className="space-y-3">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-3 pb-3 border-b border-[#f0ebe3] last:border-0">
                  <div className="relative w-14 h-14 bg-[#f8f4ef] flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={14} className="text-[#c9a84c]/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#0f0f0f]">{item.name}</p>
                    <p className="text-xs text-[#6b6b6b]">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-[#c9a84c]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-[#e8e0d5] space-y-1.5">
              <div className="flex justify-between text-sm text-[#6b6b6b]">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#6b6b6b]">
                <span>Envío</span>
                <span className={order.shippingCost === 0 ? "text-[#1c6644]" : ""}>
                  {order.shippingCost === 0 ? "Gratis" : formatPrice(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between font-serif font-semibold text-base pt-2">
                <span>Total</span>
                <span className="text-[#c9a84c]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white border border-[#e8e0d5] p-5">
            <h2 className="font-serif text-sm font-semibold text-[#0f0f0f] mb-4">Cliente</h2>
            <div className="space-y-2">
              <p className="font-medium text-[#0f0f0f]">{order.firstName} {order.lastName}</p>
              <a href={`tel:${order.phone}`} className="flex items-center gap-2 text-sm text-[#6b6b6b] hover:text-[#c9a84c] transition-colors">
                <Phone size={13} /> {order.phone}
              </a>
              {order.email && (
                <a href={`mailto:${order.email}`} className="flex items-center gap-2 text-sm text-[#6b6b6b] hover:text-[#c9a84c] transition-colors">
                  <Mail size={13} /> {order.email}
                </a>
              )}
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white border border-[#e8e0d5] p-5">
            <h2 className="font-serif text-sm font-semibold text-[#0f0f0f] mb-4 flex items-center gap-2">
              <MapPin size={14} className="text-[#c9a84c]" />
              Dirección de Envío
            </h2>
            <address className="not-italic text-sm text-[#6b6b6b] space-y-0.5">
              <p>{order.address}</p>
              {order.addressLine2 && <p>{order.addressLine2}</p>}
              <p>{order.city}, {order.department}</p>
              {order.postalCode && <p>CP: {order.postalCode}</p>}
            </address>
            {order.notes && (
              <div className="mt-3 bg-[#f8f4ef] p-3 text-xs text-[#6b6b6b] italic">
                <span className="font-medium not-italic text-[#0f0f0f]">Notas: </span>
                {order.notes}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Status panel */}
        <div className="space-y-4">
          <div className="bg-white border border-[#e8e0d5] p-5">
            <h2 className="font-serif text-sm font-semibold text-[#0f0f0f] mb-4">Estado del Pedido</h2>
            <OrderStatusForm
              orderId={order.id}
              currentStatus={order.status}
              currentPaymentStatus={order.paymentStatus}
              paymentMethod={order.paymentMethod}
              wompiTransactionId={order.wompiTransactionId}
            />
          </div>

          {/* Payment summary */}
          <div className="bg-[#f8f4ef] border border-[#e8e0d5] p-4 text-xs space-y-1.5 text-[#6b6b6b]">
            <p><span className="font-medium text-[#0f0f0f]">Método:</span> {order.paymentMethod === "COD" ? "Contra entrega" : "Wompi"}</p>
            <p><span className="font-medium text-[#0f0f0f]">Pago:</span> {order.paymentStatus}</p>
            {order.wompiTransactionId && (
              <p className="truncate"><span className="font-medium text-[#0f0f0f]">TX Wompi:</span> {order.wompiTransactionId}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
