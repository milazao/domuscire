const perguntas = [
  // POSIÇÃO 0: pergunta comum aos dois caminhos.
  {
    enunciado:
      "Ao chegar à Residência Experimental, a inteligência da casa " +
      "se oferece para configurar sua experiência. Qual é sua primeira reação?",
    alternativas: [
      {
        texto: "Quero experimentar o sistema e descobrir o que ele consegue fazer.",
        afirmacao: [
          "Decidiu experimentar os recursos da casa inteligente."
        ],
        proxima: 1
      },
      {
        texto: "Quero entender como a casa coleta e utiliza meus dados.",
        afirmacao: [
          "Decidiu investigar como a casa inteligente funciona."
        ],
        proxima: 2
      }
    ]
  },

  // POSIÇÃO 1: começo da narrativa de experimentação.
  {
    enunciado: "A casa começa a demonstrar seus recursos.",
    alternativas: []
  },

  // POSIÇÃO 2: começo da narrativa de investigação.
  {
    enunciado: "Você decide observar o sistema com mais cuidado.",
    alternativas: []
  }
];

let atual = 0;
let historiaFinal = "";

const telaInicial = document.querySelector("#tela-inicial");
const telaJogo = document.querySelector("#tela-jogo");
const textoCena = document.querySelector("#texto-cena");
const tituloCena = document.querySelector("#titulo-cena");
const rotuloCena = document.querySelector("#rotulo-cena");
const respostas = document.querySelector("#respostas");
const dialogoInfo = document.querySelector("#dialogo-info");

function aleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function iniciaJogo() {
  atual = 0;
  historiaFinal = "";
  telaInicial.classList.add("escondida");
  telaJogo.classList.remove("escondida");
  mostraPergunta();
}

function mostraPergunta() {
  const pergunta = perguntas[atual];

  rotuloCena.textContent = atual === 0 ? "CONFIGURAÇÃO INICIAL" : "NARRATIVA INICIADA";
  tituloCena.textContent = atual === 0 ? "Uma escolha, dois caminhos." : "A casa observa.";
  textoCena.textContent = pergunta.enunciado;
  respostas.replaceChildren();

  pergunta.alternativas.forEach((alternativa) => {
    const botao = document.createElement("button");
    botao.className = "botao";
    botao.textContent = alternativa.texto;
    botao.addEventListener("click", () => respostaSelecionada(alternativa));
    respostas.appendChild(botao);
  });

  // Nesta primeira parte, as posições 1 e 2 apenas mostram
  // o início da narrativa escolhida. As próximas alternativas
  // serão adicionadas na continuação do projeto.
  if (pergunta.alternativas.length === 0) {
    const aviso = document.createElement("p");
    aviso.className = "texto-cena";
    aviso.textContent = "Continuação da história em desenvolvimento...";
    respostas.appendChild(aviso);
  }
}

function respostaSelecionada(opcaoSelecionada) {
  // Sorteia uma das afirmações da alternativa escolhida.
  const afirmacao = aleatorio(opcaoSelecionada.afirmacao);

  // Acrescenta a afirmação à história da partida.
  historiaFinal += afirmacao + " ";

  // Verifica se existe uma próxima pergunta.
  if (opcaoSelecionada.proxima !== undefined) {
    atual = opcaoSelecionada.proxima;
    mostraPergunta();
  }
}

document.querySelector("#botao-jogar").addEventListener("click", iniciaJogo);

document.querySelector("#botao-voltar").addEventListener("click", () => {
  telaJogo.classList.add("escondida");
  telaInicial.classList.remove("escondida");
});

document.querySelector("#botao-configuracoes").addEventListener("click", () => {
  abrirDialogo(
    "Configurações",
    "Controles: W, A, S e D para movimentar; Espaço para conversar; E para interagir."
  );
});

document.querySelector("#botao-creditos").addEventListener("click", () => {
  abrirDialogo("Créditos", "Jogo criado por milps julips.");
});

function abrirDialogo(titulo, texto) {
  document.querySelector("#titulo-dialogo").textContent = titulo;
  document.querySelector("#texto-dialogo").textContent = texto;
  dialogoInfo.showModal();
}

document.querySelector("#fechar-dialogo").addEventListener("click", () => {
  dialogoInfo.close();
});

// Atalhos básicos de teclado para a tela de jogo.
document.addEventListener("keydown", (evento) => {
  if (telaJogo.classList.contains("escondida")) return;

  const tecla = evento.key.toLowerCase();

  if (["w", "a", "s", "d", " ", "e"].includes(tecla)) {
    evento.preventDefault();
  }
});
