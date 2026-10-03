import { palette } from '@/theme/tokens';

import { itemShapes, type ItemKey } from './items';
import { sceneShapes, type SceneKey, type SceneLabels } from './scenes';

export type IllustrationName = ItemKey | SceneKey;

export const illustrationKeys = [
  ...Object.keys(itemShapes),
  ...Object.keys(sceneShapes),
] as IllustrationName[];

export function isSceneKey(name: string): name is SceneKey {
  return name in sceneShapes;
}

type Props = {
  /** Nome usado no conteúdo JSON (ex.: "item-coat", "story-gift"). */
  name: string;
  /** Descrição para leitores de tela. Sem `alt`, a imagem é decorativa. */
  alt?: string;
  labels?: SceneLabels;
  className?: string;
};

/**
 * Ilustração vetorial inline, sem requisição de rede. Nome desconhecido
 * mostra uma forma neutra, para a tela nunca quebrar por um erro de digitação
 * no conteúdo (os testes acusam o nome inválido antes da publicação).
 */
export function Illustration({ name, alt, labels = {}, className }: Props) {
  const a11y = alt
    ? ({ role: 'img', 'aria-label': alt } as const)
    : ({ 'aria-hidden': true, focusable: false } as const);

  if (isSceneKey(name)) {
    const Scene = sceneShapes[name];
    return (
      <svg viewBox="0 0 320 200" className={className} {...a11y}>
        <Scene labels={labels} />
      </svg>
    );
  }
  if (name in itemShapes) {
    const Item = itemShapes[name as ItemKey];
    return (
      <svg viewBox="0 0 120 120" className={className} {...a11y}>
        <Item />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 120" className={className} {...a11y}>
      <circle cx={60} cy={60} r={40} fill={palette.slate200} />
    </svg>
  );
}
