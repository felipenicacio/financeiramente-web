import { existsSync } from 'node:fs';
import { join } from 'node:path';

import {
  availableModules,
  loadCatalog,
  loadCycleSummary,
  loadModuleBundle,
} from '@/lib/content';
import { econominhoAssets } from '@/components/econominho/assets';
import { competencyCodes, sourceCodes } from '@/lib/validation/contentSchemas';
import type { Lesson } from '@/lib/content/types';
import competencyCatalog from '@/content/competencies.json';
import { competencyDescription } from '@/lib/content/competencies';

/**
 * Guarda de conteúdo do currículo C1 (v2.0). Valida a arquitetura
 * ciclo → módulo → lição, a rastreabilidade (competências, fontes,
 * sensibilidade) e a existência dos assets oficiais do Econominho.
 */
const root = join(__dirname, '..');
const sensitivities = new Set(['N1', 'N2', 'N3']);

const modules = availableModules();

function allLessons(): Lesson[] {
  return modules.flatMap(({ cycle, moduleId }) => {
    const bundle = loadModuleBundle(cycle, moduleId);
    if (!bundle.ok) throw new Error(`${cycle}/${moduleId} não validou`);
    return bundle.data.lessons;
  });
}

describe('catálogo', () => {
  it('carrega sem problemas de validação', () => {
    const catalog = loadCatalog();
    expect(catalog.ok).toBe(true);
  });

  it('publica o C1 com 6 módulos', () => {
    const c1 = modules.filter((entry) => entry.cycle === 'c1');
    expect(c1).toHaveLength(6);
  });
});

describe('módulos e lições do C1', () => {
  it.each(modules)('o módulo %s valida e tem 5 lições', ({ cycle, moduleId }) => {
    const bundle = loadModuleBundle(cycle, moduleId);
    expect(bundle.ok).toBe(true);
    if (!bundle.ok) return;
    expect(bundle.data.lessons).toHaveLength(5);
    // Lições em ordem 1..5.
    expect(bundle.data.lessons.map((lesson) => lesson.order)).toEqual([1, 2, 3, 4, 5]);
  });

  it('tem 30 lições no total', () => {
    expect(allLessons()).toHaveLength(30);
  });

  it('não repete o id de nenhuma lição', () => {
    const ids = allLessons().map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada lição tem de 2 a 4 objetos de tipos variados', () => {
    for (const lesson of allLessons()) {
      expect(lesson.content.length).toBeGreaterThanOrEqual(2);
      expect(lesson.content.length).toBeLessThanOrEqual(4);
    }
  });
});

describe('catálogo de competências', () => {
  it('contém as 36 competências oficiais com descrição legível', () => {
    expect(competencyCatalog.competencies).toHaveLength(36);
    for (const item of competencyCatalog.competencies) {
      expect(item.code).toBeTruthy();
      expect(item.description.trim().length).toBeGreaterThan(10);
      expect(competencyDescription(item.code)).toBe(item.description);
    }
  });
});

describe('rastreabilidade', () => {
  it('toda competência citada existe na matriz (36 códigos)', () => {
    const valid = new Set<string>(competencyCodes);
    for (const lesson of allLessons()) {
      expect(lesson.competencies.length).toBeGreaterThan(0);
      for (const code of lesson.competencies) expect(valid.has(code)).toBe(true);
    }
  });

  it('toda fonte usa um código conhecido e tem referência', () => {
    const valid = new Set<string>(sourceCodes);
    for (const lesson of allLessons()) {
      for (const source of lesson.sources) {
        expect(valid.has(source.source)).toBe(true);
        expect(source.reference.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('toda lição declara sensibilidade N1, N2 ou N3', () => {
    for (const lesson of allLessons()) expect(sensitivities.has(lesson.sensitivity)).toBe(true);
  });

  it('cada módulo fecha com avaliação integradora e síntese', () => {
    for (const { cycle, moduleId } of modules) {
      const bundle = loadModuleBundle(cycle, moduleId);
      if (!bundle.ok) continue;
      const { module } = bundle.data;
      expect(module.integrative.object).toBeTruthy();
      expect(module.conclusion.recap.length).toBeGreaterThan(0);
    }
  });
});

describe('resumo do ciclo', () => {
  it('o C1 tem "O que descobrimos?"', () => {
    const summary = loadCycleSummary('c1');
    expect(summary?.ok).toBe(true);
  });
});

describe('assets oficiais do Econominho', () => {
  it('o avatar de cada estado de fala existe no disco', () => {
    const states = ['ask', 'discover', 'compare', 'consequence', 'summary', 'reflect'] as const;
    for (const state of states) {
      const rel = econominhoAssets.avatar(state).replace(/^.*?(\/econominho\/)/, 'econominho/');
      expect(existsSync(join(root, 'public', rel))).toBe(true);
    }
  });

  it('as imagens temáticas m01..m04 existem', () => {
    for (const key of ['m01', 'm02', 'm03', 'm04'] as const) {
      const rel = econominhoAssets.theme(key).replace(/^.*?(\/econominho\/)/, 'econominho/');
      expect(existsSync(join(root, 'public', rel))).toBe(true);
    }
  });
});
