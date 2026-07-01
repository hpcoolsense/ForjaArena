import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Sin basePath: el sitio se sirve en la raíz del dominio (forjaarena.com) vía Vercel.
  // (En GitHub Pages vivía bajo /ForjaArena/, por eso antes se usaba basePath.)
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
