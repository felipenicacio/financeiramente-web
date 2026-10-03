# Arquitetura de conteúdo

O conteúdo educacional fica em `content/`, separado do código. Componentes não têm textos educacionais fixos; textos de interface (botões, rótulos) ficam em `content/ui.json`.

```
content/
  catalog.json          ciclos → jornadas → módulos (status available | soon)
  ui.json               textos de interface
  c1/
    m01/
      module.json       metadados, objetivos, competências, conclusão
      story.json        história em quadros + pergunta "O que você faria?"
      infographic.json  conceito: três categorias + ideia-chave
      activity.json     situações para classificar
      simulation.json   simulação com valor fictício
      quiz.json         4 a 6 perguntas
```

## Compatibilidade com o app mobile

O formato é o mesmo do `felipenicacio/financeiramente-app` (branch `feature/initial-mobile-mvp`). Os textos aprovados do C1/M01 foram reaproveitados sem alteração pedagógica. Diferenças:

| Arquivo           | Diferença                                                        | Motivo                                              |
| ----------------- | ---------------------------------------------------------------- | --------------------------------------------------- |
| `story.json`      | Novo bloco `money`; textos citam `{gift}`, `{missingIfBuy}` etc. | Nenhum valor derivado digitado à mão                |
| `simulation.json` | `intro` cita `{budget}`                                          | Mesmo motivo                                        |
| `ui.json`         | Chaves próprias da web; `homeTrust` sem "funciona sem internet"  | O site só funciona offline nas páginas já visitadas |

Ao levar o formato de volta ao app, basta aplicar `fillTemplate` com `storyMoneyLabels` (em `lib/learning`).

## Valores em dinheiro

Regra: **número que aparece na tela e que pode ser calculado é calculado no código.**

- História: `money.gift`, `money.saved`, `money.goal.price`, `money.temptation.price` são declarados. `leftIfBuy`, `missingIfBuy`, `missingIfSave` saem de `storyValues()`.
- Simulação: `budget`, `goal.price`, `goal.saved`, `options[].cost` são declarados. Gasto, saldo, guardado e falta saem de `simulateChoice()`.
- As ilustrações das cenas recebem os valores formatados por parâmetro; nenhum SVG tem número fixo.

Variáveis aceitas:

| Arquivo           | Campo                                            | Variáveis                                                                                                   |
| ----------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `story.json`      | `panels[].text`, `question.options[].reflection` | `{gift}`, `{saved}`, `{goalPrice}`, `{temptationPrice}`, `{leftIfBuy}`, `{missingIfBuy}`, `{missingIfSave}` |
| `simulation.json` | `intro`                                          | `{budget}`                                                                                                  |

Variável desconhecida é erro de validação.

## Regras pedagógicas codificadas

| Regra                                                                              | Onde              |
| ---------------------------------------------------------------------------------- | ----------------- |
| Item com mais de uma resposta aceita precisa de `contextNote`                      | teste de conteúdo |
| A atividade usa as três categorias                                                 | teste de conteúdo |
| "Água para beber" é necessidade (ajuste validado)                                  | teste de conteúdo |
| Quiz tem ao menos uma pergunta `open`                                              | schema            |
| `correctOptionId` existe nas opções                                                | schema            |
| Opção da simulação não custa mais que o valor disponível; meta não começa atingida | schema            |
| Nenhum texto usa "você errou", "má escolha", "escolha correta", "escolha errada"   | teste de conteúdo |
| Limites de tamanho de texto para o C1 (título 90, parágrafo 220 caracteres)        | schema            |

## Tipos

`lib/content/types.ts` define `Catalog`, `Module`, `Story`, `Infographic`, `Activity`, `Simulation`, `Quiz` e `ModuleBundle`. Os schemas em `lib/validation/contentSchemas.ts` descrevem o mesmo formato em tempo de execução.

## Ilustrações

Campos `illustration` referenciam chaves de `components/illustrations`:

- itens (120×120): `item-toothbrush`, `item-bottle`, `item-stickers`, `item-robot`, `item-sneaker`, `item-ball`, `item-coat`, `item-pencils`, `item-icecream`, `item-car`, `item-jar`;
- cenas (320×200): `home-hero`, `module-three-choices`, `story-gift`, `story-jar`, `story-shop`, `story-crossroads`, `done-path`.

O teste de conteúdo falha se um módulo usar uma chave inexistente.

## Como publicar um novo módulo

1. Criar `content/<ciclo>/<módulo>/` com os seis arquivos.
2. Registrar em `lib/content/registry.ts`.
3. Adicionar a referência em `content/catalog.json` com `"status": "available"`.
4. Rodar `npm test` (valida tudo) e `npm run build` (gera as páginas).
5. Se precisar de ilustração nova, adicioná-la em `components/illustrations`.
