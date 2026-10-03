import catalog from '@/content/competencies.json';

type CompetencyEntry = (typeof catalog.competencies)[number];

const byCode = new Map<string, CompetencyEntry>(
  catalog.competencies.map((entry) => [entry.code, entry]),
);

export function competencyDescription(code: string): string {
  return byCode.get(code)?.description ?? code;
}

export function competencyByCode(code: string): CompetencyEntry | undefined {
  return byCode.get(code);
}

export const competencies = catalog.competencies;
