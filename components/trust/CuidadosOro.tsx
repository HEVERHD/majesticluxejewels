const cuidados = [
  {
    numero: "01",
    titulo: "Evita el agua",
    desc: "Retira tus joyas antes de bañarte, nadar o lavar. El cloro y el agua salada aceleran el desgaste del baño de oro.",
  },
  {
    numero: "02",
    titulo: "Perfume primero",
    desc: "Aplica tu perfume, crema o spray antes de ponerte las joyas. Los químicos degradan el laminado con el tiempo.",
  },
  {
    numero: "03",
    titulo: "Guárdalas separadas",
    desc: "Usa la caja o bolsita que incluye tu pedido. El contacto entre piezas produce rozaduras que dañan el acabado.",
  },
  {
    numero: "04",
    titulo: "Límpilas suavemente",
    desc: "Con un paño suave y seco después de cada uso. Evita productos abrasivos, cloro o alcohol.",
  },
  {
    numero: "05",
    titulo: "Evita el sudor excesivo",
    desc: "El sudor contiene sal y ácidos que deterioran el baño. Retíralas antes de hacer ejercicio.",
  },
  {
    numero: "06",
    titulo: "Sécalas bien",
    desc: "Si se mojan accidentalmente, sécalas de inmediato con un paño suave antes de guardarlas.",
  },
];

export default function CuidadosOro() {
  return (
    <section className="bg-white py-20 px-6 section-animate">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-[#c9a84c] mb-3">
              Cuida tu inversión
            </p>
            <h2 className="font-serif text-4xl font-medium text-[#0f0f0f] mb-6 leading-snug">
              Cómo mantener tu oro laminado como nuevo
            </h2>
            <p className="text-[#6b6b6b] text-sm leading-relaxed mb-8">
              Con los cuidados correctos, tus piezas pueden durar años brillantes y hermosas.
              Estos simples hábitos hacen toda la diferencia.
            </p>
            <div className="border border-[#c9a84c]/30 p-5 bg-[#f8f4ef]">
              <p className="text-xs text-[#6b6b6b] leading-relaxed">
                <span className="text-[#c9a84c] font-semibold">Dato clave:</span> El mayor
                enemigo del oro laminado no es el tiempo, sino la exposición a químicos.
                Con los cuidados correctos, la vida útil se multiplica por 5 o más.
              </p>
            </div>
          </div>

          {/* Right grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cuidados.map((c) => (
              <div key={c.numero} className="flex gap-4 p-5 border border-[#e8e0d5] hover:border-[#c9a84c] transition-colors">
                <span className="font-serif text-2xl text-[#e8e0d5] font-semibold shrink-0 leading-none mt-0.5">
                  {c.numero}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[#0f0f0f] mb-1">{c.titulo}</h3>
                  <p className="text-xs text-[#6b6b6b] leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
