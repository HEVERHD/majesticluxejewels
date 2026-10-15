import { Lock } from "lucide-react";

function LogoVisa() {
  return (
    <svg viewBox="0 0 780 500" className="h-6 w-auto" aria-label="Visa">
      <rect width="780" height="500" rx="40" fill="#1A1F71" />
      <text
        x="390"
        y="340"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontStyle="italic"
        fontSize="260"
        fill="white"
        letterSpacing="-10"
      >
        VISA
      </text>
    </svg>
  );
}

function LogoMastercard() {
  return (
    <svg viewBox="0 0 152 108" className="h-6 w-auto" aria-label="Mastercard">
      <rect width="152" height="108" rx="8" fill="white" />
      <circle cx="58" cy="54" r="33" fill="#EB001B" />
      <circle cx="94" cy="54" r="33" fill="#F79E1B" />
      <path
        d="M76 26.3a33 33 0 0 1 0 55.4A33 33 0 0 1 76 26.3z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function LogoNequi() {
  return (
    <svg viewBox="0 0 200 80" className="h-6 w-auto" aria-label="Nequi">
      <rect width="200" height="80" rx="12" fill="#6A0DAD" />
      <text
        x="100"
        y="54"
        textAnchor="middle"
        fontFamily="Arial Rounded MT Bold, Arial, sans-serif"
        fontWeight="700"
        fontSize="40"
        fill="white"
      >
        nequi
      </text>
    </svg>
  );
}

function LogoBancolombia() {
  return (
    <svg viewBox="0 0 240 80" className="h-6 w-auto" aria-label="Bancolombia">
      <rect width="240" height="80" rx="12" fill="#FFCD00" />
      <text
        x="120"
        y="52"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="26"
        fill="#1a1a1a"
      >
        Bancolombia
      </text>
    </svg>
  );
}

function LogoPSE() {
  return (
    <svg viewBox="0 0 140 80" className="h-6 w-auto" aria-label="PSE">
      <rect width="140" height="80" rx="12" fill="#003DA5" />
      <text
        x="70"
        y="54"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="40"
        fill="white"
      >
        PSE
      </text>
    </svg>
  );
}

function LogoWompi() {
  return (
    <svg viewBox="0 0 200 80" className="h-6 w-auto" aria-label="Wompi">
      <rect width="200" height="80" rx="12" fill="#00C08B" />
      <text
        x="100"
        y="53"
        textAnchor="middle"
        fontFamily="Arial Rounded MT Bold, Arial, sans-serif"
        fontWeight="700"
        fontSize="36"
        fill="white"
      >
        wompi
      </text>
    </svg>
  );
}

const metodos = [
  { nombre: "Nequi",       Logo: LogoNequi },
  { nombre: "Bancolombia", Logo: LogoBancolombia },
  { nombre: "PSE",         Logo: LogoPSE },
  { nombre: "Visa",        Logo: LogoVisa },
  { nombre: "Mastercard",  Logo: LogoMastercard },
  { nombre: "Wompi",       Logo: LogoWompi },
];

export default function MetodosPago() {
  return (
    <section className="bg-[#f8f4ef] py-14 px-6 border-t border-[#e8e0d5]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Seguridad */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-[#0f0f0f] flex items-center justify-center">
              <Lock size={16} className="text-[#c9a84c]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0f0f0f]">Pago 100% seguro</p>
              <p className="text-xs text-[#6b6b6b]">Procesado por Wompi · Encriptación SSL</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-10 bg-[#e8e0d5]" />

          {/* Logos */}
          <div className="flex flex-wrap gap-3 justify-center items-center">
            {metodos.map(({ nombre, Logo }) => (
              <div
                key={nombre}
                className="h-9 flex items-center px-1 bg-white border border-[#e8e0d5] rounded-sm overflow-hidden"
                title={nombre}
              >
                <Logo />
              </div>
            ))}
          </div>

          {/* Contra entrega */}
          <div className="flex items-center gap-2 border border-[#c9a84c]/40 bg-white px-4 py-2 shrink-0 rounded-sm">
            <span className="text-base">📦</span>
            <span className="text-xs font-medium text-[#0f0f0f]">Contra entrega</span>
          </div>
        </div>
      </div>
    </section>
  );
}
