import type { Metadata } from 'next';

import { CycleCard } from '@/components/cards/CycleCard';
import { AppHeader } from '@/components/layout/AppHeader';
import { ContentError } from '@/components/layout/ContentError';
import { PageContainer } from '@/components/layout/PageContainer';
import { loadCatalog } from '@/lib/content';
import { t } from '@/lib/content/ui';

export const metadata: Metadata = {
  title: t('ageTitle'),
  description: t('ageBody'),
  alternates: { canonical: '/idade/' },
};

export default function AgePage() {
  const catalog = loadCatalog();
  return (
    <>
      <AppHeader back={{ href: '/', label: t('back') }} />
      <main id="conteudo" className="flex-1 pb-16 pt-6 md:pt-12">
        {catalog.ok ? (
          <PageContainer>
            <h1 className="text-display font-bold tracking-[-0.03em]">{t('ageTitle')}</h1>
            <p className="mt-2 max-w-[36rem] text-lead text-ink-soft">{t('ageBody')}</p>
            <ul className="mt-8 grid gap-3 md:grid-cols-2">
              {catalog.data.cycles.map((cycle) => (
                <li key={cycle.id}>
                  <CycleCard cycle={cycle} />
                </li>
              ))}
            </ul>
          </PageContainer>
        ) : (
          <ContentError issues={catalog.issues} />
        )}
      </main>
    </>
  );
}
