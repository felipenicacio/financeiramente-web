import { AppHeader } from '@/components/layout/AppHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ButtonLink } from '@/components/ui/Button';
import { t } from '@/lib/content/ui';

export default function NotFound() {
  return (
    <>
      <AppHeader />
      <main id="conteudo" className="flex-1 py-16">
        <PageContainer width="reading" className="flex flex-col items-start gap-4">
          <h1 className="text-display font-bold tracking-[-0.03em]">{t('notFoundTitle')}</h1>
          <p className="text-lead text-ink-soft">{t('notFoundBody')}</p>
          <ButtonLink href="/" icon="arrow-right">
            {t('notFoundCta')}
          </ButtonLink>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
