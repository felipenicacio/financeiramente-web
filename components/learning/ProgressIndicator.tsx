import { t } from '@/lib/content/ui';

/**
 * Trilha das etapas de um módulo (5 lições + fechamento). A etapa atual ganha
 * destaque e um rótulo; a progressão não depende só de cor (tamanho e texto).
 */
export function ProgressIndicator({ labels, current }: { labels: string[]; current: number }) {
  const total = labels.length;
  const label = labels[current] ?? labels[0] ?? '';
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <p className="text-caption font-medium text-ink-soft">
        <span className="sr-only">{t('stepProgress', { current: current + 1, total, label })}</span>
        <span aria-hidden>{label}</span>
      </p>
      <ol aria-hidden className="flex items-center gap-1.5">
        {labels.map((entry, position) => {
          const state = position < current ? 'done' : position === current ? 'current' : 'next';
          return (
            <li
              key={`${entry}-${position}`}
              className={
                'h-2 flex-1 rounded-full transition-colors duration-300 ' +
                (state === 'done'
                  ? 'bg-accent'
                  : state === 'current'
                    ? 'h-2.5 bg-accent-strong'
                    : 'bg-slate-200')
              }
            />
          );
        })}
      </ol>
    </div>
  );
}
