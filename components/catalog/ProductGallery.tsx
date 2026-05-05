"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
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

  // Touch swipe
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only swipe horizontally (ignore vertical scrolls)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-[#f8f4ef] flex items-center justify-center">
        <span className="text-[#c9a84c] text-6xl">◈</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative aspect-square bg-[#f8f4ef] overflow-hidden select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.map((img, i) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-350 ${
              i === active ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={img}
              alt={`${name} — imagen ${i + 1}`}
              fill
              className={`object-cover transition-transform duration-700 ${
                i === active ? "scale-100" : "scale-105"
              }`}
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        ))}

        {/* Arrows — only when more than 1 image */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/90 hover:bg-white shadow flex items-center justify-center transition-all hover:scale-105"
            >
              <ChevronLeft size={18} className="text-[#0f0f0f]" />
            </button>
            <button
              onClick={next}
              aria-label="Siguiente imagen"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/90 hover:bg-white shadow flex items-center justify-center transition-all hover:scale-105"
            >
              <ChevronRight size={18} className="text-[#0f0f0f]" />
            </button>
          </>
        )}

        {/* Counter badge */}
        {total > 1 && (
          <span className="absolute bottom-3 right-3 z-20 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {active + 1} / {total}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => goTo(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={`relative aspect-square bg-[#f8f4ef] overflow-hidden transition-all duration-200 ${
                i === active
                  ? "ring-2 ring-[#c9a84c] ring-offset-1 opacity-100"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={img}
                alt={`${name} miniatura ${i + 1}`}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dot indicators — mobile only */}
      {total > 1 && (
        <div className="flex justify-center gap-1.5 md:hidden mt-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ir a imagen ${i + 1}`}
              className={`rounded-full transition-all duration-200 ${
                i === active
                  ? "w-5 h-1.5 bg-[#c9a84c]"
                  : "w-1.5 h-1.5 bg-[#c9a84c]/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
