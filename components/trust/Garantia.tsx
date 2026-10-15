import { RefreshCw, Package, ShieldCheck } from "lucide-react";

const garantias = [
  {
    icon: ShieldCheck,
    titulo: "Garantía de calidad",
    subtitulo: "Por defectos de fabricación",
    desc: "Si tu pieza llega con algún defecto de fabricación, la reemplazamos sin costo. Solo contáctanos por WhatsApp con una foto en los primeros 7 días.",
  },
  {
    icon: RefreshCw,
    titulo: "Cambios y devoluciones",
    subtitulo: "Hasta 5 días después de recibir",
    desc: "Si la pieza no es lo que esperabas, puedes solicitar un cambio o nota de crédito dentro de los 5 días hábiles de recibido, siempre que esté sin uso.",
  },
  {
    icon: Package,
    titulo: "Empaque protegido",
    subtitulo: "Llegará en perfectas condiciones",
    desc: "Cada pedido se empaca con cuidado en una caja de joyería elegante. Ideal para regalo. El empaque incluye instrucciones de cuidado de la pieza.",
  },
];

export default function Garantia() {
  return (
    <section className="bg-[#f8f4ef] py-20 px-6 border-y border-[#e8e0d5] section-animate">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.35em] uppercase text-[#c9a84c] mb-3">
            Compra sin riesgo
          </p>
          <h2 className="font-serif text-4xl font-medium text-[#0f0f0f] mb-4">
            Nuestra Garantía
          </h2>
          <p className="text-[#6b6b6b] text-sm max-w-md mx-auto leading-relaxed">
            Queremos que compres con total tranquilidad. Por eso tenemos políticas claras
            pensadas para ti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {garantias.map((g) => (
            <div key={g.titulo} className="bg-white border border-[#e8e0d5] p-8">
              <div className="w-12 h-12 bg-[#f8f4ef] border border-[#e8e0d5] flex items-center justify-center mb-6">
                <g.icon size={20} className="text-[#c9a84c]" />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#c9a84c] mb-2">
                {g.subtitulo}
              </p>
              <h3 className="font-serif text-xl font-medium text-[#0f0f0f] mb-4">
                {g.titulo}
              </h3>
              <p className="text-[#6b6b6b] text-sm leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#6b6b6b] mt-8">
          ¿Tienes dudas sobre tu pedido?{" "}
          <a
            href="https://wa.me/18633482679?text=Hola, tengo una duda sobre mi pedido"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c9a84c] underline hover:text-[#9a7a2e] transition-colors"
          >
            Escríbenos por WhatsApp
          </a>{" "}
          y te respondemos en minutos.
        </p>
      </div>
    </section>
  );
}
