const testimonios = [
  {
    nombre: "Valentina R.",
    ciudad: "Bogotá",
    texto:
      "Compré un collar y me llegó en 3 días. La calidad es impresionante, parece oro sólido. Ya le regalé uno a mi mamá y quedó encantada.",
    estrellas: 5,
    pieza: "Collar Lágrima Dorada",
    inicial: "V",
  },
  {
    nombre: "Camila T.",
    ciudad: "Medellín",
    texto:
      "Tenía miedo de que se pusiera negro rápido como otras joyas, pero llevo 4 meses usándola casi a diario y sigue igual de brillante. ¡Súper recomendada!",
    estrellas: 5,
    pieza: "Aretes Huggie",
    inicial: "C",
  },
  {
    nombre: "Luisa M.",
    ciudad: "Cali",
    texto:
      "El empaque es muy bonito, perfecto para regalo. El servicio por WhatsApp fue rápido y me ayudaron a elegir la talla del anillo sin problema.",
    estrellas: 5,
    pieza: "Anillo Infinity",
    inicial: "L",
  },
  {
    nombre: "Daniela P.",
    ciudad: "Cartagena",
    texto:
      "Ya van tres compras y nunca me ha fallado. El diseño es elegante y la atención al cliente es increíble. Sin duda mi tienda favorita de joyas.",
    estrellas: 5,
    pieza: "Pulsera Figaro",
    inicial: "D",
  },
];

function Estrellas({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 fill-[#c9a84c]" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonios() {
  return (
    <section className="bg-white py-20 px-6 section-animate">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.35em] uppercase text-[#c9a84c] mb-3">
            Clientes reales
          </p>
          <h2 className="font-serif text-4xl font-medium text-[#0f0f0f]">
            Lo que dicen nuestras clientas
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonios.map((t) => (
            <div
              key={t.nombre}
              className="border border-[#e8e0d5] p-6 flex flex-col gap-4 hover:border-[#c9a84c] transition-colors"
            >
              <Estrellas n={t.estrellas} />
              <p className="text-[#3a3a3a] text-sm leading-relaxed flex-1">
                &ldquo;{t.texto}&rdquo;
              </p>
              <div className="pt-4 border-t border-[#e8e0d5] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#c9a84c] flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-semibold">{t.inicial}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0f0f0f]">{t.nombre}</p>
                  <p className="text-[10px] text-[#c9a84c] uppercase tracking-wide">
                    {t.ciudad} · {t.pieza}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rating summary */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 border border-[#e8e0d5] px-8 py-4">
            <Estrellas n={5} />
            <span className="text-sm font-semibold text-[#0f0f0f]">4.9 / 5</span>
            <span className="text-[#6b6b6b] text-xs">· Basado en más de 120 compras</span>
          </div>
        </div>
      </div>
    </section>
  );
}
