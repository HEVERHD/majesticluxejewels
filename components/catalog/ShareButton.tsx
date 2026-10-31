"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { haptic } from "@/lib/haptic";

interface Props {
  title: string;
  text?: string;
  url: string;
}

export default function ShareButton({ title, text, url }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    haptic(10);
    if (navigator.share) {
      try {
        await navigator.share({ title, text: text ?? title, url });
      } catch {
        // user cancelled — no-op
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <button
      onClick={handleShare}
      title="Compartir"
      className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#6b6b6b] hover:text-[#c9a84c] transition-colors border border-[#e8e0d5] px-3 py-2 hover:border-[#c9a84c]"
    >
      {copied ? (
        <>
          <Check size={14} className="text-green-500" />
          <span className="text-green-500">Copiado</span>
        </>
      ) : (
        <>
          <Share2 size={14} />
          Compartir
        </>
      )}
    </button>
  );
}
