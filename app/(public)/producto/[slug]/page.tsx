export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, buildWhatsAppUrl } from "@/lib/utils";
import { siteConfig } from "@/lib/site.config";
import { ArrowLeft, CheckCircle } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, active: true },
    include: { category: true },
  });
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description || `${product.name} - ${siteConfig.name}`,
  };
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/producto/${slug}`;
  const whatsappUrl = buildWhatsAppUrl(
    siteConfig.whatsappNumber,
    product.name,
    productUrl,
    siteConfig.whatsappMessage
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6b6b6b] mb-10">
          <Link href="/" className="hover:text-[#c9a84c] transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo" className="hover:text-[#c9a84c] transition-colors">Catálogo</Link>
          <span>/</span>
          <span className="text-[#0f0f0f]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Galería */}
          <div>
            <div className="relative aspect-square bg-[#f8f4ef] overflow-hidden mb-4">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[#c9a84c] text-6xl">
                  ◈
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="relative aspect-square bg-[#f8f4ef] overflow-hidden">
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {product.category && (
              <p className="text-xs tracking-[0.2em] uppercase text-[#c9a84c] mb-3">
                {product.category.name}
              </p>
            )}

            <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#0f0f0f] mb-6 leading-tight">
              {product.name}
            </h1>

            <p className="font-serif text-3xl text-[#c9a84c] mb-6 font-light">
              {formatPrice(product.price)}
            </p>

            {product.description && (
              <p className="text-[#6b6b6b] leading-relaxed mb-8 font-light text-sm">
                {product.description}
              </p>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-8">
              <CheckCircle size={16} className={product.stock > 0 ? "text-green-500" : "text-gray-400"} />
              <span className="text-sm text-[#6b6b6b]">
                {product.stock > 0 ? `Disponible (${product.stock} en stock)` : "Sin stock"}
              </span>
            </div>

            {/* CTA WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white w-full py-4 text-sm tracking-widest uppercase hover:bg-[#1da851] transition-colors mb-4"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Consultar por WhatsApp
            </a>

            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 border border-[#ddd] text-[#6b6b6b] w-full py-4 text-sm tracking-widest uppercase hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
            >
              <ArrowLeft size={16} /> Ver más piezas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
