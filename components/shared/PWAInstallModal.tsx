"use client";

import { useEffect, useState } from "react";
import { X, Download, Smartphone, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as Record<string, unknown>).MSStream;
}

function isInStandaloneMode() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true;
}

export default function PWAInstallModal() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOS, setShowIOS] = useState(false);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) return;
    if (sessionStorage.getItem("pwa-dismissed")) return;

    if (isIOS()) {
      setTimeout(() => {
        setShowIOS(true);
        setVisible(true);
      }, 5000);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setVisible(true), 4000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!prompt) return;
    setInstalling(true);
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    } else {
      setInstalling(false);
    }
    setPrompt(null);
  }

  function handleDismiss() {
    setVisible(false);
    sessionStorage.setItem("pwa-dismissed", "1");
  }

  if (!visible || (!prompt && !showIOS)) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-100 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-sm w-full z-101 animate-fade-up">
        <div className="bg-[#0f0f0f] border-t sm:border border-[#c9a84c]/20 p-7 relative">

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-400 transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>

          {/* Logo + título */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#c9a84c]/30 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logoOficialpng.png" alt="Majestic Luxe Jewels" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-serif text-white font-semibold text-base leading-tight">
                Majestic Luxe Jewels
              </p>
              <p className="text-[#c9a84c] text-[10px] tracking-[0.2em] uppercase mt-0.5">
                {showIOS ? "Agregar al inicio" : "Instalar app gratuita"}
              </p>
            </div>
          </div>

          {/* ── iOS: paso a paso ── */}
          {showIOS ? (
            <>
              <p className="text-gray-400 text-xs leading-relaxed mb-5">
                Instala nuestra app en tu iPhone o iPad siguiendo estos pasos:
              </p>

              <div className="space-y-4 mb-6">
                {/* Paso 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center shrink-0 rounded-sm">
                    <span className="font-serif text-[#c9a84c] text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium mb-0.5">Toca el botón Compartir</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-gray-500 text-[11px]">Busca el ícono</p>
                      <div className="inline-flex items-center gap-1 bg-[#1c1c1c] border border-white/10 px-2 py-0.5 rounded">
                        <Share size={11} className="text-blue-400" />
                        <span className="text-[10px] text-gray-400">Compartir</span>
                      </div>
                      <p className="text-gray-500 text-[11px]">en Safari</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5 ml-10" />

                {/* Paso 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center shrink-0 rounded-sm">
                    <span className="font-serif text-[#c9a84c] text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium mb-0.5">Desplázate y toca</p>
                    <div className="inline-flex items-center gap-1.5 bg-[#1c1c1c] border border-white/10 px-2.5 py-1 rounded">
                      <span className="text-sm">➕</span>
                      <span className="text-[11px] text-gray-300 font-medium">Agregar a pantalla de inicio</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5 ml-10" />

                {/* Paso 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center shrink-0 rounded-sm">
                    <span className="font-serif text-[#c9a84c] text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium mb-0.5">Confirma tocando</p>
                    <div className="inline-flex items-center bg-[#1c1c1c] border border-white/10 px-2.5 py-1 rounded">
                      <span className="text-[11px] text-blue-400 font-semibold">Agregar</span>
                    </div>
                    <p className="text-gray-500 text-[11px] mt-1">
                      El ícono aparecerá en tu pantalla de inicio ✦
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="w-full flex items-center justify-center gap-2 py-3 text-xs text-gray-600 hover:text-gray-400 transition-colors border border-white/5"
              >
                <Smartphone size={13} />
                Continuar en el navegador
              </button>
            </>
          ) : (
            /* ── Android / Desktop: prompt nativo ── */
            <>
              <div className="space-y-2 mb-6">
                {[
                  "Acceso rápido desde tu pantalla de inicio",
                  "Navega el catálogo sin abrir el navegador",
                  "Experiencia fluida como una app nativa",
                ].map((b) => (
                  <div key={b} className="flex items-start gap-2">
                    <span className="text-[#c9a84c] mt-0.5 text-xs">✦</span>
                    <p className="text-gray-400 text-xs leading-relaxed">{b}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleInstall}
                  disabled={installing}
                  className="w-full flex items-center justify-center gap-2 bg-[#c9a84c] text-white py-3.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#9a7a2e] transition-colors disabled:opacity-60"
                >
                  {installing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Instalando...
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      Instalar app
                    </>
                  )}
                </button>
                <button
                  onClick={handleDismiss}
                  className="w-full flex items-center justify-center gap-2 py-3 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  <Smartphone size={13} />
                  Continuar en el navegador
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
