# Diretrizes editoriais

Valem para todo conteúdo do Econominho. A revisão humana confere estas regras; parte delas também é verificada por teste (`lib/validation/__tests__/content.test.ts`).

## Princípios

- **Educação antes de prescrição.** O conteúdo explica e mostra consequências; não diz o que a criança deve fazer com dinheiro.
- **Contexto antes de regra.** A mesma coisa pode mudar de categoria (um casaco é preciso no frio e pode esperar no calor).
- **Consequência antes de julgamento, só nas escolhas reflexivas (`choice`).** "Se você escolher X, acontece Y." Nunca "errado", "má escolha", "escolha correta" — porque ali toda opção é válida, não existe gabarito.
- **Escolhas de comportamento não são moralizadas.** Gastar não é errado. Guardar não é sempre certo. Querer algo é normal. Isso vale para `choice` (decisões sobre o que fazer com o dinheiro) — não para conceito/fato (ver "Acerto e erro em atividades objetivas" abaixo).
- **Sem prêmio por poupar, sem punição por consumir.** Nenhuma tela comemora guardar mais nem lamenta gastar.

## Acerto e erro em atividades objetivas

`quiz`, `trueFalse`, `classify`, `compare`, `afford`, `change` e `ordering` têm uma resposta conceitualmente certa (um fato, um cálculo, uma categoria). Nessas atividades — diferente das escolhas reflexivas (`choice`) acima — **o retorno precisa dizer com clareza se a resposta está certa ou errada**. Não esconder o erro só para manter um tom acolhedor: acolhimento não pode gerar ambiguidade.

Proibido no caminho de erro: "Isso mesmo", "Muito bem", "Perfeito", "Correto", "Boa escolha", "Exatamente"/"Exato", ou qualquer frase equivalente de acerto — mesmo embutida dentro do texto de explicação/feedback, não só no título. Isso é especialmente importante porque o texto de `explanation`/`feedback` dessas atividades costuma ser o mesmo mostrado tanto para quem acertou quanto para quem errou (o sinal de certo/errado vem do título "Isso mesmo!"/"Essa não é a resposta certa."); escrever esse texto como se a resposta certa já tivesse sido dada ("Isso mesmo: ...") produz uma contradição quando mostrado a quem errou.

## Padrão de aprendizagem

```
SITUAÇÃO → PERGUNTA → EXPLICAÇÃO → ESCOLHA OU COMPARAÇÃO → CONSEQUÊNCIA → REFLEXÃO
```

Evitar: situação → julgamento → resposta correta imposta.

## Tom de voz (C1, 6–8 anos)

| Usar                                                 | Evitar                                     |
| ---------------------------------------------------- | ------------------------------------------ |
| Frases curtas, uma ideia por frase                   | Frases longas com várias ideias            |
| Português do Brasil, vocabulário do dia a dia        | Termos técnicos ("otimização de recursos") |
| Exemplos concretos (feira, papelaria, passeio)       | Abstrações sem exemplo                     |
| Perguntas simples ("Será que isso é preciso agora?") | Perguntas com dupla negação                |
| "O dinheiro é limitado, então precisamos escolher."  | "Recursos escassos exigem priorização."    |

Limites validados: rótulo até 40 caracteres, linha até 90, parágrafo até 220.

## Retornos (feedback)

| Situação                                   | Título                          | Tom                    |
| ------------------------------------------- | -------------------------------- | ---------------------- |
| Atividade objetiva, resposta certa          | "Isso mesmo!"                    | Verde                  |
| Atividade objetiva, resposta errada         | "Essa não é a resposta certa."   | Ciano (nunca vermelho) |
| Escolha reflexiva (`choice`), qualquer opção | "Boa escolha para pensar!"       | Neutro                 |

Em atividade objetiva, o retorno sempre deixa claro se a resposta está certa ou errada (ver "Acerto e erro em atividades objetivas" acima) — nunca com linguagem que soe como acerto no caminho de erro. Em escolha reflexiva, não existe "errado": o retorno explica a consequência da opção escolhida, sem julgamento. Opções de quiz que representam ideias equivocadas ("Ele não devia querer") recebem `feedback` próprio que desfaz a ideia, com o mesmo cuidado de não soar como confirmação de acerto quando a opção é a errada.

## Personagens

No máximo quatro crianças recorrentes no C1: **Téo** (M01), **Nina** (M02), **Bia** (M03 e citada no M01/M04), **Caio** (M04 e citado no M03). Adultos aparecem por nome e ocupação, com profissões distribuídas sem estereótipo de gênero (motorista Lúcia, cozinheiro Luís, técnica Rita, enfermeira Sônia, professora Marta, padeiro Jorge, marceneiro Davi).

Evitar: estereótipos sociais ou de gênero, classe social identificável, marcas de consumo, situações humilhantes. Diversidade presente sem virar tema.

## Dinheiro e família

- Valores pequenos e redondos (R$ 2, R$ 5, R$ 8, R$ 10, R$ 15, R$ 20, R$ 30).
- Sem salário real, conta real, pobreza ou dívida grave.
- Nunca "famílias pobres" ou "famílias ricas". Usar "o dinheiro que a família tem não é infinito".
- Renda: "o dinheiro que uma pessoa ou família recebe, de diferentes formas". O trabalho é uma das formas, não a única.
- Pagar depois: "o pagamento continua existindo". Sem juros no C1.
- Preço não indica qualidade: "um preço maior não quer dizer melhor".

## Publicidade (M03)

- Publicidade não é apresentada como mentira.
- Separar **informação** (dá para conferir) de **convencimento** (tenta fazer querer). Uma frase pode ser as duas coisas.
- Querer algo depois de um anúncio é normal.
- Sem marcas reais, nem em produtos fictícios.

## Números

Valores derivados (troco, quanto falta, quanto sobra) nunca são digitados: usam variáveis `{nome}` calculadas pelo código. Ver [content-architecture.md](content-architecture.md#valores-em-dinheiro).

## Checklist de revisão de um módulo

- [ ] Segue o padrão situação → … → reflexão.
- [ ] Nenhuma escolha financeira (`choice`) é tratada como certa ou errada em si.
- [ ] Em atividades objetivas (quiz, trueFalse, classify, compare, afford, change, ordering), nenhum `explanation`/`feedback` compartilhado entre certo e errado usa "Isso mesmo", "Exato(amente)", "Correto" ou equivalente — esse texto some com o sinal de acerto quando mostrado no caminho de erro.
- [ ] Pelo menos uma situação mostra que o contexto muda a resposta, quando fizer sentido.
- [ ] Quiz mistura reconhecimento, cenário, escolha e justificativa, com uma pergunta aberta.
- [ ] Falas do Econominho são perguntas, descobertas, comparações ou resumos.
- [ ] Sem marcas, sem estigma, sem estereótipo.
- [ ] Texto lido em voz alta soa natural para uma criança de 6 a 8 anos.
