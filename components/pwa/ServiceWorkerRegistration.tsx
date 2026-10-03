'use client';

import { useEffect, useState } from 'react';

import { t } from '@/lib/content/ui';

/**
 * Registra o service worker (public/sw.js) em produção.
 * Compatível tanto com raiz de domínio (Cloudflare Pages) quanto com
 * subcaminho do GitHub Pages via NEXT_PUBLIC_BASE_PATH.
 */
export function ServiceWorkerRegistration() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    const workerUrl = `${basePath}/sw.js`;
    const scope = `${basePath || ''}/`;

    let reloading = false;
    const onControllerChange = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };

    navigator.serviceWorker
      .register(workerUrl, { scope, updateViaCache: 'none' })
      .then((registration) => {
        const track = (worker: ServiceWorker | null) => {
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaiting(worker);
            }
          });
        };
        if (registration.waiting && navigator.serviceWorker.controller) {
          setWaiting(registration.waiting);
        }
        registration.addEventListener('updatefound', () => track(registration.installing));
        navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
      })
      .catch(() => {
        // Sem service worker o site continua funcionando normalmente online.
      });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  if (!waiting) return null;

  return (
    <div
      role="status"
      className="animate-enter fixed inset-x-4 top-4 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-card bg-ink px-5 py-3 text-white shadow-raised"
    >
      <span className="text-label">{t('updateAvailable')}</span>
      <button
        type="button"
        onClick={() => waiting.postMessage({ type: 'SKIP_WAITING' })}
        className="min-h-11 rounded-full bg-white px-4 text-label font-semibold text-ink"
      >
        {t('updateCta')}
      </button>
    </div>
  );
}
