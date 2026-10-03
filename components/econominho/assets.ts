import type { GuideState } from '@/lib/content/types';

/**
 * Ponto único de integração da arte do Econominho.
 *
 * VISUAL DO PERSONAGEM — PENDENTE DE APROVAÇÃO.
 * Enquanto a identidade visual não for aprovada, nenhum asset é registrado e
 * o guia usa um marcador neutro. Quando a arte chegar, registrar aqui um
 * arquivo por pose/expressão (ex.: public/econominho/ask.svg) e ativar
 * `enabled`. Nenhum componente precisa mudar.
 */
export type GuidePose = 'wave' | 'point' | 'think' | 'show' | 'celebrate-idea';
export type GuideExpression = 'curious' | 'surprised' | 'attentive' | 'calm' | 'happy';

/** Pose e expressão sugeridas para cada intenção de fala (docs/econominho-guide.md). */
export const guideStatePresentation: Record<
  GuideState,
  { pose: GuidePose; expression: GuideExpression }
> = {
  ask: { pose: 'think', expression: 'curious' },
  discover: { pose: 'show', expression: 'surprised' },
  compare: { pose: 'point', expression: 'attentive' },
  consequence: { pose: 'point', expression: 'attentive' },
  summary: { pose: 'celebrate-idea', expression: 'happy' },
  reflect: { pose: 'think', expression: 'calm' },
};

export const econominhoAssets: {
  enabled: boolean;
  /** Caminho da imagem por estado, quando houver arte aprovada. */
  avatar: Partial<Record<GuideState, string>>;
} = {
  enabled: false,
  avatar: {},
};
