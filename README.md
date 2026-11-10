# domuscire — Casa inteligente

Protótipo narrativo de perguntas e respostas sobre uma residência experimental
inteligente. A introdução é encenada com animações geométricas — começa com a
tela totalmente preta e mostra a chegada, a casa e o interior. As falas do
narrador aparecem como legendas sobre a cena; comandos de cena são representados
visualmente, não exibidos como texto. Cada pergunta tem uma cutscene e oferece
três escolhas.

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