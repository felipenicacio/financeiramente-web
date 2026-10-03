import { Illustration, type SceneLabels } from '@/components/illustrations';

type Props = { illustration: string; text: string; labels: SceneLabels; counter: string };

/** Um quadro da história: ilustração grande, uma frase curta. */
export function StoryCard({ illustration, text, labels, counter }: Props) {
  return (
    <figure className="animate-enter-side overflow-hidden rounded-hero bg-surface shadow-card">
      <div className="bg-accent-soft px-4 pt-5">
        <Illustration
          name={illustration}
          labels={labels}
          className="mx-auto w-full max-w-[28rem]"
        />
      </div>
      <figcaption className="flex flex-col gap-3 p-5 sm:p-6">
        <span className="text-caption font-medium text-ink-muted">{counter}</span>
        <span className="text-lead font-medium leading-relaxed">{text}</span>
      </figcaption>
    </figure>
  );
}
