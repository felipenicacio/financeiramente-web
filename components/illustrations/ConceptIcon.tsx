import type { ConceptIconName } from '@/lib/content/types';

/**
 * Ícones de conceito em traço (viewBox 32×32), herdando a cor do texto.
 * Cada conceito tem forma própria: a categoria é reconhecida sem depender
 * da cor.
 */
const glyphs: Record<ConceptIconName, React.ReactNode> = {
  // casa
  need: (
    <>
      <path d="M5 15.5 16 6l11 9.5" />
      <path d="M8.5 13.5V25a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V13.5" />
      <rect x={13.5} y={19} width={5} height={7.5} rx={1.2} fill="currentColor" stroke="none" />
    </>
  ),
  // coração
  want: (
    <path d="M16 26.5S5 20.2 5 12.6A5.6 5.6 0 0 1 16 10a5.6 5.6 0 0 1 11 2.6c0 7.6-11 13.9-11 13.9Z" />
  ),
  // ampulheta
  wait: (
    <>
      <path d="M9 5.5h14M9 26.5h14" />
      <path d="M10.5 5.5c0 5 5.5 7 5.5 10.5S10.5 21.5 10.5 26.5M21.5 5.5c0 5-5.5 7-5.5 10.5s5.5 5.5 5.5 10.5" />
      <path d="M12.5 24.5c1-2 2.2-3 3.5-3s2.5 1 3.5 3Z" fill="currentColor" stroke="none" />
    </>
  ),
  // moeda
  money: (
    <>
      <circle cx={16} cy={16} r={11} />
      <path d="M16 10v12M13 13.5h4.5a2 2 0 0 1 0 4h-3a2 2 0 0 0 0 4H19" />
    </>
  ),
  // etiqueta
  price: (
    <>
      <path d="M5 7v8.5L17 27.5l10.5-10.5L15.5 5H7a2 2 0 0 0-2 2Z" />
      <circle cx={10.5} cy={10.5} r={2} fill="currentColor" stroke="none" />
    </>
  ),
  // moedas voltando
  change: (
    <>
      <circle cx={12} cy={19} r={7} />
      <path d="M17 7.5a8 8 0 0 1 9 9" />
      <path d="M23.5 6.5 17 7.5l1.5 6" />
    </>
  ),
  // escudo
  care: (
    <>
      <path d="M16 4.5 6 8.5v7c0 6 4.5 10.5 10 12 5.5-1.5 10-6 10-12v-7Z" />
      <path d="m11.5 16 3 3 6-6.5" />
    </>
  ),
  // pessoas
  shared: (
    <>
      <circle cx={11} cy={11} r={4} />
      <circle cx={22} cy={12} r={3.2} />
      <path d="M4 26c0-4.5 3-7.5 7-7.5s7 3 7 7.5M18.5 19.5c1-.7 2.2-1 3.5-1 3.5 0 6 2.7 6 7" />
    </>
  ),
  // megafone
  ad: (
    <>
      <path d="M5 13v6h4l11 6V7L9 13Z" />
      <path d="M9 19v6M24 12a5 5 0 0 1 0 8" />
    </>
  ),
  // lupa
  info: (
    <>
      <circle cx={14} cy={14} r={8.5} />
      <path d="m20.5 20.5 6 6" />
    </>
  ),
  // brilho
  persuade: (
    <>
      <path d="M14 5c1 6 3 8 9 9-6 1-8 3-9 9-1-6-3-8-9-9 6-1 8-3 9-9Z" />
      <path d="M24.5 4.5v5M22 7h5M25 22v4M23 24h4" />
    </>
  ),
  // maleta
  work: (
    <>
      <rect x={4.5} y={10} width={23} height={16} rx={2.5} />
      <path d="M12 10V7.5A1.5 1.5 0 0 1 13.5 6h5A1.5 1.5 0 0 1 20 7.5V10M4.5 17h23" />
    </>
  ),
  // caixa
  good: (
    <>
      <path d="M5 10.5 16 5l11 5.5v12L16 28 5 22.5Z" />
      <path d="m5 10.5 11 5.5 11-5.5M16 16v12" />
    </>
  ),
  // mãos com coração
  service: (
    <>
      <path d="M4 20h5l5 3h6a2 2 0 0 0 0-4h-4" />
      <path d="m9 20 4-4h3l8 0a2.5 2.5 0 0 1 0 5h-1" />
      <path d="M19 12.5S15 10 15 7.5A2 2 0 0 1 19 6.6a2 2 0 0 1 4 .9c0 2.5-4 5-4 5Z" />
    </>
  ),
  // carteira com seta de entrada
  income: (
    <>
      <rect x={4.5} y={11} width={23} height={15} rx={3} />
      <path d="M21 18.5h6.5M16 3.5v8M12.5 8l3.5 3.5L19.5 8" />
    </>
  ),
  // pote
  limit: (
    <>
      <path d="M10 5.5h12M9 8.5h14v14.5a3.5 3.5 0 0 1-3.5 3.5h-7A3.5 3.5 0 0 1 9 23Z" />
      <path d="M9 18h14" />
    </>
  ),
  // calendário
  later: (
    <>
      <rect x={5} y={7} width={22} height={20} rx={3} />
      <path d="M5 13h22M11 4.5v5M21 4.5v5" />
      <path d="m13.5 20 2 2 4-4.5" />
    </>
  ),
  // caminho que se divide
  choice: (
    <>
      <path d="M16 27V17M16 17 8 9M16 17l8-8" />
      <path d="M5 9h5V4M27 9h-5V4" />
    </>
  ),
};

export function ConceptIcon({ icon, className }: { icon: ConceptIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
      focusable={false}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyphs[icon]}
    </svg>
  );
}

export const conceptIconNames = Object.keys(glyphs) as ConceptIconName[];
