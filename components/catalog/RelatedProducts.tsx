"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Product = {
  id: string; name: string; slug: string;
  price: number; images: string[];
  category: { name: string } | null;
};

export default function RelatedProducts({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 220 : -220, behavior: "smooth" });
  };

  return (
    <section className="mt-16 border-t border-[#e8e0d5] pt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#c9a84c] mb-1">Colección</p>
          <h2 className="font-serif text-xl text-[#0f0f0f]">También te puede gustar</h2>
        </div>
        {/* Flechas — solo desktop */}
        <div className="hidden sm:flex gap-2">
          <button onClick={() => scroll("left")}
            className="w-9 h-9 border border-[#ddd] flex items-center justify-center hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll("right")}
            className="w-9 h-9 border border-[#ddd] flex items-center justify-center hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scroll horizontal — táctil en mobile */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/producto/${p.slug}`}
            className="snap-start shrink-0 w-[160px] sm:w-[200px] group"
          >
            <div className="relative aspect-square bg-[#f8f4ef] overflow-hidden mb-3">
              {p.images[0] ? (
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="200px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[#c9a84c] text-3xl">◈</span>
                </div>
              )}
            </div>
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#c9a84c] mb-0.5">
              {p.category?.name}
            </p>
            <p className="text-xs text-[#0f0f0f] font-medium line-clamp-2 mb-1 group-hover:text-[#c9a84c] transition-colors">
              {p.name}
            </p>
            <p className="text-xs text-[#6b6b6b]">{formatPrice(p.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
