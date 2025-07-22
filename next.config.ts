import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removemos output: "export" para permitir rutas dinámicas
  // output: "export",

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
