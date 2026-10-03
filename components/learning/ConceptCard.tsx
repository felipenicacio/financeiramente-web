import { CategoryIcon, Illustration } from '@/components/illustrations';
import type { ConceptCategory } from '@/lib/content/types';

/**
 * Uma categoria do conceito (preciso / quero / posso esperar) com ícone,
 * frase curta, explicação e dois exemplos ilustrados.
 */
export function ConceptCard({ category }: { category: ConceptCategory }) {
  return (
    <article
      className={`tone-${category.id} animate-enter-side overflow-hidden rounded-hero bg-surface shadow-card`}
    >
      <div className="flex items-center gap-4 bg-(--tone-soft) p-5">
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-(--tone-tint) text-(--tone-strong)">
          <CategoryIcon category={category.id} className="size-8" />
        </span>
        <div>
          <h2 className="text-title font-bold tracking-[-0.02em] text-(--tone-strong)">
            {category.label}
          </h2>
          <p className="text-lead font-medium">{category.short}</p>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <p className="text-ink-soft">{category.description}</p>
        <ul className="grid grid-cols-2 gap-3">
          {category.examples.map((example) => (
            <li
              key={example.label}
              className="flex flex-col items-center gap-2 rounded-card bg-background p-4 text-center"
            >
              <Illustration name={example.illustration} className="size-20" />
              <span className="text-label font-semibold">{example.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
