/**
 * Ilustrações de objetos (viewBox 120×120). Formas geométricas simples, sem
 * marcas reais, com a paleta do Design System.
 */

import { palette as p } from '@/theme/tokens';

type Shape = () => React.ReactElement;

const Toothbrush: Shape = () => (
  <g transform="rotate(-35 60 60)">
    <rect x={53} y={38} width={14} height={66} rx={7} fill={p.teal500} />
    <rect x={55} y={22} width={10} height={20} rx={3} fill={p.teal700} />
    <rect
      x={50}
      y={12}
      width={20}
      height={16}
      rx={4}
      fill={p.white}
      stroke={p.slate300}
      strokeWidth={2}
    />
    <path d="M54 12V6M60 12V5M66 12V6" stroke={p.cyan500} strokeWidth={3} strokeLinecap="round" />
  </g>
);

const Bottle: Shape = () => (
  <g>
    <rect x={47} y={10} width={26} height={12} rx={4} fill={p.navy} />
    <rect x={36} y={24} width={48} height={86} rx={16} fill={p.cyan100} />
    <path d="M36 60h48v34a16 16 0 0 1-16 16H52a16 16 0 0 1-16-16Z" fill={p.cyan500} />
    <rect x={44} y={34} width={6} height={20} rx={3} fill={p.white} opacity={0.8} />
  </g>
);

const Stickers: Shape = () => (
  <g>
    <g transform="rotate(-10 48 62)">
      <rect
        x={22}
        y={26}
        width={52}
        height={70}
        rx={8}
        fill={p.amber100}
        stroke={p.amber500}
        strokeWidth={3}
      />
      <circle cx={48} cy={56} r={13} fill={p.amber500} />
    </g>
    <g transform="rotate(8 74 58)">
      <rect
        x={48}
        y={22}
        width={52}
        height={70}
        rx={8}
        fill={p.coral100}
        stroke={p.coral500}
        strokeWidth={3}
      />
      <path
        d="m74 40 4.4 9 9.9 1.4-7.2 7 1.7 9.9-8.8-4.7-8.8 4.7 1.7-9.9-7.2-7 9.9-1.4Z"
        fill={p.coral500}
      />
    </g>
  </g>
);

const Robot: Shape = () => (
  <g>
    <path d="M60 14v12" stroke={p.purple700} strokeWidth={4} strokeLinecap="round" />
    <circle cx={60} cy={12} r={6} fill={p.coral500} />
    <rect x={32} y={26} width={56} height={40} rx={14} fill={p.purple500} />
    <circle cx={48} cy={46} r={7} fill={p.white} />
    <circle cx={72} cy={46} r={7} fill={p.white} />
    <circle cx={49} cy={47} r={3} fill={p.navy} />
    <circle cx={73} cy={47} r={3} fill={p.navy} />
    <rect x={38} y={70} width={44} height={36} rx={10} fill={p.purple100} />
    <rect x={50} y={80} width={20} height={12} rx={4} fill={p.cyan500} />
    <rect x={22} y={74} width={12} height={26} rx={6} fill={p.purple500} />
    <rect x={86} y={74} width={12} height={26} rx={6} fill={p.purple500} />
  </g>
);

const Sneaker: Shape = () => (
  <g>
    <path
      d="M14 82V52c0-4 3-7 7-7h18l8 12c4 6 10 9 17 10l26 4c9 1.4 16 7 16 15v4H14Z"
      fill={p.coral500}
    />
    <path
      d="M14 86h92v8a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6Z"
      fill={p.white}
      stroke={p.slate300}
      strokeWidth={2}
    />
    <path
      d="M44 58l8-4M50 66l8-4M57 72l7-4"
      stroke={p.white}
      strokeWidth={3.5}
      strokeLinecap="round"
    />
    <rect x={18} y={50} width={14} height={8} rx={4} fill={p.coral700} />
  </g>
);

const ballColors = [p.teal500, p.white, p.coral500, p.white, p.amber500, p.white];

/** Bola de praia: seis gomos alternados, calculados a partir do centro. */
const Ball: Shape = () => (
  <g>
    {ballColors.map((color, index) => {
      const start = (index * Math.PI) / 3 - Math.PI / 2;
      const end = start + Math.PI / 3;
      const x1 = 60 + 44 * Math.cos(start);
      const y1 = 60 + 44 * Math.sin(start);
      const x2 = 60 + 44 * Math.cos(end);
      const y2 = 60 + 44 * Math.sin(end);
      return <path key={index} d={`M60 60L${x1} ${y1}A44 44 0 0 1 ${x2} ${y2}Z`} fill={color} />;
    })}
    <circle cx={60} cy={60} r={44} fill="none" stroke={p.slate300} strokeWidth={3} />
    <circle cx={60} cy={60} r={8} fill={p.white} stroke={p.slate300} strokeWidth={2} />
    <ellipse
      cx={42}
      cy={36}
      rx={9}
      ry={5}
      fill={p.white}
      opacity={0.55}
      transform="rotate(-30 42 36)"
    />
  </g>
);

const Coat: Shape = () => (
  <g>
    <path
      d="M44 16h32l22 14 8 40-14 4-4-22v54H32V52l-4 22-14-4 8-40Z"
      fill={p.amber500}
      strokeLinejoin="round"
    />
    <path d="M60 22v84" stroke={p.amber700} strokeWidth={3} />
    <path d="M44 16l16 18 16-18" fill={p.amber100} />
    <circle cx={66} cy={56} r={3} fill={p.amber700} />
    <circle cx={66} cy={74} r={3} fill={p.amber700} />
    <circle cx={66} cy={92} r={3} fill={p.amber700} />
  </g>
);

const Pencils: Shape = () => (
  <g>
    {[p.teal500, p.coral500, p.amber500, p.purple500].map((color, index) => (
      <g key={color}>
        <rect x={30 + index * 16} y={24} width={12} height={58} fill={color} />
        <path d={`M${30 + index * 16} 24 l6 -12 l6 12Z`} fill={p.amber100} />
        <path d={`M${34 + index * 16} 16 l2 -4 l2 4Z`} fill={color} />
      </g>
    ))}
    <rect x={20} y={64} width={80} height={44} rx={8} fill={p.cyan500} />
    <rect x={30} y={78} width={60} height={14} rx={4} fill={p.white} opacity={0.85} />
  </g>
);

const IceCream: Shape = () => (
  <g>
    <path d="M38 58h44l-22 54Z" fill={p.amber500} />
    <path d="M46 66l24 24M74 66 52 92" stroke={p.amber700} strokeWidth={2.5} opacity={0.5} />
    <circle cx={48} cy={50} r={16} fill={p.coral500} />
    <circle cx={72} cy={50} r={16} fill={p.white} stroke={p.slate300} strokeWidth={2} />
    <circle cx={60} cy={32} r={16} fill={p.coral100} />
    <circle cx={60} cy={14} r={5} fill={p.coral700} />
  </g>
);

const Car: Shape = () => (
  <g>
    <path d="M30 54l10-18h36l14 18Z" fill={p.cyan100} />
    <rect x={12} y={52} width={96} height={30} rx={12} fill={p.cyan500} />
    <rect x={40} y={40} width={16} height={12} rx={2} fill={p.white} opacity={0.85} />
    <rect x={60} y={40} width={16} height={12} rx={2} fill={p.white} opacity={0.85} />
    <circle cx={36} cy={84} r={12} fill={p.navy} />
    <circle cx={84} cy={84} r={12} fill={p.navy} />
    <circle cx={36} cy={84} r={4} fill={p.slate300} />
    <circle cx={84} cy={84} r={4} fill={p.slate300} />
    <rect x={98} y={60} width={8} height={6} rx={3} fill={p.amber500} />
  </g>
);

const Jar: Shape = () => (
  <g>
    <rect x={38} y={12} width={44} height={12} rx={4} fill={p.teal700} />
    <rect
      x={28}
      y={24}
      width={64}
      height={86}
      rx={20}
      fill={p.teal50}
      stroke={p.teal500}
      strokeWidth={3}
    />
    <ellipse cx={60} cy={96} rx={22} ry={7} fill={p.amber500} />
    <ellipse
      cx={60}
      cy={88}
      rx={22}
      ry={7}
      fill={p.amber500}
      stroke={p.amber700}
      strokeWidth={1.5}
    />
    <ellipse
      cx={60}
      cy={80}
      rx={22}
      ry={7}
      fill={p.amber500}
      stroke={p.amber700}
      strokeWidth={1.5}
    />
    <circle cx={60} cy={56} r={10} fill={p.amber500} stroke={p.amber700} strokeWidth={1.5} />
    <rect x={36} y={32} width={6} height={30} rx={3} fill={p.white} opacity={0.8} />
  </g>
);

/** Formas desenhadas em uma grade de 120×120, reutilizadas nas cenas. */
export const itemShapes = {
  'item-toothbrush': Toothbrush,
  'item-bottle': Bottle,
  'item-stickers': Stickers,
  'item-robot': Robot,
  'item-sneaker': Sneaker,
  'item-ball': Ball,
  'item-coat': Coat,
  'item-pencils': Pencils,
  'item-icecream': IceCream,
  'item-car': Car,
  'item-jar': Jar,
} satisfies Record<string, Shape>;

export type ItemKey = keyof typeof itemShapes;
