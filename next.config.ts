import type { NextConfig } from 'next';

/**
 * Site 100% estático: `next build` gera a pasta `out/`.
 *
 * Cloudflare Pages / domínio próprio:
 * - sem basePath por padrão.
 *
 * GitHub Pages:
 * - o workflow define GITHUB_PAGES=true e NEXT_PUBLIC_BASE_PATH=/financeiramente-web;
 * - o site é publicado em https://felipenicacio.github.io/financeiramente-web/.
 */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGitHubPages ? (process.env.NEXT_PUBLIC_BASE_PATH ?? '/financeiramente-web') : '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
