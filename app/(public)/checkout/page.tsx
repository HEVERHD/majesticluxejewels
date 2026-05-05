"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, CreditCard, Truck, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { buildWompiCheckoutUrl } from "@/lib/wompi";

const DEPARTMENTS = [
  "Amazonas","Antioquia","Arauca","Atlántico","Bolívar","Boyacá","Caldas",
  "Caquetá","Casanare","Cauca","Cesar","Chocó","Córdoba","Cundinamarca",
  "Guainía","Guaviare","Huila","La Guajira","Magdalena","Meta","Nariño",
  "Norte de Santander","Putumayo","Quindío","Risaralda","San Andrés",
  "Santander","Sucre","Tolima","Valle del Cauca","Vaupés","Vichada",
];

const FREE_SHIPPING_THRESHOLD = 150000;
const SHIPPING_COST = 20000;

type PaymentTab = "COD" | "WOMPI";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [tab, setTab] = useState<PaymentTab>("WOMPI");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    address: "", addressLine2: "", city: "", department: "", postalCode: "",
    notes: "", newsletter: false,
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) router.replace("/catalogo");
  }, [items, router]);

  function set(field: string, value: string | boolean) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Requerido";
    if (!form.lastName.trim()) e.lastName = "Requerido";
    if (!form.phone.trim()) e.phone = "Requerido";
    if (tab === "WOMPI" && !form.email.trim()) e.email = "Requerido para pago online";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
    if (!form.address.trim()) e.address = "Requerido";
    if (!form.city.trim()) e.city = "Requerido";
    if (!form.department) e.department = "Selecciona un departamento";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod: tab,
          items: items.map((i) => ({
            id: i.id, name: i.name, image: i.image, price: i.price, quantity: i.quantity,
          })),
          subtotal, shippingCost, total,
        }),
      });

      if (!res.ok) throw new Error("Error al crear pedido");
      const { order } = await res.json();

      if (tab === "COD") {
        clearCart();
        router.push(`/pedido/confirmacion?order=${order.orderNumber}&method=cod`);
        return;
      }

      // WOMPI: build redirect URL and send user
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const redirectUrl = `${appUrl}/pedido/confirmacion?order=${order.orderNumber}&method=wompi`;

      const wompiUrl = await buildWompiCheckoutUrl({
        reference: order.orderNumber,
        amountInCents: Math.round(total * 100),
        customerEmail: form.email,
        redirectUrl,
        description: `Majestic Luxe Jewels — Pedido ${order.orderNumber}`,
      });

      window.location.href = wompiUrl;
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error. Por favor intenta de nuevo.");
      setLoading(false);
    }
  }

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#f8f4ef]">
      {/* Header strip */}
      <div className="bg-[#0f0f0f] py-3 text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-[#c9a84c]">
          Majestic Luxe Jewels — Checkout Seguro
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* LEFT: Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment method tabs */}
          <div>
            <h2 className="font-serif text-xl font-medium text-[#0f0f0f] mb-4">
              Método de pago
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTab("WOMPI")}
                className={`flex items-center gap-3 p-4 border-2 transition-all ${
                  tab === "WOMPI"
                    ? "border-[#c9a84c] bg-white"
                    : "border-[#e8e0d5] bg-white hover:border-[#c9a84c]/50"
                }`}
              >
                <CreditCard size={20} className="text-[#c9a84c] flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-[#0f0f0f]">Pagar ahora</p>
                  <p className="text-xs text-[#6b6b6b]">Tarjeta, PSE, Nequi</p>
                </div>
                {tab === "WOMPI" && (
                  <span className="ml-auto w-4 h-4 bg-[#c9a84c] rounded-full flex-shrink-0" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setTab("COD")}
                className={`flex items-center gap-3 p-4 border-2 transition-all ${
                  tab === "COD"
                    ? "border-[#c9a84c] bg-white"
                    : "border-[#e8e0d5] bg-white hover:border-[#c9a84c]/50"
                }`}
              >
                <Truck size={20} className="text-[#c9a84c] flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-[#0f0f0f]">Contra entrega</p>
                  <p className="text-xs text-[#6b6b6b]">Paga al recibir</p>
                </div>
                {tab === "COD" && (
                  <span className="ml-auto w-4 h-4 bg-[#c9a84c] rounded-full flex-shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-white p-6 space-y-4">
            <h3 className="font-serif text-base font-medium text-[#0f0f0f]">
              Información de contacto
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombre *" error={errors.firstName}>
                <input value={form.firstName} onChange={(e) => set("firstName", e.target.value)}
                  className={inputCls(errors.firstName)} placeholder="Ana" />
              </Field>
              <Field label="Apellido *" error={errors.lastName}>
                <input value={form.lastName} onChange={(e) => set("lastName", e.target.value)}
                  className={inputCls(errors.lastName)} placeholder="García" />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Teléfono / WhatsApp *" error={errors.phone}>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  className={inputCls(errors.phone)} placeholder="3001234567" type="tel" />
              </Field>
              <Field label={`Email ${tab === "WOMPI" ? "*" : "(opcional)"}`} error={errors.email}>
                <input value={form.email} onChange={(e) => set("email", e.target.value)}
                  className={inputCls(errors.email)} placeholder="ana@ejemplo.com" type="email" />
              </Field>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white p-6 space-y-4">
            <h3 className="font-serif text-base font-medium text-[#0f0f0f]">
              Dirección de envío
            </h3>
            <Field label="Dirección *" error={errors.address}>
              <input value={form.address} onChange={(e) => set("address", e.target.value)}
                className={inputCls(errors.address)} placeholder="Calle 10 # 5-20" />
            </Field>
            <Field label="Apartamento / Barrio (opcional)">
              <input value={form.addressLine2} onChange={(e) => set("addressLine2", e.target.value)}
                className={inputCls()} placeholder="Apto 301, Barrio El Prado" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Departamento *" error={errors.department}>
                <div className="relative">
                  <select
                    value={form.department}
                    onChange={(e) => set("department", e.target.value)}
                    className={`${inputCls(errors.department)} appearance-none pr-8`}
                  >
                    <option value="">Seleccionar...</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] pointer-events-none" />
                </div>
              </Field>
              <Field label="Ciudad *" error={errors.city}>
                <input value={form.city} onChange={(e) => set("city", e.target.value)}
                  className={inputCls(errors.city)} placeholder="Medellín" />
              </Field>
            </div>
            <Field label="Código postal (opcional)">
              <input value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)}
                className={inputCls()} placeholder="050001" />
            </Field>
          </div>

          {/* Notes + newsletter */}
          <div className="bg-white p-6 space-y-4">
            <Field label="Notas del pedido (opcional)">
              <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)}
                className={`${inputCls()} resize-none`} rows={3}
                placeholder="Instrucciones especiales para la entrega..." />
            </Field>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.newsletter}
                onChange={(e) => set("newsletter", e.target.checked)}
                className="mt-0.5 accent-[#c9a84c]"
              />
              <span className="text-xs text-[#6b6b6b] group-hover:text-[#0f0f0f] transition-colors">
                Quiero recibir novedades y ofertas exclusivas por email
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a84c] text-white py-4 text-sm tracking-widest uppercase font-medium hover:bg-[#9a7a2e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando...
              </>
            ) : tab === "WOMPI" ? (
              "Pagar con Wompi →"
            ) : (
              "Confirmar Pedido →"
            )}
          </button>

          {tab === "WOMPI" && (
            <p className="text-xs text-center text-[#6b6b6b]">
              Serás redirigido a Wompi para completar el pago de forma segura.
              Acepta tarjetas, PSE, Nequi y Bancolombia.
            </p>
          )}
          {tab === "COD" && (
            <p className="text-xs text-center text-[#6b6b6b]">
              Pagarás en efectivo al recibir tu pedido. Nos contactaremos por WhatsApp para coordinar la entrega.
            </p>
          )}
        </form>

        {/* RIGHT: Order summary */}
        <div className="space-y-4">
          <div className="bg-white p-6 sticky top-28">
            <h2 className="font-serif text-lg font-medium text-[#0f0f0f] mb-5">
              Tu pedido
            </h2>
            <ul className="space-y-4 mb-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-16 bg-[#f8f4ef] flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={16} className="text-[#c9a84c]/40" />
                      </div>
                    )}
                    <span className="absolute -top-1.5 -right-1.5 bg-[#c9a84c] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-xs font-medium text-[#0f0f0f] line-clamp-2">{item.name}</p>
                    <p className="text-xs text-[#c9a84c] mt-0.5">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-[#e8e0d5] pt-4 space-y-2">
              <div className="flex justify-between text-sm text-[#6b6b6b]">
                <span>Subtotal</span>
                <span className="font-medium text-[#0f0f0f]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#6b6b6b]">
                <span>Envío nacional</span>
                <span className={shippingCost === 0 ? "text-[#1c6644] font-medium" : "font-medium text-[#0f0f0f]"}>
                  {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
                </span>
              </div>
              {tab === "COD" && (
                <div className="flex justify-between text-xs text-[#6b6b6b] bg-[#f8f4ef] px-3 py-2 rounded">
                  <span>Pago contra entrega</span>
                  <span className="text-[#1c6644] font-medium">+$0</span>
                </div>
              )}
              <div className="flex justify-between font-serif font-semibold text-base border-t border-[#e8e0d5] pt-3 mt-2">
                <span>Total</span>
                <span className="text-[#c9a84c]">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="bg-[#0f0f0f] p-5 text-center space-y-2">
            <p className="text-xs text-[#c9a84c] tracking-[0.2em] uppercase">Compra segura</p>
            <p className="text-xs text-gray-400">
              Datos protegidos · Envío asegurado · Garantía de calidad
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, error, children,
}: {
  label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs tracking-wide text-[#6b6b6b] mb-1.5 uppercase font-medium">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full px-3 py-2.5 text-sm border ${
    error ? "border-red-400" : "border-[#e8e0d5]"
  } text-[#0f0f0f] bg-white focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#b0a898]`;
}
