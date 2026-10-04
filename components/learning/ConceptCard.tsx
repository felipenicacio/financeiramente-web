import { ConceptIcon, Illustration, isRasterKey } from '@/components/illustrations';
import type { Concept } from '@/lib/content/types';

/**
 * Um conceito com ícone, frase curta, explicação e exemplos ilustrados.
 * O tom de cor vem do conteúdo; o ícone e o rótulo garantem que a cor
 * nunca seja a única pista.
 */
export function ConceptCard({ concept }: { concept: Concept }) {
  return (
    <article
      className={`tone-${concept.tone} animate-enter-side overflow-hidden rounded-hero bg-surface shadow-card`}
    >
      <div className="flex items-center gap-4 bg-(--tone-soft) p-5">
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-(--tone-tint) text-(--tone-strong)">
          <ConceptIcon icon={concept.icon} className="size-8" />
        </span>
        <div>
          <h2 className="text-title font-bold tracking-[-0.02em] text-(--tone-strong)">
            {concept.label}
          </h2>
          <p className="text-lead font-medium">{concept.short}</p>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <p className="text-ink-soft">{concept.description}</p>
        {concept.examples && concept.examples.length > 0 ? (
          <ul
            className={`grid gap-3 ${concept.examples.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}
          >
            {concept.examples.map((example) => (
              <li
                key={example.label}
                className="flex flex-col items-center gap-2 rounded-card bg-background p-4 text-center"
              >
                <Illustration
                  name={example.illustration}
                  className={
                    isRasterKey(example.illustration) ? 'h-auto w-full max-w-xs' : 'size-20'
                  }
                />
                <span className="text-label font-semibold">{example.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
