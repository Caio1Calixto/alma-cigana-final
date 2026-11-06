import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // O preview roda em https://{porta}-{sandboxId}.e2b.app e o Next bloqueia
  // recursos de dev vindos de origens não listadas (retornava 403 "Unauthorized"
  // em /_next/static/*, deixando a página vazia/sem estilo no navegador).
  allowedDevOrigins: ["**.e2b.app", "localhost", "127.0.0.1"],
};

export default nextConfig;
