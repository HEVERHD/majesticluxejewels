"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site.config";
import GoldParticles from "./GoldParticles";

interface HeroProductsProps {
  images: string[];
  productSlugs?: string[];
}

export default function HeroProducts({ images, productSlugs }: HeroProductsProps) {
  const [img1, img2, img3, img4] = images;

  return (
    <section className="relative w-full min-h-[100svh] bg-[#0a0a0a] overflow-hidden flex items-center">

      {/* ── Mosaico de imágenes reales ── */}
      <div className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[58%] grid grid-cols-2 grid-rows-2 gap-0.5">
        {/* imagen grande arriba-izquierda */}
        {img1 ? (
          <div className="row-span-2 relative">
            <Image
              src={img1}
              alt="Joya Majestic Luxe"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 29vw"
              priority
            />
          </div>
        ) : (
          <div className="row-span-2 bg-[#1a1a1a]" />
        )}
        {/* imagen arriba-derecha */}
        {img2 ? (
          <div className="relative">
            <Image
              src={img2}
              alt="Joya Majestic Luxe"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 29vw"
              priority
            />
          </div>
        ) : (
          <div className="bg-[#111]" />
        )}
        {/* imagen abajo-derecha */}
        {img3 ? (
          <div className="relative">
            <Image
              src={img3}
              alt="Joya Majestic Luxe"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 29vw"
            />
          </div>
        ) : (
          <div className="bg-[#151515]" />
        )}
      </div>

      {/* Degradado: oscurece la zona de imágenes en mobile para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 lg:hidden" />
      {/* Degradado: en desktop va de izquierda hacia las imágenes */}
      <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/95 lg:to-transparent" />
      {/* Línea dorada decorativa (solo desktop) */}
      <div className="absolute top-0 left-[41%] bottom-0 w-px bg-gradient-to-b from-transparent via-[#c9a84c]/20 to-transparent hidden lg:block" />

      {/* Partículas */}
      <GoldParticles />

      {/* ── Contenido ── */}
      <div className="relative z-10 px-6 lg:px-16 xl:px-24 max-w-xl w-full">
        <p className="text-[#c9a84c] text-[9px] tracking-[0.5em] uppercase mb-6 animate-fade-up">
          Joyería de lujo artesanal
        </p>

        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-medium text-white leading-[1.05] mb-6 animate-fade-up-delay-1">
          Piezas que
          <br />
          <em className="text-[#c9a84c] not-italic">cuentan</em>
          <br />
          tu historia
        </h1>

        <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-xs animate-fade-up-delay-2">
          {siteConfig.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 animate-fade-up-delay-3">
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] text-white px-8 py-4 text-xs tracking-widest uppercase hover:bg-[#9a7a2e] transition-colors active:scale-95"
          >
            Ver Colección <ArrowRight size={14} />
          </Link>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 text-xs tracking-widest uppercase hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors active:scale-95"
          >
            Contactar
          </a>
        </div>

        {/* Sellos de confianza */}
        <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10 animate-fade-up-delay-3">
          {[
            { val: "100%", label: "Artesanal" },
            { val: "Oro",  label: "Laminado 18k" },
            { val: "2–5d", label: "Envío Colombia" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-sm text-[#c9a84c] font-semibold">{s.val}</p>
              <p className="text-[9px] text-white/30 tracking-widest uppercase mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-fade-up-delay-3 lg:left-16 lg:translate-x-0">
        <span className="text-white/20 text-[9px] tracking-[0.3em] uppercase">Descubrir</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#c9a84c]/40 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
