import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

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
  const image = product.images[0] || "/placeholder-jewelry.jpg";

  return (
    <Link href={`/producto/${product.slug}`} className="group">
      <div className="relative overflow-hidden bg-[#f8f4ef] aspect-square mb-4">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-[#c9a84c] text-white text-[10px] tracking-[0.15em] uppercase px-2 py-1">
            Destacado
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

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
