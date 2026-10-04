/**
 * Ilustrações de objetos dos módulos M02–M04 (viewBox 120×120).
 * Mesmas regras de items.tsx: formas simples, sem marcas, sem pessoas,
 * sem números ou textos fixos.
 */

import { palette as p } from '@/theme/tokens';

type Shape = () => React.ReactElement;

const Coin: Shape = () => (
  <g>
    <circle cx={60} cy={60} r={40} fill={p.amber500} />
    <circle cx={60} cy={60} r={30} fill="none" stroke={p.amber700} strokeWidth={4} />
    <path
      d="M60 42v36M52 50h12a6 6 0 0 1 0 12h-8a6 6 0 0 0 0 12h12"
      stroke={p.amber700}
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
    />
    <ellipse
      cx={46}
      cy={40}
      rx={8}
      ry={4}
      fill={p.white}
      opacity={0.5}
      transform="rotate(-35 46 40)"
    />
  </g>
);

const Banknote: Shape = () => (
  <g transform="rotate(-8 60 60)">
    <rect
      x={12}
      y={34}
      width={96}
      height={52}
      rx={8}
      fill={p.green100}
      stroke={p.green700}
      strokeWidth={3}
    />
    <circle cx={60} cy={60} r={14} fill={p.green500} />
    <rect x={22} y={44} width={14} height={8} rx={3} fill={p.green500} />
    <rect x={84} y={68} width={14} height={8} rx={3} fill={p.green500} />
  </g>
);

const Coins: Shape = () => (
  <g>
    <ellipse cx={46} cy={88} rx={26} ry={9} fill={p.amber700} />
    <ellipse cx={46} cy={82} rx={26} ry={9} fill={p.amber500} stroke={p.amber700} strokeWidth={2} />
    <ellipse cx={46} cy={72} rx={26} ry={9} fill={p.amber500} stroke={p.amber700} strokeWidth={2} />
    <circle cx={82} cy={50} r={22} fill={p.amber500} stroke={p.amber700} strokeWidth={3} />
    <circle cx={82} cy={50} r={13} fill="none" stroke={p.amber700} strokeWidth={2.5} />
    <path
      d="M24 40c8-14 22-20 36-18"
      stroke={p.cyan500}
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M54 16l8 6-9 4"
      stroke={p.cyan500}
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

/**
 * C1.1 · Lição 1 · Parte 1 — "Finanças é cuidar do dinheiro".
 * A imagem resume as quatro ações citadas no texto: receber, gastar/trocar
 * e guardar. A moeda central representa o dinheiro; os elementos ao redor
 * mostram usos diferentes, sem sugerir que uma escolha seja "a certa".
 */
const FinanceBasics: Shape = () => (
  <g>
    <circle cx={60} cy={58} r={22} fill={p.amber500} stroke={p.amber700} strokeWidth={3} />
    <circle cx={60} cy={58} r={13} fill="none" stroke={p.amber700} strokeWidth={2.5} />

    <g>
      <rect
        x={12}
        y={13}
        width={34}
        height={23}
        rx={6}
        fill={p.green100}
        stroke={p.green700}
        strokeWidth={2}
        transform="rotate(-8 29 24.5)"
      />
      <circle cx={29} cy={24} r={6} fill={p.green500} />
      <path
        d="M41 33c6 3 10 7 13 12"
        stroke={p.green700}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M51 40l4 6-7-1"
        stroke={p.green700}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    <g transform="translate(78 12) rotate(10 15 17)">
      <path
        d="M3 5h17l12 12-12 12H3a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z"
        fill={p.coral100}
        stroke={p.coral500}
        strokeWidth={2}
      />
      <circle cx={22} cy={17} r={3} fill={p.white} stroke={p.coral500} strokeWidth={2} />
      <rect x={7} y={12} width={10} height={3} rx={1.5} fill={p.coral700} />
      <rect x={7} y={18} width={7} height={3} rx={1.5} fill={p.coral500} />
    </g>

    <g>
      <path
        d="M18 72c8 9 16 12 27 12"
        stroke={p.cyan500}
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M39 78l7 6-8 4"
        stroke={p.cyan500}
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M45 96c-10 1-19-2-27-10"
        stroke={p.cyan700}
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M23 91l-6-6 8-3"
        stroke={p.cyan700}
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    <g>
      <rect x={78} y={72} width={28} height={9} rx={3} fill={p.teal700} />
      <rect
        x={73}
        y={79}
        width={38}
        height={31}
        rx={11}
        fill={p.teal50}
        stroke={p.teal500}
        strokeWidth={2.5}
      />
      <ellipse cx={92} cy={99} rx={11} ry={3.5} fill={p.amber500} />
      <circle cx={92} cy={89} r={5} fill={p.amber500} stroke={p.amber700} strokeWidth={1.5} />
      <path
        d="M72 65c7-4 13-5 19-4"
        stroke={p.teal500}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M87 57l6 4-6 4"
        stroke={p.teal500}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </g>
);

const PriceTag: Shape = () => (
  <g transform="rotate(-15 60 60)">
    <path
      d="M30 34h44l24 26-24 26H30a6 6 0 0 1-6-6V40a6 6 0 0 1 6-6Z"
      fill={p.coral100}
      stroke={p.coral500}
      strokeWidth={3}
    />
    <circle cx={78} cy={60} r={6} fill={p.white} stroke={p.coral500} strokeWidth={3} />
    <rect x={36} y={50} width={28} height={6} rx={3} fill={p.coral700} />
    <rect x={36} y={62} width={18} height={6} rx={3} fill={p.coral500} />
  </g>
);

const Kite: Shape = () => (
  <g>
    <path d="M60 10 92 46 60 92 28 46Z" fill={p.purple500} />
    <path d="M60 10v82M28 46h64" stroke={p.white} strokeWidth={3} />
    <path d="M60 10 92 46H60Z" fill={p.coral500} />
    <path d="M60 46H28l32 46Z" fill={p.amber500} />
    <path
      d="M60 92c-6 6 6 10 0 16"
      stroke={p.slate}
      strokeWidth={2.5}
      fill="none"
      strokeLinecap="round"
    />
    <path d="M56 100l-8 2 6 4ZM60 110l8 2-6 4Z" fill={p.teal500} />
  </g>
);

const Backpack: Shape = () => (
  <g>
    <path d="M44 26a16 16 0 0 1 32 0" stroke={p.cyan700} strokeWidth={6} fill="none" />
    <rect x={26} y={28} width={68} height={80} rx={20} fill={p.cyan500} />
    <rect x={38} y={66} width={44} height={30} rx={8} fill={p.cyan100} />
    <path d="M38 76h44" stroke={p.cyan700} strokeWidth={3} />
    <rect x={56} y={70} width={8} height={10} rx={3} fill={p.amber500} />
  </g>
);

const Book: Shape = () => (
  <g>
    <path d="M60 30c-14-8-30-8-42-4v68c12-4 28-4 42 4Z" fill={p.teal500} />
    <path d="M60 30c14-8 30-8 42-4v68c-12-4-28-4-42 4Z" fill={p.teal700} />
    <path d="M60 34c-12-6-26-6-36-3v60c10-3 24-3 36 3Z" fill={p.white} />
    <path d="M60 34c12-6 26-6 36-3v60c-10-3-24-3-36 3Z" fill={p.slate100} />
    <path
      d="M32 46h18M32 56h18M32 66h14M70 46h18M70 56h18M70 66h12"
      stroke={p.slate300}
      strokeWidth={3}
      strokeLinecap="round"
    />
  </g>
);

const Notebook: Shape = () => (
  <g>
    <rect x={30} y={16} width={62} height={88} rx={8} fill={p.coral500} />
    <rect x={40} y={16} width={52} height={88} rx={6} fill={p.coral100} />
    {[28, 42, 56, 70, 84].map((y) => (
      <circle key={y} cx={30} cy={y} r={4} fill={p.white} stroke={p.slate300} strokeWidth={2} />
    ))}
    <rect x={50} y={32} width={32} height={14} rx={4} fill={p.white} />
  </g>
);

const Pencil: Shape = () => (
  <g transform="rotate(40 60 60)">
    <rect x={50} y={14} width={20} height={70} rx={3} fill={p.amber500} />
    <rect x={50} y={14} width={20} height={10} rx={3} fill={p.coral500} />
    <rect x={50} y={24} width={20} height={5} fill={p.slate300} />
    <path d="M50 84h20l-10 20Z" fill={p.amber100} />
    <path d="M57 98h6l-3 6Z" fill={p.navy} />
  </g>
);

const Eraser: Shape = () => (
  <g>
    <g transform="rotate(-12 44 66)">
      <rect x={18} y={50} width={52} height={30} rx={8} fill={p.coral100} />
      <rect x={18} y={50} width={24} height={30} rx={8} fill={p.cyan500} />
    </g>
    <rect x={72} y={56} width={30} height={34} rx={6} fill={p.purple500} />
    <circle cx={87} cy={68} r={7} fill={p.navy} />
  </g>
);

const Bread: Shape = () => (
  <g>
    <path
      d="M18 70c0-26 18-38 42-38s42 12 42 38c0 12-6 20-14 20H32c-8 0-14-8-14-20Z"
      fill={p.amber500}
    />
    <path d="M24 72c0-20 14-32 36-32s36 12 36 32" fill={p.amber100} opacity={0.35} />
    <path
      d="M42 48l-6 14M60 44v16M78 48l6 14"
      stroke={p.amber700}
      strokeWidth={4}
      strokeLinecap="round"
    />
  </g>
);

const Juice: Shape = () => (
  <g>
    <path d="M38 34h44l-6 72H44Z" fill={p.cyan100} stroke={p.slate300} strokeWidth={2} />
    <path d="M40 54h40l-4 52H44Z" fill={p.amber500} />
    <path d="M66 34 78 8" stroke={p.coral500} strokeWidth={5} strokeLinecap="round" />
    <circle cx={86} cy={36} r={12} fill={p.green500} />
    <circle cx={86} cy={36} r={6} fill={p.green100} />
  </g>
);

const Bench: Shape = () => (
  <g>
    <circle cx={86} cy={34} r={22} fill={p.green500} />
    <rect x={83} y={50} width={6} height={42} fill={p.amber700} />
    <rect x={14} y={60} width={64} height={8} rx={3} fill={p.amber500} />
    <rect x={14} y={74} width={64} height={8} rx={3} fill={p.amber500} />
    <rect x={20} y={82} width={6} height={18} fill={p.slate} />
    <rect x={66} y={82} width={6} height={18} fill={p.slate} />
    <ellipse cx={60} cy={102} rx={50} ry={6} fill={p.green100} />
  </g>
);

const Tablet: Shape = () => (
  <g>
    <rect x={14} y={24} width={92} height={68} rx={10} fill={p.navy} />
    <rect x={22} y={32} width={76} height={52} rx={4} fill={p.cyan100} />
    <path d="M52 46v24l20-12Z" fill={p.cyan700} />
    <circle cx={60} cy={100} r={4} fill={p.slate300} />
  </g>
);

const Poster: Shape = () => (
  <g>
    <rect
      x={26}
      y={12}
      width={68}
      height={92}
      rx={6}
      fill={p.purple100}
      stroke={p.purple500}
      strokeWidth={3}
    />
    <circle cx={60} cy={46} r={18} fill={p.amber500} />
    <path
      d="M60 22l4 10 10-4-4 10 10 4-10 4 4 10-10-4-4 10-4-10-10 4 4-10-10-4 10-4-4-10 10 4Z"
      fill={p.coral500}
      opacity={0.35}
    />
    <rect x={36} y={74} width={48} height={8} rx={4} fill={p.purple500} />
    <rect x={42} y={88} width={36} height={6} rx={3} fill={p.purple500} opacity={0.6} />
  </g>
);

const Megaphone: Shape = () => (
  <g>
    <path d="M22 50h18l40-22v64L40 70H22a6 6 0 0 1-6-6v-8a6 6 0 0 1 6-6Z" fill={p.coral500} />
    <rect x={28} y={70} width={12} height={22} rx={4} fill={p.coral700} />
    <path
      d="M90 44c6 4 6 28 0 32"
      stroke={p.amber500}
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M98 34c12 10 12 42 0 52"
      stroke={p.amber500}
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

const star = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r}L${cx + r * 0.28} ${cy - r * 0.28}L${cx + r} ${cy}L${cx + r * 0.28} ${cy + r * 0.28}L${cx} ${cy + r}L${cx - r * 0.28} ${cy + r * 0.28}L${cx - r} ${cy}L${cx - r * 0.28} ${cy - r * 0.28}Z`;

const Sparkles: Shape = () => (
  <g>
    <path d={star(52, 58, 34)} fill={p.amber500} />
    <path d={star(90, 30, 16)} fill={p.coral500} />
    <path d={star(92, 88, 12)} fill={p.purple500} />
    <path d={star(24, 22, 9)} fill={p.cyan500} />
  </g>
);

const Blocks: Shape = () => (
  <g>
    <rect x={18} y={64} width={40} height={36} rx={4} fill={p.teal500} />
    <rect x={62} y={64} width={40} height={36} rx={4} fill={p.coral500} />
    <rect x={40} y={26} width={40} height={36} rx={4} fill={p.amber500} />
    <rect x={64} y={14} width={20} height={14} rx={3} fill={p.cyan500} />
    {[30, 46, 74, 90, 52, 68].map((x, index) => (
      <circle key={index} cx={x} cy={index < 4 ? 64 : 26} r={4} fill={p.white} opacity={0.6} />
    ))}
  </g>
);

const Snack: Shape = () => (
  <g>
    <path
      d="M30 18h60l-4 10 4 10v50l-4 10 4 10H30l4-10-4-10V38l4-10Z"
      fill={p.amber100}
      stroke={p.amber500}
      strokeWidth={3}
    />
    <circle cx={60} cy={58} r={16} fill={p.amber500} />
    <circle cx={54} cy={54} r={3} fill={p.amber700} />
    <circle cx={64} cy={62} r={3} fill={p.amber700} />
    <rect x={42} y={82} width={36} height={8} rx={4} fill={p.amber700} />
  </g>
);

const Magnifier: Shape = () => (
  <g>
    <path d="M74 74l26 26" stroke={p.navy} strokeWidth={12} strokeLinecap="round" />
    <circle cx={50} cy={50} r={32} fill={p.cyan100} stroke={p.cyan700} strokeWidth={8} />
    <path
      d="M36 40a18 18 0 0 1 14-10"
      stroke={p.white}
      strokeWidth={5}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

const Chalkboard: Shape = () => (
  <g>
    <rect x={12} y={20} width={96} height={66} rx={6} fill={p.amber700} />
    <rect x={18} y={26} width={84} height={54} rx={3} fill={p.teal700} />
    <path
      d="M30 44h26M30 58h40M78 38l8 8 12-14"
      stroke={p.white}
      strokeWidth={3.5}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x={30} y={88} width={12} height={20} fill={p.amber700} />
    <rect x={78} y={88} width={12} height={20} fill={p.amber700} />
  </g>
);

const Laptop: Shape = () => (
  <g>
    <rect x={24} y={22} width={72} height={52} rx={6} fill={p.slate} />
    <rect x={30} y={28} width={60} height={40} rx={3} fill={p.cyan100} />
    <path d="M10 80h100l-6 14H16Z" fill={p.slate300} />
    <path d="M52 48l8-8 8 8-8 8Z" fill={p.purple500} />
    <path d="M86 92l14-26" stroke={p.amber500} strokeWidth={6} strokeLinecap="round" />
    <circle cx={101} cy={63} r={6} fill="none" stroke={p.amber500} strokeWidth={4} />
  </g>
);

const Chair: Shape = () => (
  <g>
    <rect x={34} y={12} width={8} height={94} rx={3} fill={p.amber700} />
    <rect x={34} y={18} width={46} height={10} rx={4} fill={p.amber500} />
    <rect x={34} y={34} width={46} height={10} rx={4} fill={p.amber500} />
    <rect x={30} y={58} width={60} height={10} rx={4} fill={p.amber500} />
    <rect x={80} y={58} width={8} height={48} rx={3} fill={p.amber700} />
    <rect x={56} y={66} width={6} height={40} rx={3} fill={p.amber700} />
  </g>
);

const Stethoscope: Shape = () => (
  <g>
    <path
      d="M34 16v30a26 26 0 0 0 52 0V16"
      stroke={p.slate}
      strokeWidth={6}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M60 72v12a16 16 0 0 0 32 0v-8"
      stroke={p.slate}
      strokeWidth={6}
      fill="none"
      strokeLinecap="round"
    />
    <circle cx={92} cy={70} r={12} fill={p.cyan500} stroke={p.cyan700} strokeWidth={4} />
    <circle cx={34} cy={14} r={5} fill={p.coral500} />
    <circle cx={86} cy={14} r={5} fill={p.coral500} />
  </g>
);

const Wallet: Shape = () => (
  <g>
    <rect
      x={30}
      y={24}
      width={56}
      height={30}
      rx={4}
      fill={p.green100}
      stroke={p.green700}
      strokeWidth={2.5}
      transform="rotate(-10 58 39)"
    />
    <rect x={14} y={40} width={92} height={62} rx={12} fill={p.teal700} />
    <rect x={14} y={40} width={92} height={18} rx={9} fill={p.teal500} />
    <rect x={76} y={64} width={30} height={20} rx={6} fill={p.teal500} />
    <circle cx={88} cy={74} r={4} fill={p.amber500} />
  </g>
);

const Calendar: Shape = () => (
  <g>
    <rect
      x={18}
      y={24}
      width={84}
      height={80}
      rx={10}
      fill={p.white}
      stroke={p.purple500}
      strokeWidth={3}
    />
    <rect x={18} y={24} width={84} height={20} rx={10} fill={p.purple500} />
    <rect x={36} y={14} width={8} height={20} rx={4} fill={p.purple700} />
    <rect x={76} y={14} width={8} height={20} rx={4} fill={p.purple700} />
    {[0, 1, 2, 3].map((col) =>
      [0, 1, 2].map((row) => (
        <rect
          key={`${col}-${row}`}
          x={30 + col * 17}
          y={54 + row * 15}
          width={10}
          height={9}
          rx={2}
          fill={col === 2 && row === 1 ? p.amber500 : p.slate200}
        />
      )),
    )}
  </g>
);

const Apple: Shape = () => (
  <g>
    <path
      d="M60 36c-10-8-36-6-36 22 0 26 18 46 36 40 18 6 36-14 36-40 0-28-26-30-36-22Z"
      fill={p.coral500}
    />
    <path
      d="M60 36c0-10 4-18 10-22"
      stroke={p.amber700}
      strokeWidth={5}
      fill="none"
      strokeLinecap="round"
    />
    <path d="M64 28c8-10 22-10 24-4-6 8-18 8-24 4Z" fill={p.green500} />
    <ellipse cx={42} cy={56} rx={6} ry={10} fill={p.white} opacity={0.4} />
  </g>
);

const Cake: Shape = () => (
  <g>
    <rect x={20} y={56} width={80} height={44} rx={8} fill={p.amber100} />
    <path
      d="M20 66c10 8 16-6 26 2s16-6 26 2 16-6 28 0v-4a8 8 0 0 0-8-8H28a8 8 0 0 0-8 8Z"
      fill={p.coral500}
    />
    <rect x={56} y={30} width={8} height={26} rx={3} fill={p.cyan500} />
    <path d="M60 16c5 6 5 10 0 14-5-4-5-8 0-14Z" fill={p.amber500} />
    <ellipse cx={60} cy={102} rx={46} ry={6} fill={p.slate200} />
  </g>
);

const Boat: Shape = () => (
  <g>
    <path
      d="M12 96c12 8 24-8 36 0s24-8 36 0 24-8 24-8"
      stroke={p.cyan500}
      strokeWidth={5}
      fill="none"
      strokeLinecap="round"
    />
    <path d="M20 70h80l-12 20H32Z" fill={p.coral500} />
    <path d="M60 16v54" stroke={p.navy} strokeWidth={4} />
    <path d="M62 20l30 44H62Z" fill={p.white} stroke={p.slate300} strokeWidth={2} />
    <path d="M58 30 34 64h24Z" fill={p.amber500} />
  </g>
);

const Paints: Shape = () => (
  <g>
    <rect
      x={14}
      y={42}
      width={92}
      height={50}
      rx={12}
      fill={p.white}
      stroke={p.slate300}
      strokeWidth={3}
    />
    {[p.coral500, p.amber500, p.teal500, p.purple500].map((color, index) => (
      <circle key={color} cx={32 + index * 19} cy={67} r={8} fill={color} />
    ))}
    <path d="M70 14 96 42" stroke={p.amber700} strokeWidth={6} strokeLinecap="round" />
    <path d="M96 42c4 4 2 10-4 8l-2-4Z" fill={p.cyan500} />
  </g>
);

const BoardGame: Shape = () => (
  <g>
    <rect x={16} y={30} width={88} height={64} rx={8} fill={p.purple500} />
    <rect x={24} y={38} width={72} height={48} rx={4} fill={p.purple100} />
    <path
      d="M30 76c10-20 24 4 34-16s20-6 26-18"
      stroke={p.purple500}
      strokeWidth={5}
      fill="none"
      strokeLinecap="round"
      strokeDasharray="2 8"
    />
    <rect
      x={70}
      y={14}
      width={22}
      height={22}
      rx={5}
      fill={p.white}
      stroke={p.slate300}
      strokeWidth={2}
      transform="rotate(12 81 25)"
    />
    <circle cx={77} cy={22} r={2.5} fill={p.navy} />
    <circle cx={85} cy={29} r={2.5} fill={p.navy} />
    <circle cx={38} cy={72} r={6} fill={p.coral500} />
  </g>
);

const Bus: Shape = () => (
  <g>
    <rect x={10} y={30} width={100} height={56} rx={12} fill={p.amber500} />
    {[20, 42, 64].map((x) => (
      <rect key={x} x={x} y={40} width={18} height={18} rx={3} fill={p.cyan100} />
    ))}
    <rect x={88} y={40} width={14} height={34} rx={3} fill={p.cyan100} />
    <rect x={10} y={66} width={100} height={6} fill={p.amber700} />
    <circle cx={34} cy={88} r={10} fill={p.navy} />
    <circle cx={86} cy={88} r={10} fill={p.navy} />
  </g>
);

export const itemShapesC1 = {
  'item-coin': Coin,
  'item-banknote': Banknote,
  'item-coins': Coins,
  'item-finance-basics': FinanceBasics,
  'item-pricetag': PriceTag,
  'item-kite': Kite,
  'item-backpack': Backpack,
  'item-book': Book,
  'item-notebook': Notebook,
  'item-pencil': Pencil,
  'item-eraser': Eraser,
  'item-bread': Bread,
  'item-juice': Juice,
  'item-bench': Bench,
  'item-tablet': Tablet,
  'item-poster': Poster,
  'item-megaphone': Megaphone,
  'item-sparkles': Sparkles,
  'item-blocks': Blocks,
  'item-snack': Snack,
  'item-magnifier': Magnifier,
  'item-chalkboard': Chalkboard,
  'item-laptop': Laptop,
  'item-chair': Chair,
  'item-stethoscope': Stethoscope,
  'item-wallet': Wallet,
  'item-calendar': Calendar,
  'item-apple': Apple,
  'item-cake': Cake,
  'item-boat': Boat,
  'item-paints': Paints,
  'item-boardgame': BoardGame,
  'item-bus': Bus,
} satisfies Record<string, Shape>;

export { star };
