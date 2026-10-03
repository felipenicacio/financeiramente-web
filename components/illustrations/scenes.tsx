/**
 * Cenas ilustradas (viewBox 320×200). Compostas com as formas de items.tsx,
 * sem rostos nem pessoas desenhadas: a criança se projeta na história pelo
 * texto, e a ilustração mostra os objetos da decisão.
 */

import { palette as p } from '@/theme/tokens';

import { itemShapes, type ItemKey } from './items';

/**
 * Rótulos opcionais (ex.: valores em dinheiro) vindos do conteúdo. As cenas
 * nunca escrevem números próprios: quem chama passa os valores já formatados.
 */
export type SceneLabels = Partial<
  Record<'gift' | 'saved' | 'goalPrice' | 'temptationPrice', string>
>;

type Shape = (props: { labels: SceneLabels }) => React.ReactElement;

const place = (key: ItemKey, x: number, y: number, size: number) => {
  const Item = itemShapes[key];
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 120})`}>
      <Item />
    </g>
  );
};

const PriceTag = ({
  x,
  y,
  label,
  color,
}: {
  x: number;
  y: number;
  label?: string;
  color: string;
}) =>
  label ? (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x={0}
        y={0}
        width={58}
        height={26}
        rx={13}
        fill={p.white}
        stroke={color}
        strokeWidth={2.5}
      />
      <text x={29} y={18} fontSize={13} fontWeight={600} fill={p.navy} textAnchor="middle">
        {label}
      </text>
    </g>
  ) : null;

const Ground = ({ color = p.slate100 }: { color?: string }) => (
  <ellipse cx={160} cy={182} rx={140} ry={12} fill={color} />
);

const StoryGift: Shape = ({ labels }) => (
  <g>
    <circle cx={160} cy={96} r={84} fill={p.teal50} />
    <Ground />
    <rect x={110} y={84} width={100} height={88} rx={10} fill={p.teal500} />
    <rect x={100} y={64} width={120} height={28} rx={8} fill={p.teal700} />
    <rect x={150} y={64} width={20} height={108} fill={p.coral500} />
    <path
      d="M160 64c-18-26-44-14-30 0M160 64c18-26 44-14 30 0"
      stroke={p.coral500}
      strokeWidth={8}
      fill="none"
      strokeLinecap="round"
    />
    <g transform="translate(214 104) rotate(-8)">
      <rect
        x={0}
        y={0}
        width={70}
        height={40}
        rx={6}
        fill={p.green100}
        stroke={p.green700}
        strokeWidth={2}
      />
      <text x={35} y={26} fontSize={15} fontWeight={700} fill={p.green700} textAnchor="middle">
        {labels.gift}
      </text>
    </g>
  </g>
);

const StoryJar: Shape = ({ labels }) => (
  <g>
    <circle cx={160} cy={96} r={84} fill={p.amber50} />
    <Ground />
    {place('item-jar', 72, 50, 130)}
    {place('item-ball', 196, 92, 86)}
    <PriceTag x={80} y={24} label={labels.saved} color={p.teal500} />
    <PriceTag x={210} y={58} label={labels.goalPrice} color={p.cyan500} />
  </g>
);

const StoryShop: Shape = ({ labels }) => (
  <g>
    <rect
      x={40}
      y={40}
      width={240}
      height={140}
      rx={14}
      fill={p.white}
      stroke={p.slate200}
      strokeWidth={3}
    />
    {[0, 1, 2, 3, 4, 5].map((index) => (
      <path
        key={index}
        d={`M${40 + index * 40} 40h40v26a20 20 0 0 1-40 0Z`}
        fill={index % 2 === 0 ? p.coral500 : p.white}
        stroke={p.coral500}
        strokeWidth={2}
      />
    ))}
    <rect x={30} y={30} width={260} height={14} rx={7} fill={p.coral700} />
    {place('item-stickers', 70, 90, 80)}
    {place('item-car', 150, 104, 60)}
    {place('item-ball', 214, 106, 54)}
    <PriceTag x={80} y={160} label={labels.temptationPrice} color={p.coral500} />
  </g>
);

const StoryCrossroads: Shape = () => (
  <g>
    <path d="M160 196V130" stroke={p.slate200} strokeWidth={28} strokeLinecap="round" />
    <path
      d="M160 132C160 100 96 100 84 70"
      stroke={p.slate200}
      strokeWidth={24}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M160 132c0-32 64-32 76-62"
      stroke={p.slate200}
      strokeWidth={24}
      fill="none"
      strokeLinecap="round"
    />
    <circle cx={80} cy={50} r={42} fill={p.coral50} />
    <circle cx={240} cy={50} r={42} fill={p.cyan50} />
    {place('item-stickers', 50, 18, 62)}
    {place('item-ball', 211, 21, 58)}
    {place('item-jar', 136, 134, 48)}
  </g>
);

const ModuleThreeChoices: Shape = () => (
  <g>
    <circle cx={70} cy={104} r={50} fill={p.teal100} />
    <circle cx={160} cy={92} r={62} fill={p.coral100} />
    <circle cx={250} cy={104} r={50} fill={p.amber100} />
    {place('item-bottle', 40, 74, 60)}
    {place('item-robot', 120, 52, 80)}
    {place('item-sneaker', 220, 74, 60)}
  </g>
);

const HomeHero: Shape = () => (
  <g>
    <circle cx={250} cy={52} r={26} fill={p.amber100} />
    <path
      d="M40 196c30-40 90-28 110-62s70-36 96-70"
      stroke={p.teal100}
      strokeWidth={30}
      fill="none"
      strokeLinecap="round"
    />
    {[
      [64, 172, p.teal500],
      [112, 150, p.cyan500],
      [158, 122, p.amber500],
      [204, 98, p.coral500],
    ].map(([cx, cy, color], index) => (
      <ellipse
        key={index}
        cx={cx as number}
        cy={cy as number}
        rx={17}
        ry={9}
        fill={color as string}
      />
    ))}
    <path d="M244 80V26" stroke={p.navy} strokeWidth={4} strokeLinecap="round" />
    <path d="M246 28h30l-8 11 8 11h-30Z" fill={p.teal500} />
    <ellipse cx={244} cy={82} rx={14} ry={6} fill={p.slate200} />
    {place('item-jar', 18, 84, 62)}
  </g>
);

const DonePath: Shape = () => (
  <g>
    <circle cx={160} cy={100} r={86} fill={p.teal50} />
    <circle cx={160} cy={100} r={56} fill={p.teal500} />
    <path
      d="M134 100l18 18 36-38"
      stroke={p.white}
      strokeWidth={12}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx={66} cy={56} r={8} fill={p.coral500} />
    <circle cx={258} cy={70} r={6} fill={p.amber500} />
    <circle cx={250} cy={156} r={9} fill={p.cyan500} />
    <circle cx={74} cy={150} r={5} fill={p.purple500} />
  </g>
);

export const sceneShapes = {
  'home-hero': HomeHero,
  'module-three-choices': ModuleThreeChoices,
  'story-gift': StoryGift,
  'story-jar': StoryJar,
  'story-shop': StoryShop,
  'story-crossroads': StoryCrossroads,
  'done-path': DonePath,
} satisfies Record<string, Shape>;

export type SceneKey = keyof typeof sceneShapes;
