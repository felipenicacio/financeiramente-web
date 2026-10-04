# Design System do Econominho

Fonte única: `styles/globals.css` (tokens CSS usados pelo Tailwind) e `theme/tokens.ts` (mesma paleta para SVGs, manifest e metadata). O teste `theme/tokens.test.ts` garante que os dois não divergem.

## Princípios

- **Uma tarefa por tela.** Título curto, uma decisão, ação principal no rodapé.
- **Clareza antes de densidade.** Muito espaço em branco, poucos elementos simultâneos.
- **Cor com função.** Hierarquia, categoria, feedback e progresso. Nunca decorativa, nunca sozinha.
- **Sem julgamento.** Nenhum vermelho de "erro" nas lições; resposta inesperada usa o tom de conversa (ciano, "Vamos pensar juntos").
- **Mesma marca da infância à adolescência.** O botão principal é navy, não colorido: funciona igual para 6 e para 17 anos.

## Cores

| Papel                            | Token                                                   | Valor           |
| -------------------------------- | ------------------------------------------------------- | --------------- |
| Texto principal, botão principal | `ink` / `navy`                                          | `#0F172A`       |
| Texto secundário                 | `ink-soft` / `slate`                                    | `#334155`       |
| Texto de apoio                   | `ink-muted`                                             | `#64748B`       |
| Fundo                            | `background`                                            | `#F8FAFC`       |
| Superfícies (cards)              | `surface`                                               | `#FFFFFF`       |
| Acento do ciclo                  | `accent`, `accent-strong`, `accent-soft`, `accent-tint` | varia por ciclo |

Escalas tonais (50 / 100 / 500 / 700) existem para contraste WCAG AA: tons 500 servem para preenchimentos e ilustrações; **texto colorido usa sempre 700**.

### Tons de conteúdo e de retorno

Classes `.tone-*` definem `--tone`, `--tone-strong`, `--tone-soft`, `--tone-tint`, usadas como `bg-(--tone-soft)`, `text-(--tone-strong)`.

**Tons de conteúdo**: cada conceito, categoria e item de resumo declara no JSON um tom de uma família de cor: `tone-teal`, `tone-coral`, `tone-amber`, `tone-cyan`, `tone-purple`, `tone-green`. Exemplos no C1: Preciso (teal), Quero (coral), Posso esperar (amber); Dinheiro (teal), Preço (coral), Troco (amber), Cuidado (cyan); Anúncio (purple), Informação (cyan), Convencimento (coral); Renda (green), Pagar depois (purple).

**Tons de retorno** (semânticos, fixos):

| Classe          | Uso                                                 | Base  |
| --------------- | --------------------------------------------------- | ----- |
| `tone-positive` | Resposta esperada, "também combina", "combina mais" | Green |
| `tone-guide`    | "Vamos pensar juntos", "Depois"                     | Cyan  |
| `tone-neutral`  | Perguntas abertas, reflexão                         | Slate |

Todo tom vem acompanhado de **ícone próprio** (`ConceptIcon`: casa, coração, ampulheta, moeda, etiqueta, troco, escudo, megafone, lupa, brilho, maleta, caixa, mãos, carteira, pote, calendário, caminho) e de rótulo: a cor nunca é a única pista.

## Expressão por ciclo

`data-cycle="c1…c4"` em qualquer elemento troca as variáveis abaixo para todos os descendentes.

| Ciclo                | Faixa | Acento | Escala de texto | Escala de raio | Apoio visual |
| -------------------- | ----- | ------ | --------------- | -------------- | ------------ |
| C1 Descoberta        | 6–8   | Teal   | 1.10            | 1.15           | alto         |
| C2 Escolhas          | 9–11  | Cyan   | 1.05            | 1.00           | alto         |
| C3 Autonomia inicial | 12–14 | Purple | 1.00            | 0.85           | médio        |
| C4 Vida econômica    | 15–17 | Slate  | 1.00            | 0.70           | baixo        |

A tela de idades mostra as quatro expressões lado a lado.

## Marca

Fonte: assets individuais aprovados (v2), gerados um a um, sem recortes de folhas de personagem. O manifesto é `public/econominho/assets.json`.

| Arquivo                                         | Uso                                                                                   |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| `public/econominho/logo/wordmark-v2.png`        | Logotipo original aprovado                                                            |
| `public/econominho/logo/wordmark-v2-header.png` | Mesma arte, reduzida (640 px) para o cabeçalho (`Brand`) e a imagem Open Graph        |
| `public/econominho/character/*-v2.png`          | Personagem: avatar de fala por estado, poses de módulo e corpo inteiro                |
| `public/brand/econominho-icon.svg`              | **Pendente de versão v2:** origem de `public/icons/*` e `favicon.ico` (ver limitação) |

**Limitação conhecida:** ainda não existe um ícone de aplicativo (favicon, ícones do PWA) aprovado na linha v2. Enquanto isso, os ícones usam o "E" técnico anterior. Trocar exige um arquivo de ícone aprovado; depois, `node scripts/generate-icons.mjs`.

Cores da marca: navy `#0B3B75` e amarelo `#FFC83D`. Ficam restritas ao logotipo e aos ícones; a interface continua usando a paleta abaixo.

Para regenerar favicon e ícones do PWA depois de mudar o ícone: `node scripts/generate-icons.mjs`. A `og.png` usa o wordmark v2.

Nome visível: **Econominho**. Identificadores técnicos (repositório, pacote, domínio, prefixo de cache `fm-`) continuam com o nome anterior nesta etapa.

## Tipografia

Lexend variável (100–900), local. Escala com razão ~1,25, multiplicada por `--type-scale`:

| Token          | Base | Uso                             |
| -------------- | ---- | ------------------------------- |
| `text-display` | 34px | Títulos de página               |
| `text-title`   | 26px | Título de tela da lição         |
| `text-heading` | 20px | Seções                          |
| `text-lead`    | 18px | Texto de história, alternativas |
| `text-body`    | 16px | Texto corrido                   |
| `text-label`   | 15px | Botões, rótulos                 |
| `text-caption` | 13px | Contadores, apoio               |

Sem caixa-alta em rótulos. Títulos com `text-wrap: balance`.

## Forma e profundidade

| Token             | Base  | Uso                             |
| ----------------- | ----- | ------------------------------- |
| `rounded-hero`    | 28px  | Ilustrações e blocos principais |
| `rounded-card`    | 20px  | Cards e alternativas            |
| `rounded-control` | 14px  | Elementos internos              |
| `rounded-full`    | —     | Botões (pílula), badges         |
| `shadow-card`     | sutil | Cards em repouso                |
| `shadow-raised`   | média | Hover, botão principal          |

## Movimento

| Utilitário           | Uso                                               |
| -------------------- | ------------------------------------------------- |
| `animate-enter`      | Fade + subida curta (feedback, blocos novos)      |
| `animate-enter-side` | Fade + deslize lateral (troca de quadro/pergunta) |
| `animate-pop`        | Check e badge de seleção                          |
| `animate-grow`       | Trecho novo na barra da meta                      |

Duração 320–700 ms, sem loop. `prefers-reduced-motion: reduce` reduz todas as animações a 1 ms.

## Componentes

| Componente                                               | Papel                                                                                                                        |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `PageContainer`                                          | Largura máxima: `reading` (40rem) para lições, `wide` (64rem) para listas                                                    |
| `AppHeader`, `SiteFooter`, `SkipLink`                    | Estrutura das páginas de navegação                                                                                           |
| `Button`, `ButtonLink` (`primary`, `secondary`, `quiet`) | Altura mínima 56px                                                                                                           |
| `CycleCard`, `JourneyCard`, `ModuleCard`                 | Navegação de conteúdo                                                                                                        |
| `LessonShell` + `ScreenTitle`                            | Trilha de progresso, conteúdo, ações fixas no rodapé, foco no título a cada tela                                             |
| `ProgressIndicator`                                      | Seis segmentos + nome da etapa + texto para leitor de tela                                                                   |
| `ChoiceCard`                                             | Alternativa (`aria-pressed`) com estados: `idle`, `selected`, `chosen-ok`, `chosen-rethink`, `also-ok`, `expected`, `dimmed` |
| `FeedbackCard`                                           | Retorno imediato (`role="status"`), rola até ficar visível                                                                   |
| `StoryCard`, `ConceptCard`                               | Quadro da história; conceito com ícone, tom e exemplos                                                                       |
| `GoalMeter`                                              | Pote da meta (`role="meter"`), valor em texto e barra                                                                        |
| `SimulationPanel`                                        | Recurso, gasto, saldo, agora e depois                                                                                        |
| `QuizQuestion`                                           | Pergunta com retorno; aberta aceita qualquer opção                                                                           |
| `Illustration`, `ConceptIcon`                            | SVGs inline; nome desconhecido vira forma neutra                                                                             |
| `EconominhoGuide`                                        | Fala do guia (`bubble` ou `inline`); avatar provisório neutro, ver [econominho-guide.md](econominho-guide.md)                |
| `CycleProgress`                                          | Módulos concluídos nesta visita (só informa, não bloqueia)                                                                   |
| Simulações                                               | `spend` (troco/meta), `presentation` (versão `plain` × `loud`), `budget` (várias escolhas e pagar depois)                    |

## Acessibilidade (WCAG 2.1 AA como referência)

- Contraste AA verificado com axe-core em todas as páginas.
- Foco visível em todos os elementos (`outline` ciano 3px).
- Link "Pular para o conteúdo", landmarks (`header`, `main`, `nav`, `footer`), um `h1` por tela.
- A cada tela interna, o foco vai para o título (`ScreenTitle`) e a página volta ao topo.
- Alvos de toque ≥ 44px (botões principais 56px).
- Texto em `rem`: respeita zoom e tamanho de fonte do sistema.
- Estados nunca só por cor: badges com texto ("Sua escolha", "Também combina", "Combina mais") e ícones.
- Ilustrações decorativas ficam fora da árvore de acessibilidade; a informação está no texto.
