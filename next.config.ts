import type { NextConfig } from 'next';

/**
 * Site 100% estático: `next build` gera a pasta `out/`, publicada no
 * Cloudflare Pages sem runtime de servidor. Qualquer recurso que exija
 * servidor (route handlers dinâmicos, cookies, server actions, rewrites)
 * falha no build, o que é intencional.
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
