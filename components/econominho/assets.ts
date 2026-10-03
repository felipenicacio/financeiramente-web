import type { GuideState } from '@/lib/content/types';
import { publicAsset } from '@/lib/asset';

/**
 * Ponto único de integração da arte oficial do Econominho.
 *
 * Os PNGs v2 foram gerados individualmente e aprovados, sem recortes de
 * folhas de personagem. Para trocar uma pose/expressão, altere somente
 * este mapeamento e o manifesto public/econominho/assets.json.
 */
export type GuidePose = 'wave' | 'point' | 'think' | 'show' | 'celebrate-idea';
export type GuideExpression = 'curious' | 'surprised' | 'attentive' | 'calm' | 'happy';

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

const avatarByState: Record<GuideState, string> = {
  ask: '/econominho/character/pensando-v2.png',
  discover: '/econominho/character/descoberta-v2.png',
  compare: '/econominho/character/comparando-v2.png',
  consequence: '/econominho/character/explicando-v2.png',
  summary: '/econominho/character/feliz-v2.png',
  reflect: '/econominho/character/pensando-v2.png',
};

const themeByKey = {
  m01: '/econominho/character/comparando-v2.png',
  m02: '/econominho/character/explicando-v2.png',
  m03: '/econominho/character/descoberta-v2.png',
  m04: '/econominho/character/lendo-v2.png',
} as const;

export const econominhoAssets = {
  enabled: true,
  avatar(state: GuideState): string {
    return publicAsset(avatarByState[state]);
  },
  fullbody: () => publicAsset('/econominho/character/fullbody-v2.png'),
  theme: (module: keyof typeof themeByKey) => publicAsset(themeByKey[module]),
};
