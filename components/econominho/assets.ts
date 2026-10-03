import type { GuideState } from '@/lib/content/types';
import { publicAsset } from '@/lib/asset';

/**
 * Ponto único de integração da arte do Econominho.
 *
 * Identidade e personagem APROVADOS (pacote econominho-assets-v1). Os arquivos
 * ficam em public/econominho/ e o manifesto público é public/econominho/assets.json.
 * Para trocar uma pose/expressão, basta alterar o caminho aqui.
 */
export type GuidePose = 'wave' | 'point' | 'think' | 'show' | 'celebrate-idea';
export type GuideExpression = 'curious' | 'surprised' | 'attentive' | 'calm' | 'happy';

/** Pose e expressão de referência para cada intenção de fala (docs/econominho-guide.md). */
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

/** Avatar do personagem (busto) por estado de fala. */
const avatarByState: Record<GuideState, string> = {
  ask: '/econominho/character/curioso.png',
  discover: '/econominho/character/surpreso.png',
  compare: '/econominho/character/atencao.png',
  consequence: '/econominho/character/explicando.png',
  summary: '/econominho/character/feliz.png',
  reflect: '/econominho/character/pensando.png',
};

export const econominhoAssets = {
  enabled: true,
  /** Caminho (com base path do deploy) da imagem por estado. */
  avatar(state: GuideState): string {
    return publicAsset(avatarByState[state]);
  },
  fullbody: () => publicAsset('/econominho/character/fullbody.png'),
  theme: (module: 'm01' | 'm02' | 'm03' | 'm04') =>
    publicAsset(`/econominho/themes/${{ m01: 'm01_escolhas', m02: 'm02_dinheiro_preco', m03: 'm03_publicidade', m04: 'm04_trabalho_renda' }[module]}.png`),
};
