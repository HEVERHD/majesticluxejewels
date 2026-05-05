"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ORDER_STATUSES = [
  { value: "PENDING",   label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "SHIPPED",   label: "Enviado" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
];

const PAYMENT_STATUSES = [
  { value: "PENDING",  label: "Pendiente" },
  { value: "PAID",     label: "Pagado" },
  { value: "FAILED",   label: "Fallido" },
  { value: "REFUNDED", label: "Reembolsado" },
];

export default function OrderStatusForm({
  orderId,
  currentStatus,
  currentPaymentStatus,
  paymentMethod,
  wompiTransactionId,
}: {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
  paymentMethod: string;
  wompiTransactionId: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch(`/api/pedidos/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus }),
      });
      setSaved(true);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs uppercase tracking-wide text-[#6b6b6b] mb-1.5">
          Estado del pedido
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-[#e8e0d5] bg-white text-[#0f0f0f] focus:outline-none focus:border-[#c9a84c]"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide text-[#6b6b6b] mb-1.5">
          Estado del pago
        </label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-[#e8e0d5] bg-white text-[#0f0f0f] focus:outline-none focus:border-[#c9a84c]"
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-[#c9a84c] text-white py-2.5 text-xs tracking-widest uppercase hover:bg-[#9a7a2e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar Cambios"}
      </button>
    </div>
  );
}
