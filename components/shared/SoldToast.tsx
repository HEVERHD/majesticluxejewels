"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, X } from "lucide-react";

const NOTIFICATIONS = [
  { city: "Bogotá",      product: "Pulsera de balines de oro" },
  { city: "Medellín",    product: "Topos corazón de oro" },
  { city: "Cali",        product: "Dije de oro laminado" },
  { city: "Barranquilla",product: "Candongas de oro" },
  { city: "Cartagena",   product: "Pulsera para parejas" },
  { city: "Bucaramanga", product: "Topos estrellas cristal" },
  { city: "Pereira",     product: "Dije cruz de oro" },
  { city: "Manizales",   product: "Pulsera balines damas" },
  { city: "Ibagué",      product: "Topos virgen del carmen" },
  { city: "Santa Marta", product: "Candongas elegantes" },
];

function getRandom() {
  return NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)];
}

function timeAgo() {
  const mins = Math.floor(Math.random() * 12) + 1;
  return `Hace ${mins} min`;
}

export default function SoldToast() {
  const [visible, setVisible]   = useState(false);
  const [notif, setNotif]       = useState(getRandom);
  const [time, setTime]         = useState("");
  const [dismissed, setDismiss] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Primera notificación a los 8 segundos
    const first = setTimeout(() => {
      setNotif(getRandom());
      setTime(timeAgo());
      setVisible(true);
    }, 8000);

    return () => clearTimeout(first);
  }, [dismissed]);

  useEffect(() => {
    if (!visible) return;
    // Auto-ocultar a los 5 segundos
    const hide = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(hide);
  }, [visible]);

  useEffect(() => {
    if (visible || dismissed) return;
    // Mostrar de nuevo cada 35 segundos
    const repeat = setInterval(() => {
      setNotif(getRandom());
      setTime(timeAgo());
      setVisible(true);
    }, 35000);
    return () => clearInterval(repeat);
  }, [visible, dismissed]);

  if (dismissed || !visible) return null;

  return (
    <div
      className={`fixed bottom-20 left-4 z-[90] max-w-[280px] bg-white shadow-2xl border border-[#e8e0d5] p-3 flex items-start gap-3 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Ícono */}
      <div className="w-9 h-9 bg-[#f8f4ef] flex items-center justify-center shrink-0">
        <ShoppingBag size={16} className="text-[#c9a84c]" />
      </div>

      {/* Texto */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[#0f0f0f] font-medium leading-snug line-clamp-2">
          Alguien en <span className="text-[#c9a84c]">{notif.city}</span> acaba de ver{" "}
          <span className="font-semibold">{notif.product}</span>
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">{time} ✦</p>
      </div>

      {/* Cerrar */}
      <button
        onClick={() => { setVisible(false); setDismiss(true); }}
        className="text-gray-300 hover:text-gray-500 transition-colors shrink-0 mt-0.5"
        aria-label="Cerrar"
      >
        <X size={13} />
      </button>
    </div>
  );
}
