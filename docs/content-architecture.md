# Arquitetura de conteúdo

Todo o conteúdo educacional fica em `content/`, separado do código. Componentes não têm textos educacionais fixos; textos de interface (botões, rótulos) ficam em `content/ui.json`.

```
content/
  catalog.json          ciclos → jornadas → módulos (status available | soon)
  ui.json               textos de interface
  c1/
    cycle.json          página "O que descobrimos?" do ciclo
    m01/ … m04/
      module.json       abertura, competências, sensibilidade, falas do Econominho, conclusão
      story.json        história em quadros + pergunta
      infographic.json  conceitos (2 a 4) + ideia-chave
      activity.json     situações (4 a 8), em quatro formatos
      simulation.json   simulação, em três formatos
      quiz.json         4 a 6 perguntas, ao menos uma aberta
```

## Ciclo C1 (6–8 anos)

| Módulo                               | Etapa                         | Competências                       | Sensibilidade | Personagem |
| ------------------------------------ | ----------------------------- | ---------------------------------- | ------------- | ---------- |
| M01 Quero, preciso ou posso esperar? | Eu escolho                    | F-D1-C1-01, F-D5-C1-01             | N1            | Téo        |
| M02 Dinheiro, preço e cuidado        | Eu entendo dinheiro e preço   | F-D4-C1-01, F-D8-C1-01, F-D9-C1-01 | N2            | Nina       |
| M03 Publicidade e escolhas           | Eu percebo o que influencia   | F-D2-C1-01                         | N1            | Bia        |
| M04 Trabalho, renda e limites        | Eu entendo trabalho e limites | F-D3-C1-01, F-D6-C1-01, F-D7-C1-01 | N2            | Caio       |

Os módulos podem ser abertos em qualquer ordem. Não há desbloqueio nem progresso salvo.

## Padrão de cada módulo

| Momento             | Arquivo                                     | Padrão pedagógico     |
| ------------------- | ------------------------------------------- | --------------------- |
| Abertura            | `module.json` (`headline`, `guide.opening`) | Situação              |
| História + pergunta | `story.json`                                | Situação → pergunta   |
| Conceito + exemplos | `infographic.json`                          | Explicação            |
| Atividade           | `activity.json`                             | Escolha ou comparação |
| Simulação           | `simulation.json`                           | Consequência          |
| Quiz                | `quiz.json`                                 | Reflexão              |
| Conclusão           | `module.json` (`conclusion`, `guide.done`)  | Resumo                |

## Formatos

### Conceitos (`infographic.json`)

Cada conceito tem `id`, `label`, `short`, `description`, `icon` (ícone de conceito) e `tone` (`teal`, `coral`, `amber`, `cyan`, `purple`, `green`). O ícone garante que a cor nunca seja a única pista.

### Atividade (`activity.json`)

`categories` define as categorias de classificação (com ícone e tom). Cada item tem um `kind`:

| `kind`     | Pergunta                                        | Resposta                                                  |
| ---------- | ----------------------------------------------- | --------------------------------------------------------- |
| `classify` | Em qual categoria isso entra?                   | `accepted` (uma ou mais; mais de uma exige `contextNote`) |
| `compare`  | Qual custa mais/menos? (`target`)               | Calculada pelos preços; empate é erro de validação        |
| `afford`   | Tenho `{budget}`. O que posso comprar?          | Todas as opções que cabem; tela mostra sobra ou falta     |
| `change`   | Paguei `{paid}`, custa `{price}`. Quanto volta? | `paid - price`; precisa estar em `options`                |

### Simulação (`simulation.json`)

| `kind`         | Uso                                                         | O que o código calcula                                                   |
| -------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------ |
| `spend`        | Escolher uma opção (M01 com meta, M02 sem meta)             | gasto, saldo ou troco, quanto falta para a meta                          |
| `presentation` | Mesmo produto em duas versões, `plain` e `loud` (M03)       | lista do que é igual nas duas                                            |
| `budget`       | Várias escolhas com um valor (M04), com `payLater` opcional | o que sobra, o que não cabe, compromisso futuro, valor disponível depois |

### Resumo do ciclo (`cycle.json`)

Lista de descobertas (texto, ícone, tom e módulo de origem), fala do Econominho e fechamento. Sem pontuação e sem certificado.

## Valores em dinheiro

Regra: **número que aparece na tela e pode ser calculado é calculado no código.**

- História: `values` declara os números; `derived` declara contas com uma expressão simples (`+`, `-`, `*`, parênteses), avaliada sem `eval` por `lib/learning/expr.ts`. Os textos citam `{nome}`. Ex. (M02): `changeKite = money - kitePrice`.
- Simulações e atividades: contas feitas em `lib/learning` (`simulateChoice`, `budgetState`, `affordResult`, `changeAnswer`, `compareAnswer`).
- Cenas ilustradas recebem os valores formatados por parâmetro; nenhum SVG tem número fixo.

Variável desconhecida, valor derivado negativo, troco que não está nas opções e "pagar depois" que não soma o preço são erros de validação.

## Falas do Econominho (`module.json` → `guide`)

Sete momentos obrigatórios: `opening`, `story`, `concept`, `activity`, `simulation`, `quiz`, `done`. Cada fala tem `state` (`ask`, `discover`, `compare`, `consequence`, `summary`, `reflect`) e `text` (até 90 caracteres). Regras de voz em [econominho-guide.md](econominho-guide.md).

## Regras codificadas em testes

| Regra                                                                                           | Onde           |
| ----------------------------------------------------------------------------------------------- | -------------- |
| JSON de todos os módulos e do ciclo válidos; IDs únicos                                         | schema + teste |
| Todo módulo registrado está no catálogo e vice-versa                                            | teste          |
| Código de competência no formato `F-Dn-Cn-nn`, sem repetição                                    | schema + teste |
| Duração entre 8 e 12 minutos                                                                    | teste          |
| Ilustrações e ícones existentes                                                                 | teste          |
| Nenhum "R$ número" digitado em textos de história ou simulação                                  | teste          |
| Classificação com mais de uma resposta explica o contexto                                       | teste          |
| Quiz com 4–6 perguntas e ao menos uma aberta                                                    | schema         |
| Sem linguagem de julgamento ou estigma ("você errou", "má escolha", "famílias pobres/ricas"...) | teste          |
| Econominho sem ordens financeiras ("compre", "guarde", "você deve"...)                          | teste          |
| No máximo quatro crianças recorrentes                                                           | teste          |
| Ajustes validados do M01 ("Água para beber"; sem "bola nova" como exemplo; sem "garantida")     | teste          |

## Ilustrações

Campos `illustration` usam chaves de `components/illustrations` (itens 120×120 em `items.tsx` e `itemsC1.tsx`; cenas 320×200 em `scenes.tsx`). Sem marcas, sem pessoas desenhadas e sem números fixos. Ícones de conceito ficam em `ConceptIcon.tsx`.

## Como publicar um novo módulo

1. Criar `content/<ciclo>/<módulo>/` com os seis arquivos.
2. Registrar em `lib/content/registry.ts`.
3. Adicionar ao `content/catalog.json` com `"status": "available"`.
4. Criar ilustrações novas em `components/illustrations`, se necessário.
5. `npm test` valida tudo; `npm run build` gera as páginas.
