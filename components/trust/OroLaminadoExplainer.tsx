import { Layers, Zap, Heart, Award } from "lucide-react";

const items = [
  {
    icon: Layers,
    title: "¿Qué es el oro laminado?",
    desc: "Es una capa de oro de alta pureza (18k–24k) soldada por presión sobre una base de metal de calidad. A diferencia del chapado común, la capa es significativamente más gruesa y duradera.",
  },
  {
    icon: Zap,
    title: "Durabilidad real",
    desc: "Con cuidado adecuado, nuestras piezas mantienen su brillo por años. El proceso de laminado garantiza que el oro no se desprende ni descascarilla como el baño convencional.",
  },
  {
    icon: Heart,
    title: "Apto para piel sensible",
    desc: "Nuestra base de metal es hipoalergénica. Las personas con piel sensible pueden usarlas sin irritación, siempre que se evite el contacto prolongado con agua, perfumes y sudor.",
  },
  {
    icon: Award,
    title: "Precio accesible, look de lujo",
    desc: "Obtienes la misma estética del oro sólido a una fracción del precio. Ideal para quienes quieren verse elegantes sin comprometer su presupuesto.",
  },
];

export default function OroLaminadoExplainer() {
  return (
    <section className="bg-[#0f0f0f] py-20 px-6 section-animate">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.35em] uppercase text-[#c9a84c] mb-3">
            Transparencia total
          </p>
          <h2 className="font-serif text-4xl font-medium text-white mb-4">
            Todo sobre nuestro Oro Laminado
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto">
            Creemos en informarte antes de que compres. Aquí te explicamos exactamente qué
            recibes y por qué es una elección inteligente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-[#0f0f0f] p-8 hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="w-10 h-10 border border-[#c9a84c]/40 flex items-center justify-center mb-6">
                <item.icon size={18} className="text-[#c9a84c]" />
              </div>
              <h3 className="font-serif text-base font-medium text-white mb-3">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Diferenciador visual */}
        <div className="mt-12 border border-[#c9a84c]/20 p-8 grid grid-cols-3 divide-x divide-[#c9a84c]/20 text-center">
          {[
            { label: "Chapado convencional", value: "0.5 µm", sub: "Capa de oro" },
            { label: "Oro laminado Majestic", value: "≥ 2.5 µm", sub: "Capa de oro" },
            { label: "Oro sólido 18k", value: "100%", sub: "Composición" },
          ].map((col) => (
            <div key={col.label} className="px-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                {col.label}
              </p>
              <p className="font-serif text-3xl text-[#c9a84c] font-semibold">{col.value}</p>
              <p className="text-[10px] text-gray-500 mt-1">{col.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
