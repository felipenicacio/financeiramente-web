'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/**
 * Progresso da visita atual, somente em memória.
 *
 * Decisão de privacidade: nada é gravado no navegador (sem Web Storage,
 * cookies ou IndexedDB) e nada é enviado a servidor. Ao fechar ou recarregar a
 * página, o progresso volta a zero. Persistir no aparelho no futuro exige uma
 * decisão explícita e documentada (docs/architecture.md).
 */
type SessionState = {
  completedModules: ReadonlySet<string>;
  markModuleDone: (key: string) => void;
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<ReadonlySet<string>>(() => new Set());

  const markModuleDone = useCallback((key: string) => {
    setCompleted((current) => (current.has(key) ? current : new Set(current).add(key)));
  }, []);

  const value = useMemo(
    () => ({ completedModules: completed, markModuleDone }),
    [completed, markModuleDone],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession precisa estar dentro de <SessionProvider>');
  return context;
}

export const moduleKey = (cycle: string, moduleId: string) => `${cycle}/${moduleId}`;
