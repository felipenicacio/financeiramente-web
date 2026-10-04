'use client';

import { useSyncExternalStore } from 'react';

/**
 * Semente da sessão atual (uma por carregamento da página), gerada só no
 * cliente — nunca em armazenamento persistente do navegador ou em
 * cookies, só em memória: um recarregamento ou uma aba nova sempre gera
 * uma semente nova; navegar entre lições dentro do mesmo carregamento
 * mantém a mesma.
 *
 * Por que `useSyncExternalStore` em vez de `useState` + `useEffect`: a
 * primeira renderização no cliente é a hidratação, que precisa produzir o
 * mesmo HTML que o build estático gerou. `useSyncExternalStore` foi feito
 * para exatamente este caso — usa `getServerSnapshot` (sempre vazio,
 * idêntico nos dois lados) durante o build e durante a própria
 * hidratação, e só passa a ler `getSnapshot` (a semente real) depois que
 * o cliente termina de hidratar, atualizando a tela nesse momento sem
 * divergir do HTML recebido.
 */
let cachedSeed: string | null = null;
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getSnapshot(): string {
  if (cachedSeed === null) {
    cachedSeed = Math.random().toString(36).slice(2);
  }
  return cachedSeed;
}

function getServerSnapshot(): string {
  return '';
}

export function useSessionSeed(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Só para testes: zera a semente em cache, simulando uma nova sessão. */
export function resetSessionSeedForTests(): void {
  cachedSeed = null;
}
