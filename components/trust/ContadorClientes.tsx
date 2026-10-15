const stats = [
  { valor: "+500",  etiqueta: "Clientas satisfechas",      detalle: "en toda Colombia" },
  { valor: "4.9★",  etiqueta: "Calificación promedio",     detalle: "en cada compra" },
  { valor: "2-5d",  etiqueta: "Tiempo de entrega",         detalle: "días hábiles" },
  { valor: "100%",  etiqueta: "Piezas verificadas",        detalle: "antes de enviarse" },
];

export default function ContadorClientes() {
  return (
    <section className="bg-[#c9a84c] py-14 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#b8964a]">
        {stats.map((s) => (
          <div
            key={s.etiqueta}
            className="bg-[#c9a84c] px-8 py-10 text-center"
          >
            <p className="font-serif text-4xl font-semibold text-white mb-1">{s.valor}</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/90 mb-1">
              {s.etiqueta}
            </p>
            <p className="text-[10px] text-white/60 uppercase tracking-wide">{s.detalle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
