/**
 * Design System do Financeiramente — tokens em TypeScript.
 *
 * Fonte única das cores usadas fora do CSS (ilustrações SVG, manifest do PWA,
 * metadata). O CSS (styles/globals.css) declara os mesmos valores como
 * variáveis; o teste theme/tokens.test.ts garante que os dois não divergem.
 *
 * As cores-base vêm da direção de marca. As escalas tonais (50/100/700)
 * existem para garantir contraste WCAG: os tons 500 são vibrantes demais para
 * texto sobre branco, então texto e ícones usam 700 e fundos suaves 50/100.
 */
export const palette = {
  navy: '#0F172A',
  slate: '#334155',
  slate500: '#64748B',
  slate300: '#CBD5E1',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9',
  background: '#F8FAFC',
  white: '#FFFFFF',

  teal50: '#F0FDFA',
  teal100: '#CCFBF1',
  teal500: '#14B8A6',
  teal700: '#0F766E',

  cyan50: '#F0F9FF',
  cyan100: '#E0F2FE',
  cyan500: '#38BDF8',
  cyan700: '#0369A1',

  amber50: '#FFFBEB',
  amber100: '#FEF3C7',
  amber500: '#F59E0B',
  amber700: '#B45309',

  coral50: '#FFF1F2',
  coral100: '#FFE4E6',
  coral500: '#FB7185',
  coral700: '#BE123C',

  green50: '#F0FDF4',
  green100: '#DCFCE7',
  green500: '#22C55E',
  green700: '#15803D',

  purple50: '#F5F3FF',
  purple100: '#EDE9FE',
  purple500: '#8B5CF6',
  purple700: '#6D28D9',
} as const;

export type PaletteKey = keyof typeof palette;

/** Cor do navegador/PWA (barra de status) e fundo da tela de abertura. */
export const brand = {
  themeColor: palette.background,
  backgroundColor: palette.background,
} as const;
