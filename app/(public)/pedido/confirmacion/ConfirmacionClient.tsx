"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Clock, Truck, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site.config";

type Status = "loading" | "confirmed" | "pending" | "failed";

export default function ConfirmacionClient() {
  const params = useSearchParams();
  const orderNumber = params.get("order");
  const method = params.get("method"); // "cod" | "wompi"

  const [status, setStatus] = useState<Status>("loading");
  const [order, setOrder] = useState<{
    orderNumber: string;
    firstName: string;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
  } | null>(null);

  useEffect(() => {
    if (!orderNumber) { setStatus("failed"); return; }

    // For COD, show confirmed immediately
    if (method === "cod") {
      setStatus("confirmed");
      return;
    }

    // For Wompi, poll for payment status up to 10 seconds
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/pedidos?orderNumber=${orderNumber}`);
        if (!res.ok) return;
        // We don't have an endpoint by orderNumber yet, use the general one
        // Just show pending and let webhook update it
        clearInterval(interval);
        setStatus("pending");
      } catch {
        if (attempts >= 3) {
          clearInterval(interval);
          setStatus("pending");
        }
      }
    }, 2000);

    // Always resolve after 6s
    setTimeout(() => {
      clearInterval(interval);
      setStatus((s) => (s === "loading" ? "pending" : s));
    }, 6000);

    return () => clearInterval(interval);
  }, [orderNumber, method]);

  const waText = encodeURIComponent(
    `Hola, acabo de hacer un pedido en Majestic Luxe Jewels. Mi número de pedido es: ${orderNumber}`
  );
  const waUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${waText}`;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f4ef] gap-4">
        <div className="w-10 h-10 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
        <p className="text-sm text-[#6b6b6b]">Verificando tu pago...</p>
      </div>
    );
  }

  const whatsappIcon = (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#f8f4ef]">
      {/* Top bar */}
      <div className="bg-[#0f0f0f] py-3 text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-[#c9a84c]">
          Majestic Luxe Jewels
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full space-y-4">

          {/* Main card */}
          <div className="bg-white p-8 text-center space-y-6">
            {/* Status icon */}
            <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full ${
              status === "confirmed" ? "bg-green-50" :
              status === "pending"   ? "bg-[#fdf8ee]" : "bg-red-50"
            }`}>
              {status === "confirmed" ? (
                <CheckCircle size={36} className="text-[#1c6644]" />
              ) : status === "pending" ? (
                <Clock size={36} className="text-[#c9a84c]" />
              ) : (
                <XCircle size={36} className="text-red-500" />
              )}
            </div>

            {/* Title */}
            {status === "confirmed" && (
              <div>
                <h1 className="font-serif text-2xl font-semibold text-[#0f0f0f] mb-2">
                  ¡Pedido Confirmado!
                </h1>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">
                  {method === "cod"
                    ? "Recibimos tu pedido. Te contactaremos por WhatsApp para coordinar la entrega."
                    : "Tu pago fue procesado exitosamente. ¡Gracias por tu compra!"}
                </p>
              </div>
            )}
            {status === "pending" && (
              <div>
                <h1 className="font-serif text-2xl font-semibold text-[#0f0f0f] mb-2">
                  Verificando tu pago
                </h1>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">
                  Estamos confirmando tu pago con Wompi. Te notificaremos en cuanto esté listo.
                </p>
              </div>
            )}
            {status === "failed" && (
              <div>
                <h1 className="font-serif text-2xl font-semibold text-[#0f0f0f] mb-2">
                  Algo salió mal
                </h1>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">
                  No pudimos procesar tu pedido. Intenta de nuevo o contáctanos por WhatsApp.
                </p>
              </div>
            )}

            {/* Order number */}
            {orderNumber && (
              <div className="bg-[#f8f4ef] border border-[#e8e0d5] py-4 px-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#6b6b6b] mb-1">
                  Número de pedido
                </p>
                <p className="font-serif font-semibold text-[#c9a84c] text-xl tracking-wide">
                  {orderNumber}
                </p>
                <p className="text-[10px] text-[#6b6b6b] mt-1">
                  Guárdalo para hacer seguimiento
                </p>
              </div>
            )}

            {/* Next steps */}
            {status !== "failed" && (
              <div className="text-left space-y-3 border-t border-[#e8e0d5] pt-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#c9a84c] font-medium mb-4">
                  ¿Qué sigue?
                </p>
                {[
                  { icon: MessageCircle, text: "Te escribiremos por WhatsApp para confirmar tu pedido y coordinar la entrega." },
                  { icon: Truck,         text: "Envío a toda Colombia en 2–5 días hábiles. Te enviamos el número de guía." },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-[#f8f4ef] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={14} className="text-[#c9a84c]" />
                    </div>
                    <p className="text-xs text-[#6b6b6b] leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 text-xs tracking-widest uppercase hover:bg-[#1da851] transition-colors"
              >
                {whatsappIcon}
                {status === "failed" ? "Contactar soporte" : "Escribirnos por WhatsApp"}
              </a>
              {status === "failed" ? (
                <Link
                  href="/checkout"
                  className="text-center py-3.5 border border-[#c9a84c] text-[#c9a84c] text-xs tracking-widest uppercase hover:bg-[#c9a84c] hover:text-white transition-colors"
                >
                  Intentar de Nuevo
                </Link>
              ) : (
                <Link
                  href="/catalogo"
                  className="text-center py-3.5 border border-[#e8e0d5] text-[#6b6b6b] text-xs tracking-widest uppercase hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
                >
                  Seguir Comprando
                </Link>
              )}
            </div>
          </div>

          {/* Trust footer */}
          <div className="bg-[#0f0f0f] p-4 text-center">
            <p className="text-[10px] text-[#c9a84c] tracking-[0.2em] uppercase mb-1">
              Compra protegida
            </p>
            <p className="text-[10px] text-gray-500">
              Garantía de calidad · Envío asegurado · Soporte por WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
