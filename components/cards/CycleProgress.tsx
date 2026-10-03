'use client';

import { t } from '@/lib/content/ui';
import { moduleKey, useSession } from '@/lib/session/SessionProvider';

/**
 * Quantos módulos foram concluídos nesta visita. Só informa: não bloqueia
 * nada, não guarda nada e some ao recarregar a página.
 */
export function CycleProgress({
  cycle,
  moduleIds,
  hint,
}: {
  cycle: string;
  moduleIds: string[];
  hint: string;
}) {
  const { completedModules } = useSession();
  const done = moduleIds.filter((id) => completedModules.has(moduleKey(cycle, id))).length;
  return (
    <p className="text-caption text-ink-muted">
      {done > 0 ? `${t('cycleProgress', { done, total: moduleIds.length })}. ` : ''}
      {hint}
    </p>
  );
}
