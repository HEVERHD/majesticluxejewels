"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ShoppingBag } from "lucide-react";
import { formatPrice, formatPriceUSD } from "@/lib/utils";
import { siteConfig } from "@/lib/site.config";
import { useCart } from "@/context/CartContext";
import { haptic } from "@/lib/haptic";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: { name: string } | null;
  featured: boolean;
  stock: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] || "";
  const { addItem } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    haptic(15);
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image,
    });
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (0.5 - y) * 12;
    const tiltY = (x - 0.5) * 12;
    el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(201,168,76,0.2) 0%, transparent 65%)`;
      glareRef.current.style.opacity = "1";
    }
  }

  function onMouseLeave() {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group relative"
      style={{ transition: "transform 0.18s ease", transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {/* Brillo dorado que sigue el cursor */}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none z-20 opacity-0 rounded-[inherit]"
        style={{ transition: "opacity 0.25s ease" }}
      />
    <Link href={`/producto/${product.slug}`} className="block">
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
        <span className="absolute top-3 right-3 bg-[#0f0f0f]/80 text-[#c9a84c] text-[9px] tracking-[0.12em] uppercase px-2 py-1 z-10 backdrop-blur-sm">
          Oro Laminado
        </span>

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
      <div className="flex items-baseline gap-2">
        <p className="text-sm text-[#6b6b6b] font-light">{formatPrice(product.price)}</p>
        <p className="text-xs text-gray-400">≈ {formatPriceUSD(product.price, siteConfig.copToUsdRate)}</p>
      </div>
      {product.stock > 0 && product.stock <= 3 && (
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse shrink-0" />
          <span className="text-[10px] text-red-500 font-medium">
            Solo {product.stock} {product.stock === 1 ? "disponible" : "disponibles"}
          </span>
        </div>
      )}
    </Link>
    </div>
  );
}
