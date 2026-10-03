import type { ReactNode } from 'react';

import { Icon } from '@/components/ui/Icon';
import { t } from '@/lib/content/ui';
import type { ChoiceResult } from '@/lib/learning';

export type ChoiceState = ChoiceResult | 'selected';

type Props = {
  label: string;
  detail?: string;
  leading?: ReactNode;
  /** Classe de tom (`tone-need`, `tone-want`...) para alternativas com cor própria. */
  tone?: string;
  state?: ChoiceState;
  disabled?: boolean;
  onSelect: () => void;
};

const stateStyles: Record<ChoiceState, string> = {
  idle: 'ring-line hover:ring-line-strong',
  selected: 'ring-accent-strong ring-[3px] bg-accent-soft',
  'chosen-ok': 'tone-positive ring-(--tone-strong) ring-[3px] bg-(--tone-soft)',
  'chosen-rethink': 'tone-guide ring-(--tone-strong) ring-[3px] bg-(--tone-soft)',
  expected:
    'tone-positive ring-transparent outline-2 outline-dashed -outline-offset-2 outline-(--tone-strong)',
  'also-ok':
    'tone-positive ring-transparent outline-2 outline-dashed -outline-offset-2 outline-(--tone-strong)',
  dimmed: 'ring-line opacity-55',
};

/**
 * Alternativa grande e tocável. O estado aparece por cor, borda e texto/ícone
 * (nunca só por cor). Usa aria-pressed: é um conjunto de botões de escolha única.
 */
export function ChoiceCard({
  label,
  detail,
  leading,
  tone,
  state = 'idle',
  disabled,
  onSelect,
}: Props) {
  const selected = state === 'selected' || state === 'chosen-ok' || state === 'chosen-rethink';
  const badge =
    state === 'chosen-ok' ? (
      <Badge tone="tone-positive" icon>
        {t('yourChoice')}
      </Badge>
    ) : state === 'chosen-rethink' ? (
      <Badge tone="tone-guide">{t('yourChoice')}</Badge>
    ) : state === 'also-ok' ? (
      <Badge tone="tone-positive">{t('alsoFits')}</Badge>
    ) : state === 'expected' ? (
      <Badge tone="tone-positive">{t('fitsBest')}</Badge>
    ) : state === 'selected' ? (
      <span className="grid size-7 place-items-center rounded-full bg-accent-strong text-white animate-pop">
        <Icon name="check" className="size-4" />
      </span>
    ) : null;

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onSelect}
      className={
        `${tone ?? ''} flex min-h-16 w-full items-center gap-4 rounded-card bg-surface p-3 pr-4 text-left ring-2 ring-inset ` +
        'transition-[box-shadow,background-color,opacity,transform] duration-200 enabled:active:scale-[0.99] ' +
        'disabled:cursor-default ' +
        stateStyles[state]
      }
    >
      {leading ? <span className="shrink-0">{leading}</span> : null}
      <span className="flex min-w-0 flex-1 flex-col items-start">
        <span className="text-lead font-semibold leading-snug">{label}</span>
        {detail ? <span className="text-label text-ink-soft">{detail}</span> : null}
        {badge && state !== 'selected' ? <span className="mt-1.5">{badge}</span> : null}
      </span>
      {state === 'selected' ? badge : null}
    </button>
  );
}

function Badge({ tone, icon, children }: { tone: string; icon?: boolean; children: ReactNode }) {
  return (
    <span
      className={`${tone} animate-pop inline-flex shrink-0 items-center gap-1 rounded-full bg-(--tone-tint) px-2.5 py-1 text-caption font-semibold text-(--tone-strong)`}
    >
      {icon ? <Icon name="check" className="size-3.5" /> : null}
      {children}
    </span>
  );
}
