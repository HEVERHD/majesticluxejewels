"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Category = { id: string; name: string; slug: string };

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("categoria");

  function setFilter(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("categoria", slug);
    } else {
      params.delete("categoria");
    }
    router.push(`/catalogo?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-10">
      <button
        onClick={() => setFilter(null)}
        className={`px-4 py-2 text-xs tracking-widest uppercase border transition-all ${
          !current
            ? "bg-[#0f0f0f] text-white border-[#0f0f0f]"
            : "bg-white text-[#6b6b6b] border-[#ddd] hover:border-[#c9a84c] hover:text-[#c9a84c]"
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setFilter(cat.slug)}
          className={`px-4 py-2 text-xs tracking-widest uppercase border transition-all ${
            current === cat.slug
              ? "bg-[#c9a84c] text-white border-[#c9a84c]"
              : "bg-white text-[#6b6b6b] border-[#ddd] hover:border-[#c9a84c] hover:text-[#c9a84c]"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
