import type { ModuleBundle } from '@/lib/content/types';

/** Para onde ir depois do módulo, calculado no build a partir do catálogo. */
export type LessonNav = {
  nextModule: { id: string; title: string } | null;
  hasCycleSummary: boolean;
};

export type StepProps = { bundle: ModuleBundle; nav?: LessonNav };
