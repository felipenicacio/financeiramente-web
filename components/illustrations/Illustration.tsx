import Image from 'next/image';

import { palette } from '@/theme/tokens';

import { itemShapes, type ItemKey } from './items';
import { sceneShapes, type SceneKey, type SceneLabels } from './scenes';

const rasterIllustrations = {
  'c1-m01-l01-p1': '/econominho/lessons/c1/m01/l01-p1.png',
  'c1-m01-l01-p2': '/econominho/lessons/c1/m01/l01-p2.png',
  'c1-m01-l01-p3': '/econominho/lessons/c1/m01/l01-p3.png',
  'c1-m01-l02-p1': '/econominho/lessons/c1/m01/l02-p1.png',
  'c1-m01-l02-p2': '/econominho/lessons/c1/m01/l02-p2.png',
  'c1-m01-l02-p3': '/econominho/lessons/c1/m01/l02-p3.png',
  'c1-m01-l03-p1': '/econominho/lessons/c1/m01/l03-p1.png',
  'c1-m01-l04-coin': '/econominho/lessons/c1/m01/l04-coin.png',
  'c1-m01-l04-banknote': '/econominho/lessons/c1/m01/l04-banknote.png',
  'c1-m01-l04-coins': '/econominho/lessons/c1/m01/l04-coins.png',
  'c1-m01-l05-main': '/econominho/lessons/c1/m01/l05-main.png',
  'c1-m01-l05-bread': '/econominho/lessons/c1/m01/l05-bread.png',
  'c1-m01-l05-haircut': '/econominho/lessons/c1/m01/l05-haircut.png',
  'c1-m01-l05-book': '/econominho/lessons/c1/m01/l05-book.png',
  'c1-m01-l05-repair': '/econominho/lessons/c1/m01/l05-repair.png',
  'c1-m02-l01-p1': '/econominho/lessons/c1/m02/l01-p1.png',
  'c1-m02-l01-p2': '/econominho/lessons/c1/m02/l01-p2.png',
  'c1-m02-l01-p3': '/econominho/lessons/c1/m02/l01-p3.png',
  'c1-m02-l02-p1': '/econominho/lessons/c1/m02/l02-p1.png',
  'c1-m02-l02-p2': '/econominho/lessons/c1/m02/l02-p2.png',
  'c1-m02-l02-p3': '/econominho/lessons/c1/m02/l02-p3.png',
  'c1-m02-l03-p1': '/econominho/lessons/c1/m02/l03-p1.png',
  'c1-m02-l03-p2': '/econominho/lessons/c1/m02/l03-p2.png',
  'c1-m02-l03-p3': '/econominho/lessons/c1/m02/l03-p3.png',
  'c1-m02-l04-p1': '/econominho/lessons/c1/m02/l04-p1.png',
  'c1-m02-l04-p2': '/econominho/lessons/c1/m02/l04-p2.png',
  'c1-m02-l04-p3': '/econominho/lessons/c1/m02/l04-p3.png',
  'c1-m02-l05-p1': '/econominho/lessons/c1/m02/l05-p1.png',
  'c1-m02-l05-p2': '/econominho/lessons/c1/m02/l05-p2.png',
  'c1-m02-l05-p3': '/econominho/lessons/c1/m02/l05-p3.png',
} as const;

type RasterKey = keyof typeof rasterIllustrations;

export type IllustrationName = ItemKey | SceneKey | RasterKey;

export const illustrationKeys = [
  ...Object.keys(itemShapes),
  ...Object.keys(sceneShapes),
  ...Object.keys(rasterIllustrations),
] as IllustrationName[];

function isRasterKey(name: string): name is RasterKey {
  return name in rasterIllustrations;
}

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
 * Ilustração do conteúdo: aceita cenas vetoriais inline e assets raster locais.
 * Nome desconhecido mostra uma forma neutra, para a tela nunca quebrar por um erro de digitação
 * no conteúdo (os testes acusam o nome inválido antes da publicação).
 */
export function Illustration({ name, alt, labels = {}, className }: Props) {
  const a11y = alt
    ? ({ role: 'img', 'aria-label': alt } as const)
    : ({ 'aria-hidden': true, focusable: false } as const);

  if (isRasterKey(name)) {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    return (
      <Image
        src={`${basePath}${rasterIllustrations[name]}`}
        alt={alt ?? ''}
        width={288}
        height={216}
        className={className}
        unoptimized
      />
    );
  }

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
