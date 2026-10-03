/**
 * Modelo de conteúdo do Econominho — currículo C1–C4 v2.0.
 *
 * Hierarquia: ciclo → módulo → lição → objetos de conteúdo.
 * Cada lição carrega rastreabilidade (competências, fontes, sensibilidade) e
 * uma sequência de 2 a 4 objetos educacionais de tipos variados. O módulo
 * termina com uma avaliação integradora e a síntese "O que descobrimos?".
 *
 * Regra de ouro: todo número que pode ser calculado é calculado no código.
 * Textos citam valores por template ({nome}) resolvidos em lib/learning.
 */

export type CycleId = 'c1' | 'c2' | 'c3' | 'c4';

/** Ícone de conceito (components/illustrations/ConceptIcon). */
export type ConceptIconName =
  | 'need'
  | 'want'
  | 'wait'
  | 'money'
  | 'price'
  | 'change'
  | 'care'
  | 'shared'
  | 'ad'
  | 'info'
  | 'persuade'
  | 'work'
  | 'good'
  | 'service'
  | 'income'
  | 'limit'
  | 'later'
  | 'choice'
  | 'trade'
  | 'save'
  | 'goal'
  | 'safe';

/** Família de cor do Design System. */
export type Tone = 'teal' | 'coral' | 'amber' | 'cyan' | 'purple' | 'green';

export type IllustrationKey = string;

// ---------- rastreabilidade ----------

/** Códigos de fonte usados na matriz curricular. */
export type SourceCode = 'FB1' | 'FB2' | 'AV-C' | 'AV-P' | 'MC' | 'BNCC';

export type SourceRef = { source: SourceCode; reference: string; role: 'principal' | 'complementar' };

/** N1 comum · N2 sensível · N3 alta sensibilidade (Child Safety Policy). */
export type Sensitivity = 'N1' | 'N2' | 'N3';

// ---------- Econominho ----------

export type GuideState = 'ask' | 'discover' | 'compare' | 'consequence' | 'summary' | 'reflect';
export type GuideLine = { state: GuideState; text: string };

// ---------- objetos de conteúdo de uma lição ----------

export type ExplanationObject = {
  type: 'explanation';
  title?: string;
  body: string;
  illustration?: IllustrationKey;
  bullets?: { icon?: ConceptIconName; tone?: Tone; text: string }[];
};

export type StoryPanel = { id: string; illustration: IllustrationKey; text: string };
export type DerivedValue = { name: string; expr: string };
export type StoryObject = {
  type: 'story';
  title?: string;
  /** Valores em reais citados nos textos; opcional. */
  values?: Record<string, number>;
  derived?: DerivedValue[];
  panels: StoryPanel[];
  question?: { prompt: string; options: { id: string; label: string; reflection: string }[] };
  closing?: string;
};

export type Concept = {
  id: string;
  label: string;
  short: string;
  description: string;
  icon: ConceptIconName;
  tone: Tone;
  examples?: { label: string; illustration: IllustrationKey }[];
};
export type ConceptsObject = {
  type: 'concepts';
  title?: string;
  intro?: string;
  concepts: Concept[];
  keyIdea?: string;
  keyIdeaIllustration?: IllustrationKey;
};

export type ActivityCategory = {
  id: string;
  label: string;
  short: string;
  icon: ConceptIconName;
  tone: Tone;
};

export type ClassifyItem = {
  id: string;
  label: string;
  situation: string;
  illustration?: IllustrationKey;
  accepted: string[];
  feedback: string;
  contextNote?: string;
};
export type ClassifyObject = {
  type: 'classify';
  prompt?: string;
  instructions?: string;
  categories: ActivityCategory[];
  items: ClassifyItem[];
};

export type PricedProduct = {
  id: string;
  label: string;
  price: number;
  illustration: IllustrationKey;
};
export type CompareObject = {
  type: 'compare';
  prompt: string;
  target: 'most' | 'least';
  products: PricedProduct[];
  feedback: string;
};
export type AffordObject = {
  type: 'afford';
  prompt: string;
  budget: number;
  products: PricedProduct[];
  feedback: string;
};
export type ChangeObject = {
  type: 'change';
  prompt: string;
  paid: number;
  product: PricedProduct;
  options: number[];
  feedback: string;
};

/** Escolha reflexiva: toda opção é válida, cada uma com sua consequência. */
export type ChoiceObject = {
  type: 'choice';
  prompt: string;
  illustration?: IllustrationKey;
  options: { id: string; label: string; reflection: string }[];
  note?: { title: string; body: string };
};

/** Ordenação: colocar passos/etapas na ordem certa. */
export type OrderingObject = {
  type: 'ordering';
  prompt: string;
  instructions?: string;
  items: { id: string; label: string; illustration?: IllustrationKey }[];
  /** Ordem correta (ids). A tela embaralha para apresentar. */
  correct: string[];
  feedback: string;
};

/** Verdadeiro ou falso contextualizado — nunca pegadinha. */
export type TrueFalseObject = {
  type: 'trueFalse';
  prompt?: string;
  statements: { id: string; text: string; isTrue: boolean; explanation: string }[];
};

export type QuizKind = 'recognition' | 'situation' | 'decision' | 'explanation';
export type QuizQuestion = {
  id: string;
  kind: QuizKind;
  prompt: string;
  illustration?: IllustrationKey;
  options: { id: string; label: string; feedback?: string }[];
  answer: { type: 'single'; correctOptionId: string } | { type: 'open' };
  explanation: string;
};
export type QuizObject = { type: 'quiz'; title?: string; questions: QuizQuestion[] };

export type ReflectionObject = {
  type: 'reflection';
  state: GuideState;
  text: string;
  body?: string;
};

export type LessonObject =
  | ExplanationObject
  | StoryObject
  | ConceptsObject
  | ClassifyObject
  | CompareObject
  | AffordObject
  | ChangeObject
  | ChoiceObject
  | OrderingObject
  | TrueFalseObject
  | QuizObject
  | ReflectionObject;

export type LessonObjectType = LessonObject['type'];

// ---------- lição ----------

export type Lesson = {
  id: string;
  cycle: CycleId;
  module: string;
  order: number;
  title: string;
  headline: string;
  objectives: string[];
  competencies: string[];
  sources: SourceRef[];
  sensitivity: Sensitivity;
  estimatedMinutes: number;
  /** Fala de abertura do Econominho (opcional). */
  guide?: GuideLine;
  content: LessonObject[];
  /** Síntese curta ao fim da lição (1 a 3 ideias). */
  summary: string[];
};

// ---------- módulo ----------

export type Module = {
  id: string;
  cycle: CycleId;
  order: number;
  /** Código curricular, ex.: "C1.1". */
  code: string;
  title: string;
  headline: string;
  summary: string;
  /** Imagem temática do Econominho (m01..m04) ou ausente. */
  theme?: string;
  competencies: string[];
  /** Avaliação integradora do módulo. */
  integrative: { title: string; intro: string; object: LessonObject };
  conclusion: {
    title: string;
    message: string;
    recap: { icon: ConceptIconName; tone: Tone; text: string }[];
  };
};

/** Pacote de um módulo: metadados + lições na ordem. */
export type ModuleBundle = { module: Module; lessons: Lesson[] };

// ---------- catálogo e ciclo ----------

export type ModuleRef = { id: string; status: 'available' | 'soon' };
export type CycleEntry = {
  id: CycleId;
  label: string;
  ageRange: string;
  description: string;
  status: 'available' | 'soon';
  modules: ModuleRef[];
};
export type Catalog = { cycles: CycleEntry[] };

export type CycleSummary = {
  cycle: CycleId;
  title: string;
  intro: string;
  discoveries: { text: string; icon: ConceptIconName; tone: Tone; module: string }[];
  guide: GuideLine;
  closing: string;
};

// ---------- textos de interface ----------

export type UiStrings = Record<string, string>;
