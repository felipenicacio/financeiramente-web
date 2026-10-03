import { t } from '@/lib/content/ui';
import { lessonSteps } from '@/lib/learning/steps';
import type { LessonStepId } from '@/lib/content/types';

/**
 * Trilha de seis etapas. Etapas feitas ficam preenchidas, a atual ganha
 * destaque e um rótulo; a progressão não depende só de cor (tamanho e texto).
 */
export function ProgressIndicator({ current }: { current: LessonStepId }) {
  const index = lessonSteps.findIndex((step) => step.id === current);
  const step = lessonSteps[index] ?? lessonSteps[0];
  const total = lessonSteps.length;
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <p className="text-caption font-medium text-ink-soft">
        <span className="sr-only">
          {t('stepProgress', { current: index + 1, total, label: t(step.labelKey) })}
        </span>
        <span aria-hidden>{t(step.labelKey)}</span>
      </p>
      <ol aria-hidden className="flex items-center gap-1.5">
        {lessonSteps.map((entry, position) => {
          const state = position < index ? 'done' : position === index ? 'current' : 'next';
          return (
            <li
              key={entry.id}
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
