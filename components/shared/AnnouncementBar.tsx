const items = [
  "✦ Envío gratis en compras +$300.000",
  "✦ Garantía de calidad 30 días",
  "✦ Oro laminado certificado 18k",
  "✦ Atención por WhatsApp",
  "✦ Pago seguro con Wompi y Nequi",
  "✦ Joyas únicas artesanales",
];

export default function AnnouncementBar() {
  const repeated = [...items, ...items];

  return (
    <div className="bg-[#0f0f0f] text-[#c9a84c] py-2 overflow-hidden relative z-40">
      <div className="flex animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="text-[11px] tracking-[0.18em] uppercase mx-8 shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
