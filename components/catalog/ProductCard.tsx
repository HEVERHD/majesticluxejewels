"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: { name: string } | null;
  featured: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] || "";
  const { addItem } = useCart();

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image,
    });
  }

  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative overflow-hidden bg-[#f8f4ef] aspect-square mb-4">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={32} className="text-[#c9a84c]/40" />
          </div>
        )}

        {product.featured && (
          <span className="absolute top-3 left-3 bg-[#c9a84c] text-white text-[10px] tracking-[0.15em] uppercase px-2 py-1 z-10">
            Destacado
          </span>
        )}

        {/* Add to cart overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            className="bg-white text-[#0f0f0f] text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 font-medium hover:bg-[#c9a84c] hover:text-white transition-colors duration-200 flex items-center gap-2 shadow-lg"
          >
            <ShoppingBag size={12} />
            Agregar
          </button>
        </div>
      </div>

      {/* Info */}
      {product.category && (
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a84c] mb-1 font-medium">
          {product.category.name}
        </p>
      )}
      <h3 className="font-serif text-base font-medium text-[#0f0f0f] mb-1 group-hover:text-[#c9a84c] transition-colors line-clamp-2">
        {product.name}
      </h3>
      <p className="text-sm text-[#6b6b6b] font-light">{formatPrice(product.price)}</p>
    </Link>
  );
}
