/**
 * Endereço público usado em links absolutos (Open Graph, sitemap, robots).
 * Padrão: domínio do Cloudflare Pages. Para domínio próprio, definir
 * NEXT_PUBLIC_SITE_URL no build (opcional; nenhuma outra variável existe).
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://financeiramente-web.pages.dev'
).replace(/\/$/, '');
