/**
 * Caminho de um arquivo de public/ respeitando o subcaminho do GitHub Pages
 * (NEXT_PUBLIC_BASE_PATH). No Cloudflare Pages o prefixo é vazio.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const publicAsset = (path: string) => `${basePath}${path}`;
