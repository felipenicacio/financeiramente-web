# Econominho, o guia

> **VISUAL DO PERSONAGEM — PENDENTE DE APROVAÇÃO**
>
> Este documento define a função pedagógica, a personalidade, o tom de voz, o uso no UX e os estados do Econominho. A arte é composta pelos PNGs individuais aprovados (v2) em `public/econominho/character/`, mapeados por estado em `components/econominho/assets.ts`.

## Função pedagógica

O Econominho acompanha a criança em cada módulo. Ele:

- faz perguntas;
- apresenta descobertas;
- ajuda a comparar;
- explica consequências;
- resume ideias;
- estimula reflexão.

Ele **não**:

- dá ordens financeiras ("compre", "guarde", "você deve");
- diz o que comprar ou recomenda produtos;
- diz que a criança errou;
- premia poupança ou pune consumo;
- age como chatbot: não conversa, não responde perguntas livres, não gera texto. Todas as falas são escritas, revisadas e aprovadas antes da publicação.

## Personalidade

Curioso, calmo e parceiro. Pensa junto, não sabe tudo antes. Usa "a gente" e "vamos". Não é professor de quadro-negro nem animador de auditório.

## Tom de voz

| Faz                 | Exemplo                                                           |
| ------------------- | ----------------------------------------------------------------- |
| Pergunta            | "Será que tudo que a gente quer precisa ser agora?"               |
| Convida a comparar  | "Vamos comparar? Escolha uma opção e veja o que acontece depois." |
| Aponta consequência | "O que muda se escolhermos esta opção? Veja o troco de cada uma." |
| Resume              | "Escolher também é decidir o que pode ficar para depois."         |
| Estimula reflexão   | "Qual dessas descobertas apareceu no seu dia hoje?"               |

Frases de até 90 caracteres, uma ideia por fala, sem exclamações em excesso.

## Uso no UX

| Onde                           | Variante | Campo                |
| ------------------------------ | -------- | -------------------- |
| Abertura do módulo             | `bubble` | `guide.opening`      |
| Primeiro quadro da história    | `inline` | `guide.story`        |
| Primeira tela do conceito      | `inline` | `guide.concept`      |
| Primeira situação da atividade | `inline` | `guide.activity`     |
| Tela inicial da simulação      | `inline` | `guide.simulation`   |
| Primeira pergunta do quiz      | `inline` | `guide.quiz`         |
| Conclusão do módulo            | `inline` | `guide.done`         |
| "O que descobrimos?"           | `bubble` | `cycle.json → guide` |

Uma fala por tela, no máximo. O guia nunca cobre a tarefa principal nem aparece no retorno de uma resposta (o retorno é do conteúdo, não do personagem).

## Estados necessários

Cada fala declara um `state`. A arte futura deve ter uma pose e uma expressão para cada um (mapeamento provisório em `components/econominho/assets.ts`):

| Estado        | Intenção                      | Pose sugerida | Expressão sugerida |
| ------------- | ----------------------------- | ------------- | ------------------ |
| `ask`         | Fazer uma pergunta            | pensando      | curioso            |
| `discover`    | Apresentar algo novo          | mostrando     | surpreso           |
| `compare`     | Convidar a comparar           | apontando     | atento             |
| `consequence` | Mostrar o que acontece depois | apontando     | atento             |
| `summary`     | Resumir                       | ideia         | contente           |
| `reflect`     | Estimular reflexão            | pensando      | calmo              |

Não existem estados de bronca, decepção ou comemoração por guardar dinheiro.

## Implementação

- Componente: `components/econominho/EconominhoGuide.tsx` (`text`, `state`, `variant`, `avatar` opcional).
- Arte: `components/econominho/assets.ts`. Com a aprovação, registrar um arquivo por estado em `avatar` e ativar `enabled`. Nenhum outro arquivo precisa mudar.
- Atributos `data-guide-state`, `data-guide-pose` e `data-guide-expression` ficam no HTML para orientar a arte e os testes.
- Acessibilidade: a fala é texto real (lido por leitor de tela, com o nome "Econominho"); a imagem do personagem será decorativa (`alt=""`).
