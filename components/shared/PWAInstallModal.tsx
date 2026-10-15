"use client";

import { useEffect, useState } from "react";
import { X, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallModal() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // No mostrar si ya está instalada
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // No mostrar si el usuario ya la descartó esta sesión
    if (sessionStorage.getItem("pwa-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      // Mostrar el modal 4 segundos después de que el usuario llegue
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

  if (!visible || !prompt) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal — sube desde abajo en móvil, centrado en desktop */}
      <div className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-sm w-full z-[101] animate-fade-up">
        <div className="bg-[#0f0f0f] border-t sm:border border-[#c9a84c]/20 p-7">
          {/* Close */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-400 transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>

          {/* Logo + icono */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#c9a84c]/30 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logoOficial.jpeg"
                alt="Majestic Luxe Jewels"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-serif text-white font-semibold text-base leading-tight">
                Majestic Luxe Jewels
              </p>
              <p className="text-[#c9a84c] text-[10px] tracking-[0.2em] uppercase mt-0.5">
                Instalar app gratuita
              </p>
            </div>
          </div>

          {/* Beneficios */}
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

          {/* Botones */}
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
        </div>
      </div>
    </>
  );
}
