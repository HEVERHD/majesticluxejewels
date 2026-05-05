import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatea un precio en COP. Ej: 225000 → "$ 225.000" */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Convierte COP a USD y formatea. Ej: 225000 → "≈ USD 53" */
export function formatPriceUSD(priceCOP: number, copToUsdRate = 4200): string {
  const usd = priceCOP / copToUsdRate;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(usd);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildWhatsAppUrl(
  phone: string,
  productName: string,
  productUrl: string,
  message: string
) {
  const text = encodeURIComponent(
    `${message} *${productName}*\n${productUrl}`
  );
  return `https://wa.me/${phone}?text=${text}`;
}
