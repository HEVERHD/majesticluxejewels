"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { siteConfig } from "@/lib/site.config";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e8e0d5]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/MAJESTIClogosolo.png"
            alt="Majestic Luxe Jewels"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-sm tracking-wide text-[#6b6b6b] hover:text-[#c9a84c] transition-colors">
            Inicio
          </Link>
          <Link href="/catalogo" className="text-sm tracking-wide text-[#6b6b6b] hover:text-[#c9a84c] transition-colors">
            Catálogo
          </Link>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-wide text-[#6b6b6b] hover:text-[#c9a84c] transition-colors"
          >
            Contacto
          </a>
        </nav>

        {/* Right: cart + mobile menu */}
        <div className="flex items-center gap-3">
          {/* Cart button */}
          <button
            onClick={openCart}
            className="relative p-2 text-[#0f0f0f] hover:text-[#c9a84c] transition-colors"
            aria-label="Abrir carrito"
          >
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#c9a84c] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[#0f0f0f] p-1"
            aria-label="Menú"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#e8e0d5] px-6 py-6 flex flex-col gap-5">
          <Link href="/" onClick={() => setOpen(false)} className="text-sm tracking-wide text-[#6b6b6b] hover:text-[#c9a84c]">
            Inicio
          </Link>
          <Link href="/catalogo" onClick={() => setOpen(false)} className="text-sm tracking-wide text-[#6b6b6b] hover:text-[#c9a84c]">
            Catálogo
          </Link>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-wide text-[#6b6b6b] hover:text-[#c9a84c]"
          >
            Contacto
          </a>
        </div>
      )}
    </header>
  );
}
