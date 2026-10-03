import type { ReactNode } from 'react';

type Props = {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
};

/** Agrupa os módulos de uma jornada. */
export function JourneyCard({ id, title, description, children }: Props) {
  return (
    <section aria-labelledby={`jornada-${id}`} className="flex flex-col gap-4">
      <div>
        <h2 id={`jornada-${id}`} className="text-title font-semibold tracking-[-0.02em]">
          {title}
        </h2>
        <p className="mt-1 text-ink-soft">{description}</p>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
