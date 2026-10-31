"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, ShoppingBag, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/lib/site.config";
import { haptic } from "@/lib/haptic";

const tabs = [
  { href: "/",         label: "Inicio",   icon: Home },
  { href: "/catalogo", label: "Catálogo", icon: Grid },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-[#e8e0d5] safe-area-bottom">
      <div className="grid grid-cols-4 h-16">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => haptic(8)}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] tracking-widest uppercase transition-colors ${
                active ? "text-[#c9a84c]" : "text-[#6b6b6b]"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              {label}
            </Link>
          );
        })}

        {/* Cart tab */}
        <button
          onClick={() => { haptic(8); openCart(); }}
          className="flex flex-col items-center justify-center gap-1 text-[10px] tracking-widest uppercase text-[#6b6b6b] relative"
        >
          <span className="relative">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#c9a84c] text-white rounded-full text-[9px] flex items-center justify-center font-bold leading-none">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </span>
          Carrito
        </button>

        {/* WhatsApp tab */}
        <a
          href={`https://wa.me/${siteConfig.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => haptic(8)}
          className="flex flex-col items-center justify-center gap-1 text-[10px] tracking-widest uppercase text-[#6b6b6b]"
        >
          <MessageCircle size={20} strokeWidth={1.5} />
          Chat
        </a>
      </div>
    </nav>
  );
}
