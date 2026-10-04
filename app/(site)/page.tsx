import { AppHeader } from '@/components/layout/AppHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { publicAsset } from '@/lib/asset';
import { t } from '@/lib/content/ui';
import { routes } from '@/lib/learning/steps';

const howItWorks = [
  { title: 'homeHow1Title', body: 'homeHow1Body', tone: 'bg-teal-100 text-teal-700' },
  { title: 'homeHow2Title', body: 'homeHow2Body', tone: 'bg-coral-100 text-coral-700' },
  { title: 'homeHow3Title', body: 'homeHow3Body', tone: 'bg-amber-100 text-amber-700' },
];

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main id="conteudo" className="flex-1">
        <PageContainer className="grid items-center gap-8 pb-12 pt-6 md:grid-cols-[1.05fr_1fr] md:gap-12 md:pb-20 md:pt-16">
          <div className="animate-enter order-2 flex flex-col items-start gap-5 md:order-1">
            <p className="rounded-full bg-teal-50 px-3 py-1 text-caption font-medium text-teal-700">
              {t('homeEyebrow')}
            </p>
            <h1 className="text-[clamp(2.25rem,7vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">
              {t('homeTitle')}
            </h1>
            <p className="max-w-[34rem] text-lead text-ink-soft">{t('homeBody')}</p>
            <ButtonLink href={routes.age} icon="arrow-right" className="w-full sm:w-auto sm:px-10">
              {t('homeCta')}
            </ButtonLink>
            <p className="flex items-center gap-2 text-caption text-ink-muted">
              <Icon name="lock" className="size-4 shrink-0" />
              {t('homeTrust')}
            </p>
          </div>
          <div className="order-1 md:order-2">
            <div className="rounded-hero bg-surface p-4 shadow-card sm:p-8">
              {/* eslint-disable-next-line @next/next/no-img-element -- exportação estática, sem otimizador de imagem */}
              <img
                src={publicAsset('/images/home-hero.webp')}
                alt="Uma família reunida à mesa conversando sobre escolhas financeiras, com moedas e um pote de poupança"
                width={1100}
                height={825}
                className="w-full rounded-card"
              />
            </div>
          </div>
        </PageContainer>

        <section aria-labelledby="como-funciona" className="pb-16">
          <PageContainer>
            <h2 id="como-funciona" className="text-heading font-semibold">
              {t('homeHowTitle')}
            </h2>
            <ol className="mt-4 grid gap-3 sm:grid-cols-3">
              {howItWorks.map((step, index) => (
                <li key={step.title} className="flex gap-4 rounded-card bg-surface p-5 shadow-card">
                  <span
                    aria-hidden
                    className={`grid size-10 shrink-0 place-items-center rounded-full text-label font-bold ${step.tone}`}
                  >
                    {index + 1}
                  </span>
                  <span>
                    <span className="block font-semibold">{t(step.title)}</span>
                    <span className="block text-label text-ink-soft">{t(step.body)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </PageContainer>
        </section>
      </main>
    </>
  );
}
