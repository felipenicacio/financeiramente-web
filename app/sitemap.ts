import type { MetadataRoute } from 'next';

import { availableModules, loadCatalog, loadCycleSummary } from '@/lib/content';
import { routes } from '@/lib/learning/steps';
import { siteUrl } from '@/lib/site';

export const dynamic = 'force-static';

/** Páginas indexáveis: início, idades, ciclos publicados, resumos de ciclo e módulos. */
export default function sitemap(): MetadataRoute.Sitemap {
  const catalog = loadCatalog();
  const cycles = catalog.ok
    ? catalog.data.cycles.filter((cycle) => cycle.status === 'available').map((cycle) => cycle.id)
    : [];
  const paths = [
    routes.home,
    routes.age,
    ...cycles.map((cycle) => routes.journeys(cycle)),
    ...cycles
      .filter((cycle) => loadCycleSummary(cycle)?.ok)
      .map((cycle) => routes.cycleSummary(cycle)),
    ...availableModules().map(({ cycle, moduleId }) => routes.module(cycle, moduleId)),
  ];
  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
