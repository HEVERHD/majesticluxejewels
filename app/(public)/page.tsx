export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/catalog/ProductCard";
import { siteConfig } from "@/lib/site.config";
import { ArrowRight, Gem } from "lucide-react";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, active: true },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0f0f0f] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80')",
          }}
        />
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6 animate-fade-up">
              Colección exclusiva
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-medium text-white leading-tight mb-6 animate-fade-up-delay-1">
              Elegancia que
              <br />
              <em className="text-[#c9a84c]">trasciende</em> el tiempo
            </h1>
            <p className="text-gray-300 text-lg font-light leading-relaxed mb-10 animate-fade-up-delay-2">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up-delay-3">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 bg-[#c9a84c] text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-[#9a7a2e] transition-colors"
              >
                Ver Catálogo <ArrowRight size={16} />
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/40 text-white px-8 py-4 text-sm tracking-widest uppercase hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
              >
                Contactar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="bg-[#f8f4ef] py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: "✦", title: "Materiales premium", desc: "Oro, plata y piedras preciosas de la más alta calidad" },
            { icon: "✦", title: "Piezas únicas", desc: "Cada joya es una obra de arte creada con dedicación artesanal" },
            { icon: "✦", title: "Envío seguro", desc: "Packaging exclusivo y envío asegurado a todo el país" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <span className="text-[#c9a84c] text-lg mt-1">{item.icon}</span>
              <div>
                <h3 className="font-serif text-base font-semibold text-[#0f0f0f] mb-1">{item.title}</h3>
                <p className="text-sm text-[#6b6b6b] font-light leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      {categories.length > 0 && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Explorar</p>
              <h2 className="font-serif text-4xl font-medium text-[#0f0f0f]">Nuestras Categorías</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalogo?categoria=${cat.slug}`}
                  className="group relative bg-[#f8f4ef] p-6 text-center hover:bg-[#0f0f0f] transition-colors duration-300"
                >
                  <Gem
                    size={24}
                    className="mx-auto mb-3 text-[#c9a84c] group-hover:text-[#d4af6e] transition-colors"
                  />
                  <p className="font-serif text-sm font-medium text-[#0f0f0f] group-hover:text-white transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-xs text-[#c9a84c] mt-1">
                    {cat._count.products} piezas
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Productos destacados */}
      {featured.length > 0 && (
        <section className="py-20 px-6 bg-[#f8f4ef]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Selección especial</p>
                <h2 className="font-serif text-4xl font-medium text-[#0f0f0f]">Piezas Destacadas</h2>
              </div>
              <Link
                href="/catalogo"
                className="hidden md:inline-flex items-center gap-2 text-sm text-[#6b6b6b] hover:text-[#c9a84c] transition-colors"
              >
                Ver todo <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-10 md:hidden">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 text-sm text-[#c9a84c] border border-[#c9a84c] px-6 py-3"
              >
                Ver catálogo completo <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA WhatsApp */}
      <section className="bg-[#0f0f0f] py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a84c] mb-4">¿Buscas algo especial?</p>
          <h2 className="font-serif text-4xl font-medium text-white mb-6">
            Joyas personalizadas para ti
          </h2>
          <p className="text-gray-400 font-light mb-10">
            Cuéntanos tu idea y creamos la pieza perfecta. Contáctanos por WhatsApp y te asesoramos.
          </p>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=Hola, me gustaría consultar sobre una joya personalizada`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-10 py-4 text-sm tracking-widest uppercase hover:bg-[#1da851] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Consultar por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
