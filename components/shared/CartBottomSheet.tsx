"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/lib/site.config";
import { haptic } from "@/lib/haptic";

export default function CartBottomSheet() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, totalItems } = useCart();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const waText = encodeURIComponent(
    `Hola! Quiero comprar:\n${items.map((i) => `• ${i.name} x${i.quantity} = ${formatPrice(i.price * i.quantity)}`).join("\n")}\n\nTotal: ${formatPrice(subtotal)}`
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden
      />

      {/* Sheet — bottom on mobile, right drawer on desktop */}
      <div
        ref={sheetRef}
        className="fixed z-[91] bg-white flex flex-col
          bottom-0 left-0 right-0 max-h-[85dvh] rounded-t-2xl
          md:bottom-auto md:top-0 md:left-auto md:right-0 md:h-full md:w-96 md:rounded-none
          animate-slide-up md:animate-slide-right"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        {/* Handle (mobile only) */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#e8e0d5]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e0d5]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#c9a84c]" />
            <h2 className="font-serif text-lg font-medium text-[#0f0f0f]">Mi carrito</h2>
            {totalItems > 0 && (
              <span className="bg-[#c9a84c] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={() => { haptic(8); closeCart(); }} aria-label="Cerrar carrito"
            className="text-[#6b6b6b] hover:text-[#0f0f0f] p-1 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag size={40} className="text-[#c9a84c]/30 mb-4" />
              <p className="font-serif text-lg text-[#0f0f0f] mb-1">Tu carrito está vacío</p>
              <p className="text-sm text-[#6b6b6b]">Explora nuestro catálogo</p>
              <Link
                href="/catalogo"
                onClick={closeCart}
                className="mt-6 text-xs tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c] px-5 py-2 hover:bg-[#c9a84c] hover:text-white transition-colors"
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <Link href={`/producto/${item.slug}`} onClick={closeCart} className="shrink-0">
                  <div className="relative w-16 h-16 bg-[#f8f4ef] overflow-hidden">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={16} className="text-[#c9a84c]/40" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/producto/${item.slug}`} onClick={closeCart}>
                    <p className="text-sm font-medium text-[#0f0f0f] line-clamp-2 hover:text-[#c9a84c] transition-colors">
                      {item.name}
                    </p>
                  </Link>
                  <p className="text-xs text-[#c9a84c] font-medium mt-0.5">
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => { haptic(6); updateQty(item.id, item.quantity - 1); }}
                      className="w-7 h-7 border border-[#e8e0d5] flex items-center justify-center hover:border-[#c9a84c] transition-colors"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => { haptic(6); updateQty(item.id, item.quantity + 1); }}
                      className="w-7 h-7 border border-[#e8e0d5] flex items-center justify-center hover:border-[#c9a84c] transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => { haptic(15); removeItem(item.id); }}
                      className="ml-auto text-[#6b6b6b] hover:text-red-500 transition-colors"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#e8e0d5] px-5 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6b6b6b]">Subtotal</span>
              <span className="font-serif text-lg font-medium text-[#0f0f0f]">
                {formatPrice(subtotal)}
              </span>
            </div>
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { haptic(20); closeCart(); }}
              className="flex items-center justify-center gap-3 bg-[#25D366] text-white w-full py-4 text-xs tracking-widest uppercase hover:bg-[#1da851] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Pedir por WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}
