"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive]       = useState(0);
  const [animating, setAnimating] = useState(false);
  const [lightbox, setLightbox]   = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const total = images.length;

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === active) return;
      setAnimating(true);
      setActive((index + total) % total);
      setTimeout(() => setAnimating(false), 350);
    },
    [active, animating, total]
  );

  const prev = () => goTo(active - 1);
  const next = () => goTo(active + 1);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX.current = null;
    touchStartY.current = null;
  }

  // Cierra lightbox con Escape
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, active]);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-[#f8f4ef] flex items-center justify-center">
        <span className="text-[#c9a84c] text-6xl">◈</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Imagen principal */}
        <div
          className="relative aspect-square bg-[#f8f4ef] overflow-hidden select-none group cursor-zoom-in"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={() => setLightbox(true)}
        >
          {images.map((img, i) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-350 ${i === active ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            >
              <Image
                src={img}
                alt={`${name} — imagen ${i + 1}`}
                fill
                className={`object-cover transition-transform duration-700 ${i === active ? "scale-100 group-hover:scale-105" : "scale-105"}`}
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ))}

          {/* Hint zoom */}
          <div className="absolute top-3 right-3 z-20 bg-black/40 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={16} />
          </div>

          {total > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/90 hover:bg-white shadow flex items-center justify-center transition-all hover:scale-105">
                <ChevronLeft size={18} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/90 hover:bg-white shadow flex items-center justify-center transition-all hover:scale-105">
                <ChevronRight size={18} />
              </button>
              <span className="absolute bottom-3 right-3 z-20 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {active + 1} / {total}
              </span>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {total > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, i) => (
              <button key={img} onClick={() => goTo(i)} aria-label={`Ver imagen ${i + 1}`}
                className={`relative aspect-square bg-[#f8f4ef] overflow-hidden transition-all duration-200 ${
                  i === active ? "ring-2 ring-[#c9a84c] ring-offset-1 opacity-100" : "opacity-50 hover:opacity-80"
                }`}
              >
                <Image src={img} alt={`${name} miniatura ${i + 1}`} fill className="object-cover" sizes="25vw" />
              </button>
            ))}
          </div>
        )}

        {total > 1 && (
          <div className="flex justify-center gap-1.5 md:hidden mt-1">
            {images.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-200 ${i === active ? "w-5 h-1.5 bg-[#c9a84c]" : "w-1.5 h-1.5 bg-[#c9a84c]/30"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox fullscreen ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <div className="animate-lightbox-in relative w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}>

            {/* Imagen */}
            <div className="relative w-full max-w-3xl max-h-[85vh] aspect-square">
              <Image
                src={images[active]}
                alt={`${name} — ${active + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>

            {/* Cerrar */}
            <button onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 transition-colors"
              aria-label="Cerrar">
              <X size={22} />
            </button>

            {/* Flechas */}
            {total > 1 && (
              <>
                <button onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 transition-colors"
                  aria-label="Anterior">
                  <ChevronLeft size={28} />
                </button>
                <button onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 transition-colors"
                  aria-label="Siguiente">
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* Contador */}
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest">
              {active + 1} / {total}
            </p>

            {/* Dots */}
            {total > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)}
                    className={`rounded-full transition-all ${i === active ? "w-6 h-1.5 bg-[#c9a84c]" : "w-1.5 h-1.5 bg-white/30"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
