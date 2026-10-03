import type { MetadataRoute } from 'next';

import { availableModules, loadCatalog } from '@/lib/content';
import { routes } from '@/lib/learning/steps';
import { siteUrl } from '@/lib/site';

export const dynamic = 'force-static';

/** Páginas indexáveis: início, idades, jornadas publicadas e páginas de módulo. */
export default function sitemap(): MetadataRoute.Sitemap {
  const catalog = loadCatalog();
  const cycles = catalog.ok
    ? catalog.data.cycles.filter((cycle) => cycle.status === 'available').map((cycle) => cycle.id)
    : [];
  const paths = [
    routes.home,
    routes.age,
    ...cycles.map((cycle) => routes.journeys(cycle)),
    ...availableModules().map(({ cycle, moduleId }) => routes.module(cycle, moduleId)),
  ];
  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
