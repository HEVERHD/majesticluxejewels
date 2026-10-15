"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const preguntas = [
  {
    pregunta: "¿El oro laminado se pone negro o verde?",
    respuesta:
      "No, si se cuida correctamente. A diferencia del chapado convencional, el oro laminado tiene una capa mucho más gruesa. La decoloración ocurre cuando se expone a químicos (cloro, perfumes, sudor ácido) de forma frecuente. Con los cuidados básicos que te explicamos, tu pieza se mantiene brillante por años.",
  },
  {
    pregunta: "¿Cuánto dura el baño de oro?",
    respuesta:
      "Con uso cotidiano y cuidados adecuados, las piezas mantienen su apariencia entre 1 y 3 años o más. La durabilidad depende directamente de cuánto se expone la pieza a agua, sudor y químicos. Clientes que siguen nuestras instrucciones de cuidado reportan piezas en perfecto estado después de 2+ años.",
  },
  {
    pregunta: "¿Es apto para pieles sensibles o alérgicas?",
    respuesta:
      "Sí. Nuestra base metálica es hipoalergénica. La mayoría de reacciones a joyas son causadas por el níquel; nuestras piezas no contienen níquel en la base. Sin embargo, si tienes sensibilidad extrema, te recomendamos empezar con un uso breve y observar tu piel.",
  },
  {
    pregunta: "¿Cuánto tarda el envío a Colombia?",
    respuesta:
      "El tiempo de entrega es de 2 a 5 días hábiles dependiendo de tu ciudad. Los pedidos a Bogotá, Medellín, Cali, Barranquilla y Bucaramanga suelen llegar en 2-3 días. Ciudades intermedias pueden tomar hasta 5 días. Te enviamos el número de guía para rastrear tu paquete.",
  },
  {
    pregunta: "¿Qué pasa si mi pedido llega dañado?",
    respuesta:
      "Nos comunicamos por WhatsApp con una foto del producto y el empaque en las primeras 24 horas de recibido. Lo reemplazamos sin costo adicional ni preguntas. Tu satisfacción es nuestra prioridad.",
  },
  {
    pregunta: "¿Puedo pagar contra entrega?",
    respuesta:
      "Sí, ofrecemos pago contra entrega en todo Colombia. También puedes pagar en línea con Nequi, PSE, Bancolombia, tarjetas débito/crédito o Wompi. Elige la opción que más te convenga al finalizar tu compra.",
  },
  {
    pregunta: "¿Hacen joyas personalizadas?",
    respuesta:
      "Sí. Puedes contactarnos por WhatsApp para consultar sobre piezas personalizadas: grabados, tamaños especiales o diseños únicos. Evaluamos cada solicitud y te damos un presupuesto sin compromiso.",
  },
];

function Item({ pregunta, respuesta }: { pregunta: string; respuesta: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e8e0d5] last:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="text-sm font-medium text-[#0f0f0f] group-hover:text-[#c9a84c] transition-colors">
          {pregunta}
        </span>
        <span className="shrink-0 text-[#c9a84c]">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      {open && (
        <p className="text-sm text-[#6b6b6b] leading-relaxed pb-5">{respuesta}</p>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="bg-[#f8f4ef] py-20 px-6 section-animate">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.35em] uppercase text-[#c9a84c] mb-3">
            Resolvemos tus dudas
          </p>
          <h2 className="font-serif text-4xl font-medium text-[#0f0f0f]">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="bg-white border border-[#e8e0d5] px-8">
          {preguntas.map((p) => (
            <Item key={p.pregunta} pregunta={p.pregunta} respuesta={p.respuesta} />
          ))}
        </div>

        <p className="text-center text-xs text-[#6b6b6b] mt-8">
          ¿No encontraste tu respuesta?{" "}
          <a
            href="https://wa.me/18633482679?text=Hola, tengo una pregunta"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c9a84c] underline hover:text-[#9a7a2e] transition-colors"
          >
            Pregúntanos por WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}
