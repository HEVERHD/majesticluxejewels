"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site.config";
import GoldParticles from "./GoldParticles";

// Video de joyas stock (Pexels – libre de uso)
const VIDEO_URL =
  "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  return (
    <section className="relative w-full h-[100svh] min-h-[600px] overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
      {/* Video */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onCanPlay={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Overlay oscuro + degradado inferior */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      {/* Partículas doradas */}
      <GoldParticles />

      {/* Contenido centrado — mobile first */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <p className="text-[#c9a84c] text-[10px] tracking-[0.4em] uppercase mb-5 animate-fade-up">
          Joyería de lujo artesanal
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium text-white leading-[1.08] mb-6 animate-fade-up-delay-1">
          Piezas que
          <br />
          <em className="text-[#c9a84c] not-italic">cuentan</em>
          <br />
          tu historia
        </h1>
        <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-sm mx-auto animate-fade-up-delay-2">
          {siteConfig.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up-delay-3">
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
            className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-xs tracking-widest uppercase hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors active:scale-95"
          >
            Contactar
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-fade-up-delay-3">
        <span className="text-white/30 text-[9px] tracking-[0.3em] uppercase">Descubrir</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
