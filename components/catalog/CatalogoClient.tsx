"use client";

import { useState, useMemo, useTransition } from "react";
import ProductCard from "./ProductCard";
import { CatalogSkeleton } from "./ProductCardSkeleton";

type Category = { id: string; name: string; slug: string };
type Product = {
  id: string; name: string; slug: string; price: number;
  images: string[]; featured: boolean; stock: number; active: boolean;
  category: Category | null;
};

export default function CatalogoClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(
    () => selected ? products.filter((p) => p.category?.slug === selected) : products,
    [products, selected]
  );

  function setFilter(slug: string | null) {
    startTransition(() => setSelected(slug));
  }

  return (
    <>
      {/* Filtros animados */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setFilter(null)}
          className={`px-5 py-2 text-xs tracking-widest uppercase border transition-all duration-200 ${
            !selected
              ? "bg-[#0f0f0f] text-white border-[#0f0f0f] scale-105"
              : "bg-white text-[#6b6b6b] border-[#ddd] hover:border-[#c9a84c] hover:text-[#c9a84c]"
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.slug)}
            className={`px-5 py-2 text-xs tracking-widest uppercase border transition-all duration-200 ${
              selected === cat.slug
                ? "bg-[#c9a84c] text-white border-[#c9a84c] scale-105"
                : "bg-white text-[#6b6b6b] border-[#ddd] hover:border-[#c9a84c] hover:text-[#c9a84c]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Contador */}
      <p className="text-sm text-[#6b6b6b] mb-8 transition-all duration-300">
        {filtered.length} {filtered.length === 1 ? "pieza" : "piezas"}
        {selected && ` en "${categories.find((c) => c.slug === selected)?.name}"`}
      </p>

      {/* Grid con transición */}
      {isPending ? (
        <CatalogSkeleton />
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-serif text-2xl text-[#0f0f0f] mb-3">No hay piezas disponibles</p>
          <p className="text-sm text-[#6b6b6b]">Intenta con otra categoría</p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14"
          key={selected ?? "all"}
        >
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
