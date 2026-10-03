/**
 * Tipos do conteúdo educacional.
 *
 * O conteúdo vive em content/ como JSON, revisado editorialmente de forma
 * independente do código. O formato é compatível com o app mobile
 * (felipenicacio/financeiramente-app), com uma extensão: valores em dinheiro
 * citados em textos são declarados como números e inseridos por template,
 * para que nenhum número derivado seja digitado à mão.
 */

export type CycleId = 'c1' | 'c2' | 'c3' | 'c4';

export type CategoryId = 'need' | 'want' | 'wait';

export type LessonStepId = 'story' | 'concept' | 'activity' | 'simulation' | 'quiz' | 'done';

/** Nome de uma ilustração do catálogo em components/illustrations. */
export type IllustrationKey = string;

// ---------- catálogo ----------

export type ModuleRef = { id: string; status: 'available' | 'soon' };

export type Journey = {
  id: string;
  title: string;
  description: string;
  modules: ModuleRef[];
};

export type CycleEntry = {
  id: CycleId;
  label: string;
  ageRange: string;
  description: string;
  status: 'available' | 'soon';
  journeys: Journey[];
};

export type Catalog = { cycles: CycleEntry[] };

// ---------- módulo ----------

export type Module = {
  id: string;
  cycle: CycleId;
  journeyId: string;
  title: string;
  headline: string;
  summary: string;
  competencies: string[];
  objectives: string[];
  centralMessage: string;
  estimatedMinutes: number;
  illustration: IllustrationKey;
  cta: string;
  conclusion: {
    title: string;
    message: string;
    recap: { category: CategoryId; text: string }[];
  };
};

// ---------- história ----------

export type StoryPanel = { id: string; illustration: IllustrationKey; text: string };

/**
 * Valores da história. Os textos citam esses números por template
 * ({gift}, {missingIfBuy}...) e o código calcula os derivados.
 */
export type StoryMoney = {
  gift: number;
  saved: number;
  goal: { label: string; price: number };
  temptation: { label: string; price: number };
};

export type Story = {
  title: string;
  money: StoryMoney;
  panels: StoryPanel[];
  question: {
    prompt: string;
    options: { id: string; label: string; reflection: string }[];
  };
  closing: string;
};

// ---------- conceito (infográfico) ----------

export type ConceptCategory = {
  id: CategoryId;
  label: string;
  short: string;
  description: string;
  examples: { label: string; illustration: IllustrationKey }[];
};

export type Infographic = {
  title: string;
  intro: string;
  categories: ConceptCategory[];
  keyIdea: string;
  keyIdeaIllustration: IllustrationKey;
};

// ---------- atividade ----------

export type ActivityItem = {
  id: string;
  label: string;
  situation: string;
  illustration: IllustrationKey;
  /** Respostas aceitas. Mais de uma quando o contexto muda a classificação. */
  accepted: CategoryId[];
  feedback: string;
  /** Explica por que a resposta pode mudar dependendo da situação. */
  contextNote?: string;
};

export type Activity = {
  title: string;
  instructions: string;
  items: ActivityItem[];
};

// ---------- simulação ----------

export type SimulationOption = {
  id: string;
  label: string;
  cost: number;
  illustration: IllustrationKey;
  now: string;
  later: string;
};

export type Simulation = {
  title: string;
  /** Pode citar {budget}; o valor vem do campo `budget`. */
  intro: string;
  budget: number;
  goal: { label: string; price: number; saved: number; illustration: IllustrationKey };
  /** O que acontece com o valor que sobra (ex.: vai para o pote da meta). */
  leftoverRule: string;
  options: SimulationOption[];
  wrapUp: string;
};

// ---------- quiz ----------

export type QuizKind = 'recognition' | 'situation' | 'decision' | 'explanation';

export type QuizOption = { id: string; label: string; feedback?: string };

export type QuizQuestion = {
  id: string;
  kind: QuizKind;
  prompt: string;
  illustration?: IllustrationKey;
  options: QuizOption[];
  /** Resposta esperada, ou pergunta aberta (de reflexão) em que todas as opções valem. */
  answer: { type: 'single'; correctOptionId: string } | { type: 'open' };
  explanation: string;
};

export type Quiz = { title: string; questions: QuizQuestion[] };

// ---------- textos de interface ----------

export type UiStrings = Record<string, string>;

/** Pacote completo de um módulo, já validado. */
export type ModuleBundle = {
  module: Module;
  story: Story;
  infographic: Infographic;
  activity: Activity;
  simulation: Simulation;
  quiz: Quiz;
};
