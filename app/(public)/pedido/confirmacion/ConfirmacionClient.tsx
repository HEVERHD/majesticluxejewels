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

  return (
    <div className="min-h-screen bg-[#f8f4ef] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white shadow-sm p-8 text-center space-y-6">
        {/* Icon */}
        {status === "confirmed" ? (
          <CheckCircle size={56} className="text-[#1c6644] mx-auto" />
        ) : status === "pending" ? (
          <Clock size={56} className="text-[#c9a84c] mx-auto" />
        ) : (
          <XCircle size={56} className="text-red-500 mx-auto" />
        )}

        {/* Title */}
        <div>
          {status === "confirmed" && (
            <>
              <h1 className="font-serif text-2xl font-semibold text-[#0f0f0f] mb-2">
                ¡Pedido Confirmado!
              </h1>
              <p className="text-sm text-[#6b6b6b]">
                {method === "cod"
                  ? "Recibimos tu pedido. Nos contactaremos por WhatsApp para coordinar la entrega y el pago."
                  : "Tu pago fue procesado exitosamente."}
              </p>
            </>
          )}
          {status === "pending" && (
            <>
              <h1 className="font-serif text-2xl font-semibold text-[#0f0f0f] mb-2">
                Pedido en Proceso
              </h1>
              <p className="text-sm text-[#6b6b6b]">
                Estamos verificando tu pago. Te notificaremos por email cuando esté confirmado.
              </p>
            </>
          )}
          {status === "failed" && (
            <>
              <h1 className="font-serif text-2xl font-semibold text-[#0f0f0f] mb-2">
                Error en el Pedido
              </h1>
              <p className="text-sm text-[#6b6b6b]">
                No pudimos procesar tu pedido. Por favor intenta de nuevo o contáctanos.
              </p>
            </>
          )}
        </div>

        {/* Order number */}
        {orderNumber && (
          <div className="bg-[#f8f4ef] py-3 px-4">
            <p className="text-xs text-[#6b6b6b] uppercase tracking-wider mb-1">Número de pedido</p>
            <p className="font-serif font-semibold text-[#c9a84c] text-lg">{orderNumber}</p>
            <p className="text-xs text-[#6b6b6b] mt-1">Guarda este número para hacer seguimiento</p>
          </div>
        )}

        {/* What's next */}
        {status !== "failed" && (
          <div className="text-left space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#c9a84c] font-medium">Próximos pasos</p>
            <div className="flex items-start gap-3">
              <MessageCircle size={16} className="text-[#c9a84c] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#6b6b6b]">Te contactaremos por WhatsApp para confirmar tu pedido y dirección.</p>
            </div>
            <div className="flex items-start gap-3">
              <Truck size={16} className="text-[#c9a84c] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#6b6b6b]">El envío se realiza a todo Colombia. Tiempo estimado 2-5 días hábiles.</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 text-xs tracking-widest uppercase hover:bg-[#1da851] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Contactar por WhatsApp
          </a>
          {status === "failed" ? (
            <Link
              href="/checkout"
              className="text-center py-3 border border-[#c9a84c] text-[#c9a84c] text-xs tracking-widest uppercase hover:bg-[#c9a84c] hover:text-white transition-colors"
            >
              Intentar de Nuevo
            </Link>
          ) : (
            <Link
              href="/catalogo"
              className="text-center py-3 border border-[#e8e0d5] text-[#6b6b6b] text-xs tracking-widest uppercase hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
            >
              Seguir Comprando
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
