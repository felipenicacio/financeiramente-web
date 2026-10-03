/**
 * Cenas ilustradas (viewBox 320×200). Compostas com as formas de items.tsx,
 * sem rostos nem pessoas desenhadas: a criança se projeta na história pelo
 * texto, e a ilustração mostra os objetos da decisão.
 */

import { palette as p } from '@/theme/tokens';

import { itemShapes, type ItemKey } from './items';
import { star } from './itemsC1';

/**
 * Rótulos opcionais (ex.: valores em dinheiro) vindos do conteúdo. As cenas
 * nunca escrevem números próprios: quem chama passa os valores já formatados.
 */
export type SceneLabels = Partial<Record<string, string>>;

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

// ---------- C1 · M02: feira ----------

const Stall = ({ color }: { color: string }) => (
  <g>
    <rect x={40} y={92} width={240} height={70} rx={10} fill={p.amber100} />
    <rect x={40} y={152} width={240} height={14} rx={4} fill={p.amber700} />
    <path d="M46 92V48M274 92V48" stroke={p.slate} strokeWidth={5} />
    {[0, 1, 2, 3, 4, 5].map((index) => (
      <path
        key={index}
        d={`M${40 + index * 40} 34h40v22a20 20 0 0 1-40 0Z`}
        fill={index % 2 === 0 ? color : p.white}
        stroke={color}
        strokeWidth={2}
      />
    ))}
    <rect x={32} y={26} width={256} height={12} rx={6} fill={color} />
  </g>
);

const ModuleMarket: Shape = () => (
  <g>
    <circle cx={160} cy={100} r={84} fill={p.teal50} />
    {place('item-banknote', 52, 60, 86)}
    {place('item-pricetag', 130, 40, 70)}
    {place('item-coins', 196, 84, 80)}
    {place('item-apple', 132, 110, 60)}
  </g>
);

const StoryPocket: Shape = ({ labels }) => (
  <g>
    <circle cx={160} cy={96} r={84} fill={p.cyan50} />
    <Ground />
    <path d="M98 50h124v96a26 26 0 0 1-26 26h-72a26 26 0 0 1-26-26Z" fill={p.cyan500} />
    <path d="M98 76h124" stroke={p.cyan700} strokeWidth={4} />
    <path d="M104 76h112" stroke={p.slate300} strokeWidth={3} strokeDasharray="4 4" />
    <rect x={202} y={70} width={10} height={16} rx={3} fill={p.amber500} />
    <g transform="translate(118 30) rotate(-6)">
      <rect width={84} height={44} rx={6} fill={p.green100} stroke={p.green700} strokeWidth={2} />
      <text x={42} y={28} fontSize={16} fontWeight={700} fill={p.green700} textAnchor="middle">
        {labels.money}
      </text>
    </g>
  </g>
);

const StoryFruitStand: Shape = ({ labels }) => (
  <g>
    <Stall color={p.coral500} />
    {place('item-apple', 82, 82, 52)}
    {place('item-apple', 126, 78, 56)}
    {place('item-apple', 172, 82, 52)}
    <PriceTag x={214} y={112} label={labels.applePrice} color={p.coral500} />
  </g>
);

const StoryKiteStand: Shape = ({ labels }) => (
  <g>
    <Stall color={p.purple500} />
    {place('item-kite', 104, 52, 100)}
    <PriceTag x={214} y={112} label={labels.kitePrice} color={p.purple500} />
  </g>
);

const StoryTwoChoices: Shape = ({ labels }) => (
  <g>
    <circle cx={86} cy={84} r={60} fill={p.coral50} />
    <circle cx={234} cy={84} r={60} fill={p.purple50} />
    {place('item-apple', 50, 40, 72)}
    {place('item-kite', 198, 32, 76)}
    <PriceTag x={57} y={124} label={labels.applePrice} color={p.coral500} />
    <PriceTag x={205} y={124} label={labels.kitePrice} color={p.purple500} />
    <g transform="translate(118 160)">
      <rect width={84} height={32} rx={6} fill={p.green100} stroke={p.green700} strokeWidth={2} />
      <text x={42} y={21} fontSize={14} fontWeight={700} fill={p.green700} textAnchor="middle">
        {labels.money}
      </text>
    </g>
  </g>
);

// ---------- C1 · M03: anúncios ----------

const Bursts = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={star(0, 0, 18)} fill={p.amber500} />
    <path d={star(40, -20, 10)} fill={p.coral500} />
    <path d={star(-30, 30, 8)} fill={p.cyan500} />
  </g>
);

const Screen = ({ children, loud = false }: { children: React.ReactNode; loud?: boolean }) => (
  <g>
    <rect x={52} y={28} width={216} height={144} rx={16} fill={p.navy} />
    <rect x={62} y={38} width={196} height={124} rx={8} fill={loud ? p.purple100 : p.cyan50} />
    {children}
  </g>
);

const ModuleAds: Shape = () => (
  <g>
    <circle cx={160} cy={100} r={84} fill={p.purple50} />
    {place('item-tablet', 56, 50, 110)}
    {place('item-megaphone', 176, 56, 80)}
    <Bursts x={250} y={52} />
  </g>
);

const StoryAdTablet: Shape = () => (
  <g>
    <Screen>
      {place('item-robot', 120, 50, 80)}
      <rect x={62} y={142} width={196} height={20} fill={p.purple500} />
      <rect x={72} y={148} width={60} height={8} rx={4} fill={p.white} />
    </Screen>
    <Ground />
  </g>
);

const StoryAdLoud: Shape = () => (
  <g>
    <Screen loud>
      {place('item-robot', 120, 50, 80)}
      <Bursts x={96} y={66} />
      <Bursts x={232} y={128} />
      <path
        d="M210 60c8 0 14 6 14 14M210 46c16 0 28 12 28 28"
        stroke={p.coral500}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
    </Screen>
    <Ground />
  </g>
);

const StoryAdClaim: Shape = () => (
  <g>
    <Screen loud>
      {place('item-robot', 84, 58, 70)}
      <g transform="translate(168 58)">
        <path
          d="M0 0h70a10 10 0 0 1 10 10v34a10 10 0 0 1-10 10H22L6 70V54a10 10 0 0 1-6-10V10A10 10 0 0 1 0 0Z"
          fill={p.coral500}
        />
        <rect x={34} y={12} width={10} height={22} rx={5} fill={p.white} />
        <circle cx={39} cy={42} r={5} fill={p.white} />
      </g>
      <Bursts x={232} y={140} />
    </Screen>
    <Ground />
  </g>
);

const StoryThinking: Shape = () => (
  <g>
    <circle cx={160} cy={96} r={84} fill={p.cyan50} />
    <Ground />
    {place('item-robot', 70, 66, 90)}
    {place('item-magnifier', 168, 40, 100)}
    <circle cx={238} cy={154} r={6} fill={p.purple500} />
    <circle cx={258} cy={140} r={9} fill={p.purple500} opacity={0.6} />
  </g>
);

// ---------- C1 · M04: trabalho ----------

const House = ({ x, color, roof }: { x: number; color: string; roof: string }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={0} y={84} width={80} height={80} rx={4} fill={color} />
    <path d="M-6 88 40 52l46 36Z" fill={roof} />
    <rect x={28} y={124} width={24} height={40} rx={3} fill={p.white} opacity={0.85} />
    <rect x={10} y={98} width={18} height={16} rx={2} fill={p.white} opacity={0.7} />
    <rect x={52} y={98} width={18} height={16} rx={2} fill={p.white} opacity={0.7} />
  </g>
);

const ModuleWork: Shape = () => (
  <g>
    <circle cx={160} cy={100} r={84} fill={p.teal50} />
    {place('item-bread', 44, 86, 70)}
    {place('item-chalkboard', 118, 34, 84)}
    {place('item-stethoscope', 206, 82, 72)}
    {place('item-wallet', 132, 118, 56)}
  </g>
);

const StoryStreet: Shape = () => (
  <g>
    <rect x={0} y={164} width={320} height={36} fill={p.slate200} />
    <path d="M0 182h320" stroke={p.white} strokeWidth={4} strokeDasharray="18 14" />
    <House x={20} color={p.amber500} roof={p.coral500} />
    <House x={120} color={p.teal500} roof={p.teal700} />
    <House x={220} color={p.purple500} roof={p.purple700} />
    <circle cx={290} cy={30} r={18} fill={p.amber100} />
  </g>
);

const StoryBakery: Shape = () => (
  <g>
    <Stall color={p.amber500} />
    {place('item-bread', 70, 82, 64)}
    {place('item-bread', 132, 76, 70)}
    {place('item-cake', 200, 74, 66)}
  </g>
);

const StoryBus: Shape = () => (
  <g>
    <rect x={0} y={150} width={320} height={50} fill={p.slate200} />
    <path d="M0 176h320" stroke={p.white} strokeWidth={4} strokeDasharray="18 14" />
    {place('item-bus', 60, 30, 200)}
    <rect x={262} y={70} width={6} height={84} fill={p.slate} />
    <rect x={250} y={56} width={30} height={22} rx={4} fill={p.cyan500} />
  </g>
);

const StoryIncome: Shape = () => (
  <g>
    <circle cx={160} cy={96} r={84} fill={p.green50} />
    <Ground />
    {place('item-chalkboard', 30, 40, 64)}
    {place('item-bread', 30, 112, 56)}
    {place('item-stethoscope', 226, 40, 64)}
    {place('item-laptop', 226, 112, 60)}
    {place('item-wallet', 110, 56, 100)}
    <path
      d="M96 72l14 6M96 140l14-8M224 72l-14 6M224 140l-14-8"
      stroke={p.green500}
      strokeWidth={4}
      strokeLinecap="round"
    />
  </g>
);

const StoryFamilyChoice: Shape = ({ labels }) => (
  <g>
    <circle cx={86} cy={84} r={60} fill={p.purple50} />
    <circle cx={234} cy={84} r={60} fill={p.green50} />
    <g transform="translate(46 44)">
      <rect width={80} height={56} rx={8} fill={p.navy} />
      <rect x={8} y={8} width={64} height={40} rx={4} fill={p.purple100} />
      <path d="M32 18v20l16-10Z" fill={p.purple500} />
    </g>
    {place('item-apple', 192, 40, 50)}
    {place('item-icecream', 232, 40, 50)}
    <PriceTag x={57} y={124} label={labels.cinemaPrice} color={p.purple500} />
    <PriceTag x={205} y={124} label={labels.picnicPrice} color={p.green500} />
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
  'module-market': ModuleMarket,
  'story-pocket': StoryPocket,
  'story-fruit-stand': StoryFruitStand,
  'story-kite-stand': StoryKiteStand,
  'story-two-choices': StoryTwoChoices,
  'module-ads': ModuleAds,
  'story-ad-tablet': StoryAdTablet,
  'story-ad-loud': StoryAdLoud,
  'story-ad-claim': StoryAdClaim,
  'story-thinking': StoryThinking,
  'module-work': ModuleWork,
  'story-street': StoryStreet,
  'story-bakery': StoryBakery,
  'story-bus': StoryBus,
  'story-income': StoryIncome,
  'story-family-choice': StoryFamilyChoice,
} satisfies Record<string, Shape>;

export type SceneKey = keyof typeof sceneShapes;
