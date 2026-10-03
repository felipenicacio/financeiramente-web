import { ButtonLink } from '@/components/ui/Button';
import { t } from '@/lib/content/ui';
import type { ValidationIssue } from '@/lib/validation/schema';

import { PageContainer } from './PageContainer';

/**
 * Conteúdo inválido nunca é exibido pela metade. Em produção a pessoa vê uma
 * mensagem amigável; em desenvolvimento, a lista exata de problemas por campo.
 */
export function ContentError({ issues }: { issues: ValidationIssue[] }) {
  const showDetails = process.env.NODE_ENV !== 'production';
  return (
    <PageContainer width="reading" className="py-16">
      <div role="alert" className="rounded-hero bg-surface p-6 shadow-card sm:p-8">
        <h1 className="text-title font-semibold">{t('contentErrorTitle')}</h1>
        <p className="mt-2 text-ink-soft">{t('contentErrorBody')}</p>
        {showDetails ? (
          <ul className="mt-4 space-y-1 rounded-card bg-coral-50 p-4 text-caption text-coral-700">
            {issues.map((issue) => (
              <li key={`${issue.path}-${issue.message}`}>
                <strong>{issue.path}</strong>: {issue.message}
              </li>
            ))}
          </ul>
        ) : null}
        <ButtonLink href="/" variant="secondary" className="mt-6">
          {t('contentErrorCta')}
        </ButtonLink>
      </div>
    </PageContainer>
  );
}
