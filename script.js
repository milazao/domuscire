const telas = {
  inicio: document.getElementById('tela-inicial'),
  cutscene: document.getElementById('cutscene'),
  perguntaInicial: document.getElementById('pergunta-inicial'),
  tarde: document.getElementById('tela-tarde'),
  historia: document.getElementById('tela-historia'),
  final: document.getElementById('tela-final')
};

const cenas = [
  {
    rotulo: 'CENA',
    texto: '[Tela preta. O som de um veículo se aproximando. Aos poucos, a imagem revela uma residência moderna, cercada por jardins e sistemas automatizados.]',
    tipo: 'legenda'
  },
  {
    rotulo: 'NARRADOR',
    texto: 'A tecnologia sempre prometeu tornar nossas vidas mais simples. Casas capazes de antecipar nossas necessidades, ambientes que se adaptam aos nossos hábitos e sistemas que aprendem conosco.'
  },
  {
    rotulo: 'CENA',
    texto: '[A câmera se aproxima da entrada da residência. As luzes se acendem automaticamente, e a porta se abre antes mesmo de o protagonista tocar a maçaneta.]',
    tipo: 'legenda'
  },
  {
    rotulo: 'NARRADOR',
    texto: 'Agora, essa promessa está prestes a se tornar realidade.'
  },
  {
    rotulo: 'CENA',
    texto: '[O protagonista desce do veículo com suas malas. Na entrada, um painel digital exibe uma mensagem de boas-vindas.]',
    tipo: 'legenda'
  },
  {
    rotulo: 'SISTEMA DA CASA',
    texto: '“Bem-vindo à Residência Experimental. Sua participação é fundamental para o desenvolvimento da próxima geração de moradias inteligentes.”',
    tipo: 'sistema'
  },
  {
    rotulo: 'CENA',
    texto: '[A porta se fecha suavemente atrás do protagonista. O interior é iluminado, organizado e aparentemente perfeito.]',
    tipo: 'legenda'
  },
  {
    rotulo: 'NARRADOR',
    texto: 'Selecionado para participar de um programa experimental, você terá a oportunidade de viver em uma casa projetada para aprender, evoluir e se adaptar a você.'
  },
  {
    rotulo: 'NARRADOR',
    texto: 'Durante sua estadia, cada escolha, cada hábito e cada interação ajudarão a moldar essa experiência.'
  },
  {
    rotulo: 'SISTEMA DA CASA',
    texto: '“Configuração inicial concluída. Iniciando protocolo de adaptação do residente.”',
    tipo: 'sistema'
  },
  {
    rotulo: 'NARRADOR',
    texto: 'Mas viver em uma casa que aprende com você também significa aprender a viver com ela.'
  },
  {
    rotulo: 'NARRADOR',
    texto: 'Sua nova vida começa agora.'
  }
];

const textoCena = document.getElementById('texto-cena');
const rotuloCena = document.getElementById('rotulo-cena');
const indicadorCena = document.getElementById('indicador-cena');
const progressoCena = document.getElementById('progresso-cena');
const btnContinuar = document.getElementById('btn-continuar');
const configSom = document.getElementById('config-som');
const dialogConfig = document.getElementById('dialog-config');
const dialogCreditos = document.getElementById('dialog-creditos');
const canvas = document.getElementById('canvas-cutscene');
const contexto = canvas.getContext('2d');

let indiceCena = 0;
let tempoCena = performance.now();
let temporizadorRetorno;
let somChegada;
let largura = 0;
let altura = 0;
let pixelRatio = 1;
let estrelas = [];

function mostrarTela(tela) {
  Object.values(telas).forEach(item => item.classList.remove('ativa'));
  tela.classList.add('ativa');
}

function desenharCena() {
  const agora = performance.now();
  const tempoDecorrido = (agora - tempoCena) / 1000;
  contexto.clearRect(0, 0, largura, altura);

  const ceu = contexto.createLinearGradient(0, 0, 0, altura);
  ceu.addColorStop(0, '#08101e');
  ceu.addColorStop(0.7, '#13253a');
  ceu.addColorStop(1, '#101925');
  contexto.fillStyle = ceu;
  contexto.fillRect(0, 0, largura, altura);

  estrelas.forEach(estrela => {
    const brilho = 0.3 + Math.sin(agora / 900 + estrela.fase) * 0.2;
    contexto.fillStyle = `rgba(174, 218, 255, ${brilho})`;
    contexto.fillRect(estrela.x * largura, estrela.y * altura, estrela.tamanho, estrela.tamanho);
  });

  desenharCidade();
  desenharTerreno();

  const progressoChegada = Math.min(1, (indiceCena + tempoDecorrido * 0.2) / 3.4);
  const iluminarCasa = indiceCena >= 1 ? 1 : Math.max(0, progressoChegada - 0.6) * 2.5;
  desenharCasa(iluminarCasa, indiceCena >= 1);
  desenharJardim(agora);

  if (indiceCena < 5) {
    desenharCarro(largura * (-0.25 + 0.62 * progressoChegada), altura * 0.79);
  } else {
    desenharCarro(largura * 0.37, altura * 0.79);
  }

  if (indiceCena >= 3) {
    desenharMorador(largura * 0.47, altura * 0.79);
  }

  requestAnimationFrame(desenharCena);
}

function desenharCidade() {
  const base = altura * 0.65;
  const predios = [
    [0.02, 0.23, 0.09], [0.12, 0.18, 0.16], [0.29, 0.14, 0.12],
    [0.43, 0.2, 0.17], [0.65, 0.16, 0.13], [0.81, 0.25, 0.18], [0.94, 0.12, 0.1]
  ];

  predios.forEach(([x, larguraPredio, alturaPredio], indice) => {
    const px = x * largura;
    const pw = larguraPredio * largura;
    const ph = alturaPredio * altura;
    contexto.fillStyle = indice % 2 ? '#111f30' : '#0e1a2a';
    contexto.fillRect(px, base - ph, pw, ph);
    contexto.fillStyle = 'rgba(77, 169, 216, 0.35)';
    for (let janelaX = px + 8; janelaX < px + pw - 5; janelaX += 15) {
      for (let janelaY = base - ph + 12; janelaY < base - 8; janelaY += 17) {
        if ((Math.floor(janelaX + janelaY) % 4) !== 0) {
          contexto.fillRect(janelaX, janelaY, 3, 5);
        }
      }
    }
  });

  contexto.fillStyle = '#152337';
  contexto.fillRect(0, base, largura, altura * 0.11);
}

function desenharTerreno() {
  contexto.fillStyle = '#101b26';
  contexto.fillRect(0, altura * 0.72, largura, altura * 0.28);
  contexto.fillStyle = '#202c37';
  contexto.fillRect(0, altura * 0.84, largura, altura * 0.16);
  contexto.fillStyle = 'rgba(107, 163, 194, 0.25)';
  contexto.fillRect(0, altura * 0.84, largura, 2);

  contexto.strokeStyle = 'rgba(128, 169, 192, 0.2)';
  contexto.lineWidth = 1;
  contexto.beginPath();
  contexto.moveTo(0, altura * 0.92);
  contexto.lineTo(largura, altura * 0.92);
  contexto.stroke();
}

function desenharCasa(iluminacao, portaAberta) {
  const x = largura * 0.58;
  const y = altura * 0.33;
  const w = largura * 0.3;
  const h = altura * 0.4;

  contexto.fillStyle = '#263647';
  contexto.beginPath();
  contexto.moveTo(x - w * 0.08, y + h * 0.18);
  contexto.lineTo(x + w * 0.5, y - h * 0.08);
  contexto.lineTo(x + w * 1.08, y + h * 0.18);
  contexto.closePath();
  contexto.fill();

  contexto.fillStyle = '#192839';
  contexto.fillRect(x, y + h * 0.18, w, h * 0.82);
  contexto.fillStyle = '#314556';
  contexto.fillRect(x + w * 0.54, y + h * 0.2, w * 0.37, h * 0.39);
  contexto.fillStyle = `rgba(130, 221, 255, ${0.08 + 0.65 * iluminacao})`;
  contexto.fillRect(x + w * 0.57, y + h * 0.23, w * 0.31, h * 0.31);
  contexto.fillStyle = '#172535';
  contexto.fillRect(x + w * 0.57, y + h * 0.38, w * 0.31, 2);
  contexto.fillRect(x + w * 0.71, y + h * 0.23, 2, h * 0.31);

  contexto.fillStyle = `rgba(139, 232, 255, ${0.1 + 0.85 * iluminacao})`;
  contexto.fillRect(x + w * 0.16, y + h * 0.28, w * 0.22, h * 0.25);
  contexto.fillStyle = '#132131';
  contexto.fillRect(x + w * 0.13, y + h * 0.26, w * 0.28, h * 0.035);
  contexto.fillRect(x + w * 0.13, y + h * 0.53, w * 0.28, h * 0.035);
  contexto.fillRect(x + w * 0.25, y + h * 0.26, w * 0.025, h * 0.3);

  contexto.fillStyle = '#0b111a';
  contexto.fillRect(x + w * 0.42, y + h * 0.59, w * 0.18, h * 0.41);
  contexto.fillStyle = '#3a5061';
  contexto.fillRect(x + w * (portaAberta ? 0.42 : 0.56), y + h * 0.59, w * 0.04, h * 0.41);

  contexto.fillStyle = `rgba(95, 210, 255, ${0.08 + 0.4 * iluminacao})`;
  contexto.beginPath();
  contexto.ellipse(x + w * 0.51, y + h, w * (portaAberta ? 0.3 : 0.15), h * 0.12, 0, 0, Math.PI * 2);
  contexto.fill();

  contexto.fillStyle = '#435c6d';
  contexto.fillRect(x - 5, y + h - 1, w + 10, altura * 0.08);
}

function desenharJardim(agora) {
  const pontos = [0.54, 0.91, 0.95];
  pontos.forEach((ponto, indice) => {
    const x = largura * ponto;
    const y = altura * (indice === 0 ? 0.77 : 0.76);
    contexto.fillStyle = indice === 1 ? '#1d3a39' : '#19302f';
    contexto.fillRect(x, y, largura * 0.028, altura * 0.075);
    contexto.fillStyle = '#254845';
    contexto.beginPath();
    contexto.arc(x + largura * 0.014, y, largura * 0.025, 0, Math.PI * 2);
    contexto.fill();
  });

  const pulso = 0.25 + (Math.sin(agora / 500) + 1) * 0.13;
  contexto.fillStyle = `rgba(99, 202, 255, ${pulso})`;
  contexto.beginPath();
  contexto.arc(largura * 0.54, altura * 0.81, 3, 0, Math.PI * 2);
  contexto.fill();
}

function desenharCarro(x, y) {
  const carroW = largura * 0.15;
  const carroH = altura * 0.075;
  contexto.fillStyle = '#0a1018';
  contexto.beginPath();
  contexto.moveTo(x, y);
  contexto.lineTo(x + carroW * 0.18, y - carroH * 0.58);
  contexto.lineTo(x + carroW * 0.64, y - carroH * 0.58);
  contexto.lineTo(x + carroW * 0.83, y);
  contexto.closePath();
  contexto.fill();
  contexto.fillStyle = '#34576d';
  contexto.fillRect(x + carroW * 0.22, y - carroH * 0.5, carroW * 0.39, carroH * 0.34);
  contexto.fillStyle = '#14202b';
  contexto.fillRect(x - carroW * 0.08, y, carroW, carroH * 0.3);
  contexto.fillStyle = '#a1eaff';
  contexto.fillRect(x + carroW * 0.84, y + carroH * 0.05, carroW * 0.12, carroH * 0.09);
  contexto.fillStyle = '#080b10';
  [0.19, 0.72].forEach(posicao => {
    contexto.beginPath();
    contexto.arc(x + carroW * posicao, y + carroH * 0.27, carroH * 0.16, 0, Math.PI * 2);
    contexto.fill();
  });
}

function desenharMorador(x, y) {
  contexto.fillStyle = '#111a24';
  contexto.beginPath();
  contexto.arc(x, y - altura * 0.065, altura * 0.018, 0, Math.PI * 2);
  contexto.fill();
  contexto.fillRect(x - largura * 0.009, y - altura * 0.048, largura * 0.018, altura * 0.065);
  contexto.fillRect(x - largura * 0.02, y + altura * 0.01, largura * 0.012, altura * 0.045);
  contexto.fillRect(x + largura * 0.008, y + altura * 0.01, largura * 0.012, altura * 0.045);
}

function redimensionarCanvas() {
  const retangulo = canvas.getBoundingClientRect();
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  largura = retangulo.width;
  altura = retangulo.height;
  canvas.width = Math.round(largura * pixelRatio);
  canvas.height = Math.round(altura * pixelRatio);
  contexto.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  estrelas = Array.from({ length: Math.floor(largura / 12) }, () => ({
    x: Math.random(),
    y: Math.random() * 0.53,
    tamanho: Math.random() > 0.8 ? 2 : 1,
    fase: Math.random() * Math.PI * 2
  }));
}

function exibirCena() {
  const cena = cenas[indiceCena];
  const revelacaoFinal = indiceCena === cenas.length - 1;
  rotuloCena.textContent = cena.rotulo;
  textoCena.textContent = cena.texto;
  textoCena.className = `texto-cena ${cena.tipo || ''}`;
  telas.cutscene.classList.toggle('revelacao-final', revelacaoFinal);
  document.getElementById('titulo-revelado').classList.toggle('visivel', revelacaoFinal);
  indicadorCena.textContent = indiceCena < 4 ? 'REGISTRO DE CHEGADA' : 'PROTOCOLO DE ADAPTAÇÃO';
  progressoCena.textContent = `${String(indiceCena + 1).padStart(2, '0')} / ${String(cenas.length).padStart(2, '0')}`;
  btnContinuar.innerHTML = indiceCena === cenas.length - 1
    ? 'Prosseguir <span aria-hidden="true">→</span>'
    : 'Continuar <span aria-hidden="true">→</span>';
}

function iniciarSomChegada() {
  if (!configSom.checked || !('AudioContext' in window)) return;

  somChegada?.close();
  const audio = new AudioContext();
  somChegada = audio;
  const oscilador = audio.createOscillator();
  const filtro = audio.createBiquadFilter();
  const volume = audio.createGain();
  const agora = audio.currentTime;

  oscilador.type = 'triangle';
  oscilador.frequency.setValueAtTime(82, agora);
  oscilador.frequency.exponentialRampToValueAtTime(43, agora + 4);
  filtro.type = 'lowpass';
  filtro.frequency.value = 130;
  volume.gain.setValueAtTime(0.0001, agora);
  volume.gain.exponentialRampToValueAtTime(0.045, agora + 0.8);
  volume.gain.exponentialRampToValueAtTime(0.0001, agora + 5);
  oscilador.connect(filtro);
  filtro.connect(volume);
  volume.connect(audio.destination);
  oscilador.start(agora);
  oscilador.stop(agora + 5.1);
  oscilador.addEventListener('ended', () => audio.close(), { once: true });
}

function iniciarCutscene() {
  clearTimeout(temporizadorRetorno);
  indiceCena = 0;
  tempoCena = performance.now();
  exibirCena();
  mostrarTela(telas.cutscene);
  redimensionarCanvas();
  iniciarSomChegada();
}

function avancarCutscene() {
  if (indiceCena < cenas.length - 1) {
    indiceCena += 1;
    tempoCena = performance.now();
    exibirCena();
    return;
  }
  mostrarTela(telas.perguntaInicial);
}

const caminhos = {
  inicio: {
    pergunta: 'A interface pede autorização para adaptar a casa aos seus hábitos. O que você faz?',
    contexto: 'Um aviso discreto aparece na parede: “Para oferecer uma experiência personalizada, precisamos aprender sobre você.”',
    opcoes: [
      { texto: 'Autorizar personalização', destino: 'personalizar' },
      { texto: 'Manter meus dados privados', destino: 'privacidade' }
    ]
  },
  personalizar: {
    pergunta: 'A casa quer ajustar a iluminação e a temperatura com base no seu comportamento.',
    contexto: 'O sistema diz que a coleta pode ser interrompida a qualquer momento. Um pequeno indicador verde pulsa na interface.',
    opcoes: [
      { texto: 'Aceitar o conforto automático', final: ['Uma casa à sua medida', 'As luzes se ajustam ao seu gosto. A Residência agradece pela confiança — e começa a observar seus hábitos.'] },
      { texto: 'Perguntar o que será registrado', final: ['Uma pergunta incômoda', 'A interface demora um segundo a mais do que deveria. “Somente dados necessários”, responde a casa. Você decide acompanhar cada permissão.'] }
    ]
  },
  privacidade: {
    pergunta: 'A casa reconhece sua escolha, mas avisa que algumas funções ficarão limitadas.',
    contexto: 'A porta da sala se abre. No painel, duas opções aguardam sua decisão.',
    opcoes: [
      { texto: 'Configurar cada cômodo manualmente', final: ['No seu próprio ritmo', 'Você assume o controle da iluminação e do ambiente. A casa obedece, embora continue oferecendo sugestões.'] },
      { texto: 'Investigar as permissões do sistema', final: ['Acesso não identificado', 'Nos registros, você encontra uma permissão ativa que não se lembra de ter concedido. A tela escurece antes que consiga abrir os detalhes.'] }
    ]
  }
};

function mostrarPerguntaHistoria(etapa) {
  const caminho = caminhos[etapa];
  document.getElementById('etapa-historia').textContent = etapa === 'inicio'
    ? 'PROTOCOLO DE ADAPTAÇÃO'
    : 'DECISÃO DO RESIDENTE';
  document.getElementById('pergunta-historia').textContent = caminho.pergunta;
  document.getElementById('contexto-historia').textContent = caminho.contexto;
  const respostasHistoria = document.getElementById('respostas-historia');
  respostasHistoria.replaceChildren();

  caminho.opcoes.forEach(opcao => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'btn';
    botao.textContent = opcao.texto;
    botao.addEventListener('click', () => {
      if (opcao.destino) {
        mostrarPerguntaHistoria(opcao.destino);
        return;
      }
      document.getElementById('titulo-final').textContent = opcao.final[0];
      document.getElementById('texto-final').textContent = opcao.final[1];
      mostrarTela(telas.final);
    });
    respostasHistoria.append(botao);
  });

  mostrarTela(telas.historia);
  respostasHistoria.querySelector('button')?.focus();
}

document.getElementById('btn-jogar').addEventListener('click', iniciarCutscene);
btnContinuar.addEventListener('click', avancarCutscene);
document.getElementById('btn-pular').addEventListener('click', () => {
  mostrarTela(telas.perguntaInicial);
});
document.getElementById('btn-config').addEventListener('click', () => dialogConfig.showModal());
document.getElementById('btn-credito').addEventListener('click', () => dialogCreditos.showModal());
document.getElementById('btn-voltar').addEventListener('click', () => mostrarTela(telas.inicio));

document.querySelectorAll('.resposta').forEach(botao => {
  botao.addEventListener('click', () => {
    if (botao.dataset.resposta === 'sim') {
      mostrarPerguntaHistoria('inicio');
      return;
    }

    mostrarTela(telas.tarde);
    temporizadorRetorno = setTimeout(() => mostrarTela(telas.inicio), 3000);
  });
});

document.addEventListener('keydown', evento => {
  if (evento.key === 'Enter'
    && !(evento.target instanceof HTMLButtonElement)
    && telas.cutscene.classList.contains('ativa')) {
    avancarCutscene();
  }
});

window.addEventListener('resize', redimensionarCanvas);
redimensionarCanvas();
exibirCena();
requestAnimationFrame(desenharCena);
