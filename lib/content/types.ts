/**
 * Tipos do conteúdo educacional do Econominho.
 *
 * O conteúdo vive em content/ como JSON, revisado editorialmente de forma
 * independente do código. Regra central: todo número que pode ser calculado
 * é calculado no código. Os textos citam valores por template ({nome}) e os
 * componentes mostram contas (saldo, troco, diferença) a partir dos números
 * declarados.
 */

export type CycleId = 'c1' | 'c2' | 'c3' | 'c4';

export type LessonStepId = 'story' | 'concept' | 'activity' | 'simulation' | 'quiz' | 'done';

/** Nome de uma ilustração do catálogo em components/illustrations. */
export type IllustrationKey = string;

/** Família de cor do Design System usada para diferenciar conceitos e categorias. */
export type Tone = 'teal' | 'coral' | 'amber' | 'cyan' | 'purple' | 'green';

/** Ícones de conceito (components/illustrations/ConceptIcon). */
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
  | 'choice';

// ---------- Econominho (função editorial) ----------

/**
 * Intenção de cada fala do guia. Define a expressão/pose futura do
 * personagem (docs/econominho-guide.md). Nunca há estado de "bronca" ou
 * "parabéns por guardar".
 */
export type GuideState = 'ask' | 'discover' | 'compare' | 'consequence' | 'summary' | 'reflect';

export type GuideLine = { state: GuideState; text: string };

/** Falas do Econominho em cada momento do módulo. */
export type ModuleGuide = {
  opening: GuideLine;
  story: GuideLine;
  concept: GuideLine;
  activity: GuideLine;
  simulation: GuideLine;
  quiz: GuideLine;
  done: GuideLine;
};

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

/** Página "O que descobrimos?" ao fim de um ciclo (content/<ciclo>/cycle.json). */
export type CycleSummary = {
  cycle: CycleId;
  title: string;
  intro: string;
  discoveries: { text: string; icon: ConceptIconName; tone: Tone; module: string }[];
  guide: GuideLine;
  closing: string;
};

// ---------- módulo ----------

export type Module = {
  id: string;
  cycle: CycleId;
  journeyId: string;
  /** Etapa da progressão do ciclo, na voz da criança (ex.: "Eu escolho"). */
  stage: string;
  title: string;
  headline: string;
  summary: string;
  competencies: { code: string; description: string }[];
  /** N1 (baixa) ou N2 (média): orienta a revisão editorial. */
  sensitivity: 'N1' | 'N2';
  objectives: string[];
  centralMessage: string;
  estimatedMinutes: number;
  illustration: IllustrationKey;
  cta: string;
  guide: ModuleGuide;
  conclusion: {
    title: string;
    message: string;
    recap: { icon: ConceptIconName; tone: Tone; text: string }[];
  };
};

// ---------- história ----------

export type StoryPanel = { id: string; illustration: IllustrationKey; text: string };

/** Valor calculado a partir de outros, ex.: { name: "troco", expr: "dinheiro - preco" }. */
export type DerivedValue = { name: string; expr: string };

export type Story = {
  title: string;
  /** Valores em reais citados na história. */
  values: Record<string, number>;
  /** Valores calculados, na ordem; podem usar valores e derivados anteriores. */
  derived: DerivedValue[];
  panels: StoryPanel[];
  question: {
    prompt: string;
    options: { id: string; label: string; reflection: string }[];
  };
  closing: string;
};

// ---------- conceito ----------

export type Concept = {
  id: string;
  label: string;
  short: string;
  description: string;
  icon: ConceptIconName;
  tone: Tone;
  examples: { label: string; illustration: IllustrationKey }[];
};

export type Infographic = {
  title: string;
  intro: string;
  concepts: Concept[];
  keyIdea: string;
  keyIdeaIllustration: IllustrationKey;
};

// ---------- atividade ----------

export type ActivityCategory = {
  id: string;
  label: string;
  short: string;
  icon: ConceptIconName;
  tone: Tone;
};

export type PricedProduct = {
  id: string;
  label: string;
  price: number;
  illustration: IllustrationKey;
};

/** Classificar uma situação em uma (ou mais) categorias. */
export type ClassifyItem = {
  kind: 'classify';
  id: string;
  label: string;
  situation: string;
  illustration?: IllustrationKey;
  /** Mais de uma resposta quando o contexto muda a classificação. */
  accepted: string[];
  feedback: string;
  contextNote?: string;
};

/** "Qual custa mais/menos?" A resposta é calculada pelos preços. */
export type CompareItem = {
  kind: 'compare';
  id: string;
  prompt: string;
  target: 'most' | 'least';
  products: PricedProduct[];
  feedback: string;
};

/** "Tenho R$ X. O que posso comprar?" Valem todas as opções que cabem. */
export type AffordItem = {
  kind: 'afford';
  id: string;
  prompt: string;
  budget: number;
  products: PricedProduct[];
  feedback: string;
};

/** "Quanto sobra / qual é o troco?" A resposta é paid - price. */
export type ChangeItem = {
  kind: 'change';
  id: string;
  prompt: string;
  paid: number;
  product: PricedProduct;
  options: number[];
  feedback: string;
};

export type ActivityItem = ClassifyItem | CompareItem | AffordItem | ChangeItem;

export type Activity = {
  title: string;
  instructions: string;
  /** Obrigatório quando há itens "classify". */
  categories: ActivityCategory[];
  items: ActivityItem[];
};

// ---------- simulação ----------

export type SpendOption = {
  id: string;
  label: string;
  cost: number;
  illustration: IllustrationKey;
  now: string;
  later: string;
};

/** Escolher uma opção com um valor fictício; o que sobra vai para a meta ou vira troco. */
export type SpendSimulation = {
  kind: 'spend';
  title: string;
  /** Pode citar {budget}. */
  intro: string;
  budget: number;
  goal?: { label: string; price: number; saved: number; illustration: IllustrationKey };
  leftoverRule: string;
  options: SpendOption[];
  wrapUp: string;
};

/** O mesmo produto apresentado de dois jeitos. */
export type PresentationSimulation = {
  kind: 'presentation';
  title: string;
  intro: string;
  product: { label: string; illustration: IllustrationKey; facts: string[] };
  versions: {
    id: string;
    label: string;
    style: 'plain' | 'loud';
    headline: string;
    lines: string[];
  }[];
  question: {
    prompt: string;
    options: { id: string; label: string; reflection: string }[];
  };
  wrapUp: string;
};

export type BudgetItem = {
  id: string;
  label: string;
  cost: number;
  illustration: IllustrationKey;
  /** Comprar agora e pagar depois: parte agora, parte no próximo período. */
  payLater?: { now: number; later: number };
};

/** Orçamento simples: escolher várias opções sem passar do valor disponível. */
export type BudgetSimulation = {
  kind: 'budget';
  title: string;
  /** Pode citar {budget} e {nextBudget}. */
  intro: string;
  budget: number;
  /** Valor do próximo período, para mostrar o compromisso de "pagar depois". */
  nextBudget?: number;
  nextLabel?: string;
  items: BudgetItem[];
  wrapUp: string;
};

export type Simulation = SpendSimulation | PresentationSimulation | BudgetSimulation;

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
