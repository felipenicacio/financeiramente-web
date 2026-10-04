import {
  catalogSchema,
  cycleSummarySchema,
  validateModuleBundle,
} from '@/lib/validation/contentSchemas';
import type { ValidationIssue } from '@/lib/validation/schema';

import { rawCatalog, rawCycleSummaries, rawModules } from './registry';
import type {
  Catalog,
  CycleEntry,
  CycleId,
  CycleSummary,
  Lesson,
  Module,
  ModuleBundle,
} from './types';

export type LoadResult<T> = { ok: true; data: T } | { ok: false; issues: ValidationIssue[] };

/** Conteúdo é estático: cada arquivo é validado uma vez por processo. */
const cache = new Map<string, LoadResult<unknown>>();

function memo<T>(key: string, load: () => LoadResult<T>): LoadResult<T> {
  if (!cache.has(key)) cache.set(key, load());
  return cache.get(key) as LoadResult<T>;
}

function reportIssues(source: string, issues: ValidationIssue[]) {
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

export function loadModuleBundle(cycle: string, moduleId: string): LoadResult<ModuleBundle> {
  const key = `${cycle}/${moduleId}`;
  return memo(`module:${key}`, () => {
    const raw = rawModules[key];
    if (!raw) return { ok: false, issues: [{ path: key, message: 'módulo não registrado' }] };
    const result = validateModuleBundle(raw.module, raw.lessons);
    if (!result.ok) {
      reportIssues(key, result.issues);
      return { ok: false, issues: result.issues };
    }
    return { ok: true, data: result.bundle };
  });
}

export function loadLesson(cycle: string, moduleId: string, order: number): LoadResult<Lesson> {
  const bundle = loadModuleBundle(cycle, moduleId);
  if (!bundle.ok) return bundle;
  const lesson = bundle.data.lessons.find((entry) => entry.order === order);
  return lesson
    ? { ok: true, data: lesson }
    : {
        ok: false,
        issues: [{ path: `${cycle}/${moduleId}`, message: `lição ${order} não existe` }],
      };
}

export function loadModule(cycle: string, moduleId: string): LoadResult<Module> {
  const bundle = loadModuleBundle(cycle, moduleId);
  return bundle.ok ? { ok: true, data: bundle.data.module } : bundle;
}

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

/** Lista de módulos publicados, na ordem do catálogo. */
export function availableModules(): { cycle: CycleId; moduleId: string }[] {
  const catalog = loadCatalog();
  if (!catalog.ok) return [];
  return catalog.data.cycles.flatMap((cycle) =>
    cycle.modules
      .filter((ref) => ref.status === 'available' && rawModules[`${cycle.id}/${ref.id}`])
      .map((ref) => ({ cycle: cycle.id, moduleId: ref.id })),
  );
}

export function cycleModules(cycle: string): string[] {
  return availableModules()
    .filter((entry) => entry.cycle === cycle)
    .map((entry) => entry.moduleId);
}

export function nextModuleId(cycle: string, moduleId: string): string | null {
  const ids = cycleModules(cycle);
  const index = ids.indexOf(moduleId);
  return index >= 0 && index < ids.length - 1 ? (ids[index + 1] ?? null) : null;
}

export { t } from './ui';

export function findCycle(catalog: Catalog, cycle: string): CycleEntry | undefined {
  return catalog.cycles.find((entry) => entry.id === cycle);
}

export const cycleIds: CycleId[] = ['c1', 'c2', 'c3', 'c4'];

export function isCycleId(value: unknown): value is CycleId {
  return typeof value === 'string' && (cycleIds as string[]).includes(value);
}
