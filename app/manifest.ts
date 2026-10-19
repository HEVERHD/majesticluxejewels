import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Majestic Luxe Jewels",
    short_name: "Majestic Luxe",
    description: "Joyas en oro laminado de alta calidad. Piezas únicas con el brillo del oro auténtico.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f0f",
    theme_color: "#c9a84c",
    orientation: "portrait",
    categories: ["shopping", "lifestyle"],
    icons: [
      {
        src: "/logoOficialpng.png",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/logoOficialpng.png",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Ver Catálogo",
        url: "/catalogo",
        description: "Explorar todas las joyas",
      },
      {
        name: "Mi Carrito",
        url: "/checkout",
        description: "Ir al carrito de compras",
      },
    ],
  };
}
