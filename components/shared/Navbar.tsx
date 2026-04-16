"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site.config";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e8e0d5]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/MAJESTIClogosolo.png"
            alt="Majestic Luxe Jewels"
            className="h-12 w-auto object-contain"
          />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-base font-semibold tracking-[0.25em] uppercase text-[#0f0f0f]">
              Majestic Luxe
            </span>
            <span className="font-serif text-[0.6rem] tracking-[0.35em] uppercase text-[#c9a84c] mt-0.5">
              Jewels
            </span>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-10">
          <Link
            href="/"
            className="text-sm tracking-wide text-[#6b6b6b] hover:text-[#c9a84c] transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/catalogo"
            className="text-sm tracking-wide text-[#6b6b6b] hover:text-[#c9a84c] transition-colors"
          >
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

        {/* Botón menú mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#0f0f0f]"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#e8e0d5] px-6 py-6 flex flex-col gap-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-sm tracking-wide text-[#6b6b6b] hover:text-[#c9a84c]"
          >
            Inicio
          </Link>
          <Link
            href="/catalogo"
            onClick={() => setOpen(false)}
            className="text-sm tracking-wide text-[#6b6b6b] hover:text-[#c9a84c]"
          >
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
