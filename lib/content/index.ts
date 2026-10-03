import {
  catalogSchema,
  cycleSummarySchema,
  validateModuleBundle,
} from '@/lib/validation/contentSchemas';
import type { ValidationIssue } from '@/lib/validation/schema';

import { rawCatalog, rawCycleSummaries, rawModules } from './registry';
import type { Catalog, CycleEntry, CycleId, CycleSummary, Journey, ModuleBundle } from './types';

export type LoadResult<T> = { ok: true; data: T } | { ok: false; issues: ValidationIssue[] };

/** Conteúdo é estático: cada arquivo é validado uma vez por processo. */
const cache = new Map<string, LoadResult<unknown>>();

function memo<T>(key: string, load: () => LoadResult<T>): LoadResult<T> {
  if (!cache.has(key)) cache.set(key, load());
  return cache.get(key) as LoadResult<T>;
}

function reportIssues(source: string, issues: ValidationIssue[]) {
  // Aparece no terminal do build e do `next dev`, nunca para o visitante.
  console.warn(
    `[conteúdo] ${source} tem ${issues.length} problema(s):\n` +
      issues.map((item) => `  • ${item.path}: ${item.message}`).join('\n'),
  );
}

export function loadCatalog(): LoadResult<Catalog> {
  return memo('catalog', () => {
    const issues = catalogSchema(rawCatalog, 'catalog.json');
    if (issues.length > 0) {
      reportIssues('catalog.json', issues);
      return { ok: false, issues };
    }
    return { ok: true, data: rawCatalog as Catalog };
  });
}

export function loadModule(cycle: string, moduleId: string): LoadResult<ModuleBundle> {
  const key = `${cycle}/${moduleId}`;
  return memo(`module:${key}`, () => {
    const raw = rawModules[key];
    if (!raw) return { ok: false, issues: [{ path: key, message: 'módulo não registrado' }] };
    const result = validateModuleBundle(raw);
    if (!result.ok) {
      reportIssues(key, result.issues);
      return { ok: false, issues: result.issues };
    }
    return { ok: true, data: result.bundle };
  });
}

/** Lista os módulos publicados (status "available"), usada para gerar as páginas estáticas. */
export function availableModules(): { cycle: CycleId; moduleId: string; journeyId: string }[] {
  const catalog = loadCatalog();
  if (!catalog.ok) return [];
  return catalog.data.cycles.flatMap((cycle) =>
    cycle.journeys.flatMap((journey) =>
      journey.modules
        .filter((ref) => ref.status === 'available' && rawModules[`${cycle.id}/${ref.id}`])
        .map((ref) => ({ cycle: cycle.id, moduleId: ref.id, journeyId: journey.id })),
    ),
  );
}

export { t } from './ui';

export function loadCycleSummary(cycle: string): LoadResult<CycleSummary> | null {
  const raw = rawCycleSummaries[cycle];
  if (!raw) return null;
  return memo(`cycle:${cycle}`, () => {
    const issues = cycleSummarySchema(raw, `${cycle}/cycle.json`);
    if (issues.length > 0) {
      reportIssues(`${cycle}/cycle.json`, issues);
      return { ok: false, issues };
    }
    return { ok: true, data: raw as CycleSummary };
  });
}

/** Módulos publicados de um ciclo, na ordem do catálogo. */
export function cycleModules(cycle: string): string[] {
  return availableModules()
    .filter((entry) => entry.cycle === cycle)
    .map((entry) => entry.moduleId);
}

/** Próximo módulo publicado do mesmo ciclo, ou null se este for o último. */
export function nextModuleId(cycle: string, moduleId: string): string | null {
  const ids = cycleModules(cycle);
  const index = ids.indexOf(moduleId);
  return index >= 0 && index < ids.length - 1 ? (ids[index + 1] ?? null) : null;
}

export function findCycle(catalog: Catalog, cycle: string): CycleEntry | undefined {
  return catalog.cycles.find((entry) => entry.id === cycle);
}

export function findJourney(
  catalog: Catalog,
  cycle: string,
  journeyId: string,
): Journey | undefined {
  return findCycle(catalog, cycle)?.journeys.find((journey) => journey.id === journeyId);
}

export const cycleIds: CycleId[] = ['c1', 'c2', 'c3', 'c4'];

export function isCycleId(value: unknown): value is CycleId {
  return typeof value === 'string' && (cycleIds as string[]).includes(value);
}
