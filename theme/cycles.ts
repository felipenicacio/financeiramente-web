import type { CycleId } from '@/lib/content/types';

/**
 * Uma marca, quatro expressões. A identidade amadurece com a faixa etária
 * sem trocar de Design System: muda o acento, a escala de texto, o
 * arredondamento e a quantidade de apoio visual. Os valores numéricos são
 * aplicados como variáveis CSS em `[data-cycle]` (styles/globals.css).
 *
 * C1 6–8   Descoberta        mais visual, acolhedor, texto maior
 * C2 9–11  Escolhas          mais autonomia, ainda lúdico
 * C3 12–14 Autonomia inicial contemporâneo, menos arredondado
 * C4 15–17 Vida econômica    sóbrio, sem aparência infantil
 */
export type CycleExpression = {
  /** Nome da cor de acento no CSS (`--color-<accent>-500/700/50`). */
  accent: 'teal' | 'cyan' | 'purple' | 'slate';
  illustrationDensity: 'high' | 'medium' | 'low';
};

export const cycleExpressions: Record<CycleId, CycleExpression> = {
  c1: { accent: 'teal', illustrationDensity: 'high' },
  c2: { accent: 'cyan', illustrationDensity: 'high' },
  c3: { accent: 'purple', illustrationDensity: 'medium' },
  c4: { accent: 'slate', illustrationDensity: 'low' },
};
