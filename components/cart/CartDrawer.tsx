"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, subtotal, closeCart, removeItem, updateQty } = useCart();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  const FREE_SHIPPING_THRESHOLD = 150000;
  const SHIPPING_COST = 20000;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeCart}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8e0d5]">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-[#c9a84c]" />
            <h2 className="font-serif text-lg font-medium text-[#0f0f0f]">
              Tu Carrito
            </h2>
            {items.length > 0 && (
              <span className="bg-[#c9a84c] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="text-[#6b6b6b] hover:text-[#0f0f0f] transition-colors p-1"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="px-6 py-3 bg-[#f8f4ef]">
            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
              <p className="text-xs text-[#1c6644] font-medium text-center">
                ✦ ¡Envío gratis aplicado!
              </p>
            ) : (
              <div>
                <p className="text-xs text-[#6b6b6b] mb-2 text-center">
                  Agrega{" "}
                  <span className="font-semibold text-[#0f0f0f]">
                    {formatPrice(remaining)}
                  </span>{" "}
                  más para envío gratis
                </p>
                <div className="w-full bg-[#e8e0d5] rounded-full h-1">
                  <div
                    className="bg-[#c9a84c] h-1 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-[#e8e0d5]" />
              <p className="font-serif text-lg text-[#6b6b6b]">Tu carrito está vacío</p>
              <p className="text-sm text-[#6b6b6b]">Agrega piezas de nuestra colección</p>
              <button
                onClick={closeCart}
                className="mt-2 bg-[#c9a84c] text-white px-6 py-3 text-xs tracking-widest uppercase hover:bg-[#9a7a2e] transition-colors"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 pb-4 border-b border-[#f0ebe3] last:border-0"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 bg-[#f8f4ef] flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={20} className="text-[#c9a84c]" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-sm font-medium text-[#0f0f0f] line-clamp-2 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#c9a84c] mt-0.5 font-medium">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity + Remove */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#e8e0d5]">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#6b6b6b] hover:text-[#0f0f0f] hover:bg-[#f8f4ef] transition-colors"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-medium text-[#0f0f0f]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#6b6b6b] hover:text-[#0f0f0f] hover:bg-[#f8f4ef] transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#6b6b6b] hover:text-red-500 transition-colors p-1"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#e8e0d5] px-6 py-5 space-y-3">
            <div className="flex justify-between text-sm text-[#6b6b6b]">
              <span>Subtotal</span>
              <span className="font-medium text-[#0f0f0f]">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#6b6b6b]">
              <span>Envío</span>
              <span className={shippingCost === 0 ? "text-[#1c6644] font-medium" : "font-medium text-[#0f0f0f]"}>
                {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between font-serif font-semibold text-base border-t border-[#e8e0d5] pt-3">
              <span>Total</span>
              <span className="text-[#c9a84c]">{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-[#c9a84c] text-white text-center py-4 text-xs tracking-widest uppercase hover:bg-[#9a7a2e] transition-colors font-medium mt-2"
            >
              Finalizar Compra
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center text-xs text-[#6b6b6b] hover:text-[#0f0f0f] transition-colors py-1"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
