# Diretrizes editoriais

Valem para todo conteúdo do Econominho. A revisão humana confere estas regras; parte delas também é verificada por teste (`lib/validation/__tests__/content.test.ts`).

## Princípios

- **Educação antes de prescrição.** O conteúdo explica e mostra consequências; não diz o que a criança deve fazer com dinheiro.
- **Contexto antes de regra.** A mesma coisa pode mudar de categoria (um casaco é preciso no frio e pode esperar no calor).
- **Consequência antes de julgamento.** "Se você escolher X, acontece Y." Nunca "errado", "má escolha", "escolha correta".
- **Escolhas não são moralizadas.** Gastar não é errado. Guardar não é sempre certo. Querer algo é normal.
- **Sem prêmio por poupar, sem punição por consumir.** Nenhuma tela comemora guardar mais nem lamenta gastar.

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

| Situação                    | Título                     | Tom                    |
| --------------------------- | -------------------------- | ---------------------- |
| Resposta esperada           | "Isso mesmo!"              | Verde                  |
| Resposta diferente          | "Vamos pensar juntos"      | Ciano (nunca vermelho) |
| Pergunta aberta ou reflexão | "Boa escolha para pensar!" | Neutro                 |

Quando a resposta da criança não é a esperada, o retorno explica o porquê da situação, sem dizer que ela errou. Opções de quiz que representam ideias equivocadas ("Ele não devia querer") recebem `feedback` próprio que desfaz a ideia.

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
- [ ] Nenhuma escolha financeira é tratada como certa ou errada em si.
- [ ] Pelo menos uma situação mostra que o contexto muda a resposta, quando fizer sentido.
- [ ] Quiz mistura reconhecimento, cenário, escolha e justificativa, com uma pergunta aberta.
- [ ] Falas do Econominho são perguntas, descobertas, comparações ou resumos.
- [ ] Sem marcas, sem estigma, sem estereótipo.
- [ ] Texto lido em voz alta soa natural para uma criança de 6 a 8 anos.
