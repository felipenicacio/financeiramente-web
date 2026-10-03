import { t } from '@/lib/content/ui';

import { PageContainer } from './PageContainer';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line/70 py-8">
      <PageContainer>
        <p className="flex max-w-[42rem] items-start gap-2 text-caption text-ink-muted">
          {t('footerPrivacy')}
        </p>
      </PageContainer>
    </footer>
  );
}
