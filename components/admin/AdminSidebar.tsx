"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Package, Tag, LogOut,
  ExternalLink, ShoppingCart, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin",            label: "Dashboard",  icon: LayoutDashboard, exact: true },
  { href: "/admin/pedidos",    label: "Pedidos",     icon: ShoppingCart },
  { href: "/admin/productos",  label: "Productos",   icon: Package },
  { href: "/admin/categorias", label: "Categorías",  icon: Tag },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="font-serif text-base font-semibold text-white tracking-widest uppercase">
            Majestic Luxe
          </div>
          <div className="text-[0.6rem] tracking-[0.35em] text-[#c9a84c] uppercase">
            Panel Admin
          </div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden text-gray-400 hover:text-white p-1"
          aria-label="Cerrar menú"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm transition-all",
                active
                  ? "bg-[#c9a84c] text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-5 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink size={18} />
          Ver sitio
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP sidebar (always visible ≥ lg) ── */}
      <aside className="hidden lg:flex w-64 bg-[#0f0f0f] flex-col shrink-0 min-h-screen sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* ── MOBILE top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0f0f0f] h-14 flex items-center justify-between px-4 border-b border-white/10">
        <div>
          <span className="font-serif text-sm font-semibold text-white tracking-widest uppercase">
            Majestic Luxe
          </span>
          <span className="text-[0.55rem] tracking-[0.3em] text-[#c9a84c] uppercase ml-2">
            Admin
          </span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="text-gray-300 hover:text-white p-1"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ── MOBILE overlay ── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── MOBILE drawer ── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-[#0f0f0f] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
