# Arquitetura de conteúdo (currículo v2.0)

Todo o conteúdo educacional fica em `content/`, separado do código. Componentes não têm textos educacionais fixos; textos de interface (botões, rótulos) ficam em `content/ui.json`.

A hierarquia é **ciclo → módulo → lição → objetos**. Cada ciclo tem 6 módulos, cada módulo tem 5 lições, cada lição tem de 2 a 4 objetos educacionais de tipos variados. O módulo fecha com uma avaliação integradora e a síntese "O que descobrimos?".

```
content/
  catalog.json          ciclos → módulos (status available | soon)
  ui.json               textos de interface
  c1/
    cycle.json          página "O que descobrimos?" do ciclo
    m01/ … m06/
      module.json       metadados, competências, avaliação integradora, conclusão
      lessons/
        l01.json … l05.json   uma lição: rastreabilidade + objetos + síntese
```

## Ciclo C1 (6–8 anos) — Descoberta

| Módulo | Título                              | Competências                       | Tema |
| ------ | ----------------------------------- | ---------------------------------- | ---- |
| C1.1   | O dinheiro está por toda parte      | F-D4-C1-01, F-D7-C1-01             | m02  |
| C1.2   | Quero, preciso ou posso esperar?    | F-D1-C1-01, F-D5-C1-01             | m01  |
| C1.3   | Preço, comparação e troco           | F-D4-C1-01, F-D5-C1-01             | m02  |
| C1.4   | Trabalho, renda, bens e serviços    | F-D7-C1-01                         | m04  |
| C1.5   | Guardar e cuidar                    | F-D8-C1-01, F-D5-C1-01             | —    |
| C1.6   | Escolhas, influência e convivência  | F-D2-C1-01, F-D8-C1-01, F-D9-C1-01 | m03  |

Navegação livre: módulos e lições podem ser abertos em qualquer ordem. Nada é bloqueado e nada é salvo entre visitas.

## A lição (`lessons/lNN.json`)

Campos: `id`, `cycle`, `module`, `order` (1–5), `title`, `headline`, `objectives[]`, `competencies[]`, `sources[]`, `sensitivity` (`N1`/`N2`/`N3`), `estimatedMinutes`, `guide?` (fala de abertura do Econominho), `content[]` (os objetos) e `summary[]` (1 a 3 ideias de fecho).

Rastreabilidade obrigatória por lição:

- **Competências**: códigos da matriz (`F-Dn-Cn-nn`), validados contra a lista de 36.
- **Fontes** (`sources`): `source` (`FB1`, `FB2`, `AV-C`, `AV-P`, `MC`, `BNCC`), `reference` (texto legível) e `role` (`principal`/`complementar`). Nenhum código de capítulo/página inventado.
- **Sensibilidade**: `N1` comum, `N2` sensível, `N3` alta sensibilidade (Child Safety Policy).

## Objetos de conteúdo (`content[]`)

Discriminados por `type`. O motor (`components/learning/LessonRunner.tsx`) achata os objetos em telas: `classify` vira uma tela por item, `quiz` uma tela por pergunta, os demais uma tela cada. Telas interativas liberam o avanço só depois da resposta.

| `type`        | Papel           | Interativo | Retorno                                                     |
| ------------- | --------------- | ---------- | ----------------------------------------------------------- |
| `explanation` | explicar        | não        | —                                                           |
| `story`       | situação        | se tem pergunta | reflexão da opção escolhida                            |
| `concepts`    | explicar        | não        | ideia-chave                                                 |
| `reflection`  | provocar        | não        | fala do Econominho                                          |
| `classify`    | classificar     | sim        | `accepted` (uma ou mais; mais de uma pede `contextNote`)    |
| `compare`     | comparar preços | sim        | calculado por `target` (`most`/`least`); empate é erro      |
| `afford`      | cabe no valor?  | sim        | compara ao `budget`; mostra sobra ou falta                  |
| `change`      | troco           | sim        | `paid - product.price`; precisa estar em `options`          |
| `choice`      | escolha reflexiva | sim      | toda opção é válida, cada uma com sua consequência          |
| `ordering`    | ordenar passos  | sim        | compara com `correct[]`                                     |
| `trueFalse`   | verdadeiro/falso| sim        | `isTrue` por afirmação, nunca pegadinha                     |
| `quiz`        | recapitular     | sim        | `single` (uma certa) ou `open` (qualquer resposta reflete)  |

## O módulo (`module.json`)

Campos: `id`, `cycle`, `order`, `code` (ex. `C1.1`), `title`, `headline`, `summary`, `theme?` (`m01`–`m04`, imagem temática do Econominho), `competencies[]`, `integrative` (`title`, `intro`, `object`: um objeto de conteúdo, em geral um `quiz`) e `conclusion` (`title`, `message`, `recap[]` com ícone, tom e texto).

O fechamento (`/aprender/<ciclo>/<módulo>/fechamento`) roda a avaliação integradora e mostra "O que descobrimos?". Sem nota, sem percentual, sem certificado.

## Valores em dinheiro

Regra: **número que aparece na tela e pode ser calculado é calculado no código.**

- História (`story`): `values` declara os números; `derived` declara contas com expressão simples (`+`, `-`, `*`, parênteses), avaliada sem `eval` por `lib/learning/expr.ts`. Os textos citam `{nome}`.
- Atividades de preço: contas em `lib/learning` (`affordResult`, `changeAnswer`, `compareAnswer`).
- Cenas ilustradas recebem valores formatados por parâmetro; nenhum SVG tem número fixo.

## Econominho

Guia pedagógico único (personagem aprovado, pacote `econominho-assets-v1`, em `public/econominho/`). Fala por estados: `ask`, `discover`, `compare`, `consequence`, `summary`, `reflect`. Nunca dá ordens financeiras. Regras de voz em [econominho-guide.md](econominho-guide.md).

## Regras codificadas em testes (`tests/content.test.ts`)

| Regra                                                            |
| ---------------------------------------------------------------- |
| Catálogo e ciclo válidos; C1 publica 6 módulos, 30 lições        |
| Cada módulo tem 5 lições na ordem 1–5                            |
| IDs de lição únicos                                              |
| Cada lição tem de 2 a 4 objetos                                 |
| Toda competência citada existe na matriz (36 códigos)            |
| Toda fonte usa código conhecido e tem referência                |
| Toda lição declara sensibilidade N1/N2/N3                        |
| Cada módulo fecha com avaliação integradora e síntese           |
| Assets oficiais do Econominho (avatares e temas) existem no disco |

As guardas editoriais e de privacidade seguem em `tests/privacy.test.ts` e nos schemas (`lib/validation/contentSchemas.ts`).

## Como publicar um novo módulo

1. Criar `content/<ciclo>/<módulo>/module.json` e `lessons/l01.json`…`l05.json`.
2. Registrar em `lib/content/registry.ts`.
3. Adicionar ao `content/catalog.json` com `"status": "available"`.
4. Criar ilustrações novas em `components/illustrations`, se necessário.
5. `npm run check` valida tudo (typecheck, lint, testes, build).
