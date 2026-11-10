const perguntas = [
  // POSIÇÃO 0: a casa explica como o jogo funciona.
  {
    enunciado:
      "SISTEMA DA CASA: “Durante esta experiência, você conhecerá a residência por meio de perguntas e escolhas. Leia cada situação e selecione uma resposta para avançar. Algumas escolhas revelarão caminhos diferentes da história. Você entendeu como jogar?”",
    alternativas: [
      {
        texto: "Sim, entendi. Quero começar.",
        afirmacao: ["Confirmou que entendeu as instruções da casa."],
        proxima: 1
      },
      {
        texto: "Não entendi. Quero ver a explicação novamente.",
        afirmacao: ["Pediu para reiniciar a experiência e rever as instruções."],
        proxima: 0
      }
    ]
  },

  // POSIÇÃO 1: primeira escolha que divide a narrativa.
  {
    enunciado:
      "SISTEMA DA CASA: “Ótimo. Antes de iniciar a configuração, preciso saber como você pretende conviver com esta residência experimental. O que fará primeiro?”",
    alternativas: [
      {
        texto: "Quero experimentar os recursos da casa e descobrir o que ela consegue fazer.",
        afirmacao: ["Decidiu experimentar os recursos da casa inteligente."],
        proxima: 2
      },
      {
        texto: "Quero entender como a casa funciona e quais dados ela coleta.",
        afirmacao: ["Decidiu investigar o funcionamento e a privacidade da casa."],
        proxima: 3
      }
    ]
  },

  // POSIÇÃO 2: início da narrativa de experimentação.
  {
    enunciado:
      "As luzes acompanham seus passos e a temperatura muda suavemente. A interface da casa exibe: “Modo de adaptação ativado. Deseja testar o sistema de iluminação?”",
    alternativas: [
      {
        texto: "Sim. Quero testar a iluminação inteligente.",
        afirmacao: ["Aceitou testar a iluminação inteligente."],
        proxima: 4
      },
      {
        texto: "Prefiro explorar a casa primeiro.",
        afirmacao: ["Preferiu explorar a casa antes de testar seus recursos."],
        proxima: 4
      }
    ]
  },

  // POSIÇÃO 3: início da narrativa de investigação.
  {
    enunciado:
      "Você percebe pequenos indicadores acesos no painel. A casa informa: “Posso explicar minhas funções. Que informação deseja consultar primeiro?”",
    alternativas: [
      {
        texto: "Quero saber quais dados são registrados.",
        afirmacao: ["Perguntou quais dados a casa registra."],
        proxima: 4
      },
      {
        texto: "Quero saber como controlar os sistemas da residência.",
        afirmacao: ["Perguntou como controlar os sistemas da residência."],
        proxima: 4
      }
    ]
  },

  // Continuação provisória para demonstrar o encaminhamento das opções.
  {
    enunciado:
      "A interface principal acende e apresenta um novo aviso: “Configuração inicial em andamento.” A casa parece pronta para revelar seus primeiros desafios.",
    alternativas: [
      {
        texto: "Continuar a experiência.",
        afirmacao: ["Continuou a exploração da residência experimental."],
        proxima: 4
      }
    ]
  }
];

let atual = 0;
let historiaFinal = "";

const telaInicial = document.querySelector("#tela-inicial");
const telaHistoria = document.querySelector("#tela-historia");
const telaPergunta = document.querySelector("#tela-pergunta");
const enunciado = document.querySelector("#enunciado");
const respostas = document.querySelector("#respostas");
const mensagem = document.querySelector("#mensagem");

function aleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function mostraTela(telaAtiva) {
  [telaInicial, telaHistoria, telaPergunta].forEach((tela) => {
    tela.classList.toggle("escondida", tela !== telaAtiva);
  });
}

function iniciaJogo() {
  atual = 0;
  historiaFinal = "";
  mostraTela(telaHistoria);
}

function iniciaPerguntas() {
  atual = 0;
  mostraTela(telaPergunta);
  mostraPergunta();
}

function mostraPergunta() {
  const pergunta = perguntas[atual];
  document.querySelector("#rotulo-pergunta").textContent =
    atual === 0 ? "TUTORIAL • PRIMEIRA PERGUNTA" : "HISTÓRIA • ESCOLHA SEU CAMINHO";
  enunciado.textContent = pergunta.enunciado;
  mensagem.textContent = "";
  respostas.replaceChildren();

  pergunta.alternativas.forEach((alternativa) => {
    const botao = document.createElement("button");
    botao.className = "botao";
    botao.textContent = alternativa.texto;
    botao.addEventListener("click", () => respostaSelecionada(alternativa));
    respostas.appendChild(botao);
  });
}

function respostaSelecionada(opcaoSelecionada) {
  const afirmacao = aleatorio(opcaoSelecionada.afirmacao);
  historiaFinal += afirmacao + " ";

  if (opcaoSelecionada.proxima !== undefined) {
    atual = opcaoSelecionada.proxima;

    // A escolha “não entendi” reinicia: volta à introdução e depois ao tutorial.
    if (atual === 0) {
      iniciaJogo();
      return;
    }

    mostraPergunta();
  }
}

document.querySelector("#jogar").addEventListener("click", iniciaJogo);
document.querySelector("#continuar").addEventListener("click", iniciaPerguntas);
