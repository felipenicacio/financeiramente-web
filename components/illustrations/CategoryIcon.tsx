import type { CategoryId } from '@/lib/content/types';

type Props = { category: CategoryId; className?: string };

/**
 * Ícones das três categorias. Formas diferentes (casa, coração, ampulheta)
 * garantem que a categoria seja reconhecida sem depender da cor. Herdam a cor
 * do texto (currentColor).
 */
export function CategoryIcon({ category, className }: Props) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
      focusable={false}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {category === 'need' && (
        <>
          <path d="M5 15.5 16 6l11 9.5" />
          <path d="M8.5 13.5V25a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V13.5" />
          <rect x={13.5} y={19} width={5} height={7.5} rx={1.2} fill="currentColor" stroke="none" />
        </>
      )}
      {category === 'want' && (
        <path d="M16 26.5S5 20.2 5 12.6A5.6 5.6 0 0 1 16 10a5.6 5.6 0 0 1 11 2.6c0 7.6-11 13.9-11 13.9Z" />
      )}
      {category === 'wait' && (
        <>
          <path d="M9 5.5h14M9 26.5h14" />
          <path d="M10.5 5.5c0 5 5.5 7 5.5 10.5S10.5 21.5 10.5 26.5M21.5 5.5c0 5-5.5 7-5.5 10.5s5.5 5.5 5.5 10.5" />
          <path d="M12.5 24.5c1-2 2.2-3 3.5-3s2.5 1 3.5 3Z" fill="currentColor" stroke="none" />
          <circle cx={16} cy={11} r={1.4} fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
}
