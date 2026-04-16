import Link from "next/link";
import { siteConfig } from "@/lib/site.config";

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <div className="font-serif text-2xl font-semibold mb-1">Majestic Luxe</div>
          <div className="text-xs tracking-[0.25em] text-[#b8964a] uppercase mb-4">Jewels</div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            {siteConfig.description}
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-xs tracking-[0.2em] uppercase text-[#b8964a] mb-5 font-medium">
            Navegación
          </h3>
          <div className="flex flex-col gap-3">
            <Link href="/" className="text-sm text-gray-400 hover:text-[#b8964a] transition-colors">
              Inicio
            </Link>
            <Link href="/catalogo" className="text-sm text-gray-400 hover:text-[#b8964a] transition-colors">
              Catálogo
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xs tracking-[0.2em] uppercase text-[#b8964a] mb-5 font-medium">
            Contacto
          </h3>
          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-[#b8964a] transition-colors"
            >
              WhatsApp
            </a>
            <span className="text-sm text-gray-400">{siteConfig.instagram}</span>
            <span className="text-sm text-gray-400">{siteConfig.email}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} Majestic Luxe Jewels. Todos los derechos reservados.
        </p>
        <Link href="/login" className="text-xs text-gray-700 hover:text-gray-500 transition-colors">
          Admin
        </Link>
      </div>
    </footer>
  );
}
