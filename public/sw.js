/*
 * Service worker do Financeiramente.
 *
 * Objetivo: abrir rápido e funcionar sem conexão nas páginas já visitadas,
 * sem nunca prender o visitante numa versão antiga do conteúdo.
 *
 * - Páginas (HTML e payloads de navegação do Next): REDE PRIMEIRO. O cache
 *   só responde quando não há conexão.
 * - /_next/static/*: CACHE PRIMEIRO. Os nomes têm hash do conteúdo, então um
 *   deploy novo gera arquivos novos e nunca reaproveita um antigo por engano.
 * - Fontes, ícones e imagens de public/: atualiza em segundo plano
 *   (stale-while-revalidate).
 * - Nada de terceiros é interceptado; nenhuma resposta é enviada a lugar algum.
 *
 * Ao publicar mudança NESTE arquivo, incrementar VERSION: o worker antigo
 * apaga os caches de versões anteriores na ativação.
 */
const VERSION = 'v1';
const PAGES = `fm-pages-${VERSION}`;
const STATIC = `fm-static-${VERSION}`;
const ASSETS = `fm-assets-${VERSION}`;
const KEEP = [PAGES, STATIC, ASSETS];
const MAX_ENTRIES = { [PAGES]: 60, [STATIC]: 150, [ASSETS]: 40 };
const PRECACHE = ['/', '/idade/', '/manifest.webmanifest', '/icons/icon-192.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => undefined),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => !KEEP.includes(key)).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

// A página pede a troca quando a pessoa toca em "Atualizar".
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

async function trim(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const excess = keys.length - MAX_ENTRIES[cacheName];
  for (let index = 0; index < excess; index += 1) await cache.delete(keys[index]);
}

async function networkFirst(request) {
  const cache = await caches.open(PAGES);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone()).then(() => trim(PAGES));
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request, { ignoreVary: true });
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const home = await cache.match('/');
      if (home) return home;
    }
    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone()).then(() => trim(STATIC));
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(ASSETS);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone()).then(() => trim(ASSETS));
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/sw.js') return;

  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (/\.(png|svg|ico|woff2|webmanifest)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  // HTML e payloads de navegação (.txt / ?_rsc) da exportação estática.
  event.respondWith(networkFirst(request));
});
