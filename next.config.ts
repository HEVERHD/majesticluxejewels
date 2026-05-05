import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Imágenes de Unsplash (usadas en el hero del home)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  // Turbopack: evita errores con módulos nativos de Node.js (Cloudinary SDK)
  turbopack: {
    resolveAlias: {
      "encoding": { browser: "./empty.ts" },
    },
  },
};

export default nextConfig;
