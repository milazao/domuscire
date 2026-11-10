# domuscire — Casa inteligente

Protótipo narrativo de perguntas e respostas sobre uma residência experimental
inteligente. As descrições das cenas aparecem na tela; cada pergunta é precedida
por uma cutscene, feita por um personagem e oferece três escolhas. As decisões
abrem caminhos diferentes na história.

## Como executar

Abra `index.html` em um navegador moderno ou inicie um servidor local na pasta:

```sh
python3 -m http.server 8000
```

Depois, acesse `http://localhost:8000`. Não há dependências de instalação.

## Controles

- **Jogar:** inicia a introdução; use **Continuar** ou **Enter** para avançar.
- **Pular introdução:** pula a abertura, mas mantém a cena da primeira pergunta.
- **Escolhas:** cada resposta leva a uma nova cena antes da próxima pergunta.
- **Configurações:** ativa ou desativa o som ambiente da chegada.
- **Créditos:** exibe a autoria do projeto.