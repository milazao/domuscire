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
    visual: 'black',
    texto: ''
  },
  {
    visual: 'city',
    texto: 'A tecnologia sempre prometeu tornar nossas vidas mais simples. Casas capazes de antecipar nossas necessidades, ambientes que se adaptam aos nossos hábitos e sistemas que aprendem conosco.'
  },
  {
    visual: 'arrival',
    texto: ''
  },
  {
    visual: 'arrival',
    texto: 'Agora, essa promessa está prestes a se tornar realidade.'
  },
  {
    visual: 'resident-arrives',
    texto: ''
  },
  {
    visual: 'welcome',
    rotulo: 'SISTEMA DA CASA',
    texto: '“Bem-vindo à Residência Experimental. Sua participação é fundamental para o desenvolvimento da próxima geração de moradias inteligentes.”',
    tipo: 'sistema'
  },
  {
    visual: 'interior',
    texto: ''
  },
  {
    visual: 'interior',
    texto: 'Selecionado para participar de um programa experimental, você terá a oportunidade de viver em uma casa projetada para aprender, evoluir e se adaptar a você.'
  },
  {
    visual: 'interior-interface',
    texto: 'Durante sua estadia, cada escolha, cada hábito e cada interação ajudarão a moldar essa experiência.'
  },
  {
    visual: 'interior-glitch',
    rotulo: 'SISTEMA DA CASA',
    texto: '“Configuração inicial concluída. Iniciando protocolo de adaptação do residente.”',
    tipo: 'sistema'
  },
  {
    visual: 'interior-glitch',
    texto: 'Mas viver em uma casa que aprende com você também significa aprender a viver com ela.'
  },
  {
    visual: 'interior-title',
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
const app = document.getElementById('app');

let indiceCena = 0;
let tempoCena = performance.now();
let temporizadorRetorno;
let temporizadorTela;
let somChegada;
let modoCutscene = 'abertura';
let perguntaAtual = null;
let visualAtual = 'black';
let temporizadorTelaPreta;
let largura = 0;
let altura = 0;
let pixelRatio = 1;
let estrelas = [];

function mostrarTela(tela, animar = false) {
  clearTimeout(temporizadorTela);
  const telaAtual = Object.values(telas).find(item => item.classList.contains('ativa'));
  if (telaAtual === tela && !animar) return;

  if (!animar) {
    Object.values(telas).forEach(item => item.classList.remove('ativa'));
    tela.classList.add('ativa');
    return;
  }

  app.classList.add('transicao');
  temporizadorTela = setTimeout(() => {
    Object.values(telas).forEach(item => item.classList.remove('ativa'));
    tela.classList.add('ativa');
    app.classList.remove('transicao');
  }, 180);
}

function desenharCena() {
  const agora = performance.now();
  const tempoDecorrido = (agora - tempoCena) / 1000;
  contexto.clearRect(0, 0, largura, altura);

  if (visualAtual === 'black') {
    contexto.fillStyle = '#000';
    contexto.fillRect(0, 0, largura, altura);
    requestAnimationFrame(desenharCena);
    return;
  }

  if (visualAtual.startsWith('interior')) {
    desenharInterior(agora, tempoDecorrido, visualAtual);
    requestAnimationFrame(desenharCena);
    return;
  }

  const ceu = contexto.createLinearGradient(0, 0, 0, altura);
  ceu.addColorStop(0, '#08101e');
  ceu.addColorStop(0.7, '#13253a');
  ceu.addColorStop(1, '#101925');
  contexto.fillStyle = ceu;
  contexto.fillRect(0, 0, largura, altura);

  desenharEstrelas(agora);
  desenharCidade();
  desenharTerreno();

  if (visualAtual === 'city') {
    desenharCidadeTecnologica(agora);
    requestAnimationFrame(desenharCena);
    return;
  }

  const progressoChegada = Math.min(1, tempoDecorrido / 5);
  const intensidadeLuz = Math.min(1, Math.max(0, (tempoDecorrido - 0.6) / 1.8));
  const portaAberta = visualAtual === 'arrival'
    ? tempoDecorrido > 1.2
    : visualAtual !== 'interior';
  desenharCasa(intensidadeLuz, portaAberta);
  desenharJardim(agora);
  if (visualAtual === 'arrival' || visualAtual === 'welcome') {
    desenharCarro(largura * (-0.2 + 0.58 * progressoChegada), altura * 0.79);
  } else {
    desenharCarro(largura * 0.37, altura * 0.79);
  }

  if (visualAtual === 'resident-arrives') {
    const caminhada = Math.min(1, tempoDecorrido / 3);
    desenharMorador(largura * (0.4 + caminhada * 0.13), altura * 0.79);
    desenharMala(largura * (0.39 + caminhada * 0.13), altura * 0.79);
    desenharPainelBoasVindas(agora);
  } else if (visualAtual === 'welcome') {
    desenharMorador(largura * 0.53, altura * 0.79);
    desenharPainelBoasVindas(agora);
  }

  requestAnimationFrame(desenharCena);
}

function desenharEstrelas(agora) {
  estrelas.forEach(estrela => {
    const brilho = 0.3 + Math.sin(agora / 900 + estrela.fase) * 0.2;
    contexto.fillStyle = `rgba(174, 218, 255, ${brilho})`;
    contexto.fillRect(estrela.x * largura, estrela.y * altura, estrela.tamanho, estrela.tamanho);
  });
}

function desenharCidadeTecnologica(agora) {
  contexto.strokeStyle = 'rgba(80, 196, 241, 0.22)';
  contexto.lineWidth = 1;
  for (let faixa = 0; faixa < 5; faixa += 1) {
    const y = altura * (0.69 + faixa * 0.055);
    contexto.beginPath();
    contexto.moveTo(0, y);
    contexto.lineTo(largura, y);
    contexto.stroke();
  }

  const pulso = (agora % 4000) / 4000;
  contexto.fillStyle = `rgba(75, 190, 245, ${0.16 * (1 - pulso)})`;
  contexto.beginPath();
  contexto.ellipse(largura * (pulso * 1.3 - 0.15), altura * 0.74, largura * 0.12, altura * 0.025, 0, 0, Math.PI * 2);
  contexto.fill();

  desenharCasa(0.35 + Math.sin(agora / 900) * 0.1, false);
  desenharJardim(agora);
}

function desenharInterior(agora, tempo, visual) {
  const parede = contexto.createLinearGradient(0, 0, 0, altura);
  parede.addColorStop(0, '#122335');
  parede.addColorStop(0.72, '#1b2b38');
  parede.addColorStop(0.73, '#25343d');
  parede.addColorStop(1, '#111b24');
  contexto.fillStyle = parede;
  contexto.fillRect(0, 0, largura, altura);

  contexto.fillStyle = '#0c1621';
  contexto.fillRect(largura * 0.08, altura * 0.12, largura * 0.27, altura * 0.4);
  contexto.fillStyle = '#132b40';
  contexto.fillRect(largura * 0.095, altura * 0.14, largura * 0.24, altura * 0.36);
  contexto.fillStyle = 'rgba(74, 183, 227, 0.52)';
  contexto.fillRect(largura * 0.095, altura * 0.49, largura * 0.24, 2);
  for (let indice = 0; indice < 5; indice += 1) {
    const x = largura * (0.11 + indice * 0.045);
    const y = altura * (0.22 + (indice % 2) * 0.05);
    contexto.fillStyle = `rgba(106, 200, 239, ${0.25 + (indice % 3) * 0.12})`;
    contexto.fillRect(x, y, largura * 0.025, altura * (0.08 + (indice % 2) * 0.08));
  }

  contexto.fillStyle = '#304554';
  contexto.fillRect(largura * 0.6, altura * 0.2, largura * 0.27, altura * 0.44);
  contexto.fillStyle = '#9edcff';
  contexto.globalAlpha = visual === 'interior-glitch' && Math.sin(agora / 90) > 0.92
    ? 0.08
    : 0.16 + (Math.sin(agora / 700) + 1) * 0.1;
  contexto.fillRect(largura * 0.62, altura * 0.22, largura * 0.23, altura * 0.39);
  contexto.globalAlpha = 1;
  contexto.strokeStyle = 'rgba(149, 220, 248, 0.5)';
  contexto.strokeRect(largura * 0.62, altura * 0.22, largura * 0.23, altura * 0.39);

  contexto.fillStyle = '#101b26';
  contexto.fillRect(largura * 0.34, altura * 0.61, largura * 0.31, altura * 0.12);
  contexto.fillStyle = '#273b49';
  contexto.fillRect(largura * 0.31, altura * 0.58, largura * 0.36, altura * 0.08);
  contexto.fillStyle = '#15232e';
  contexto.fillRect(largura * 0.35, altura * 0.72, largura * 0.025, altura * 0.12);
  contexto.fillRect(largura * 0.61, altura * 0.72, largura * 0.025, altura * 0.12);

  const portaX = largura * 0.89;
  const portaY = altura * 0.28;
  const portaW = largura * 0.075;
  const portaH = altura * 0.45;
  contexto.fillStyle = '#0b1118';
  contexto.fillRect(portaX, portaY, portaW, portaH);
  contexto.fillStyle = '#486272';
  contexto.fillRect(portaX, portaY, largura * 0.008, portaH);
  if (visual === 'interior') {
    const fechamento = Math.min(1, tempo / 2.4);
    contexto.fillStyle = '#253b4a';
    contexto.fillRect(portaX + portaW * fechamento, portaY, portaW * (1 - fechamento), portaH);
  }

  const chegadaInterior = visual === 'interior' ? Math.min(1, tempo / 3) : 1;
  const moradorX = largura * (0.43 + chegadaInterior * 0.08);
  desenharMorador(moradorX, altura * 0.78);

  if (visual.includes('interface') || visual.includes('glitch') || visual.includes('panel')) {
    desenharInterfaceInterior(agora, visual);
  }
  if (visual.includes('sensors') || visual.includes('dados') || visual.includes('privacy')) {
    desenharSensores(agora, visual);
  }
  if (visual.includes('thermostat')) {
    desenharTermostato(agora);
  }

  if (visual === 'interior-title') {
    const fade = Math.min(0.76, Math.max(0, (tempo - 1) * 0.2));
    contexto.fillStyle = `rgba(0, 0, 0, ${fade})`;
    contexto.fillRect(0, 0, largura, altura);
  }
}

function desenharInterfaceInterior(agora, visual) {
  const x = largura * 0.68;
  const y = altura * 0.27;
  const w = largura * 0.18;
  const h = altura * 0.3;
  contexto.fillStyle = 'rgba(51, 179, 231, 0.09)';
  contexto.fillRect(x, y, w, h);
  contexto.strokeStyle = 'rgba(119, 222, 255, 0.8)';
  contexto.strokeRect(x, y, w, h);
  contexto.fillStyle = '#a4eaff';
  contexto.font = `${Math.max(9, largura * 0.011)}px monospace`;
  contexto.fillText(visual === 'interior-glitch' ? 'ADAPTANDO...' : 'RESIDÊNCIA / ATIVA', x + 10, y + 20);
  for (let linha = 0; linha < 4; linha += 1) {
    const extensao = w * (0.3 + ((linha * 7 + Math.floor(agora / 300) % 4) % 6) / 10);
    contexto.fillStyle = linha === 2 ? '#7ce5bb' : 'rgba(123, 205, 235, 0.62)';
    contexto.fillRect(x + 10, y + 38 + linha * 15, extensao, 2);
  }
  contexto.beginPath();
  contexto.arc(x + w * 0.78, y + h * 0.73, 14 + Math.sin(agora / 350) * 3, 0, Math.PI * 2);
  contexto.strokeStyle = '#77d9fb';
  contexto.stroke();
}

function desenharSensores(agora, visual) {
  const pontos = [[0.2, 0.3], [0.47, 0.52], [0.74, 0.37], [0.83, 0.68]];
  const alerta = visual.includes('dados');
  pontos.forEach(([px, py], indice) => {
    const cor = alerta && indice === 1 ? '#ff9e59' : '#74e7a7';
    const pulso = 0.5 + (Math.sin(agora / 250 + indice) + 1) * 0.2;
    contexto.globalAlpha = pulso;
    contexto.strokeStyle = cor;
    contexto.beginPath();
    contexto.arc(largura * px, altura * py, 7 + (indice === 1 ? pulso * 5 : 0), 0, Math.PI * 2);
    contexto.stroke();
    contexto.globalAlpha = 1;
    contexto.fillStyle = cor;
    contexto.fillRect(largura * px - 2, altura * py - 2, 4, 4);
  });
}

function desenharTermostato(agora) {
  const x = largura * 0.76;
  const y = altura * 0.5;
  contexto.fillStyle = '#0e1b27';
  contexto.fillRect(x, y, largura * 0.08, altura * 0.13);
  contexto.strokeStyle = '#70d7f5';
  contexto.strokeRect(x, y, largura * 0.08, altura * 0.13);
  contexto.fillStyle = '#b7f0ff';
  contexto.font = `${Math.max(12, largura * 0.018)}px monospace`;
  contexto.fillText(`${21 + Math.floor((Math.sin(agora / 900) + 1) * 2)}°`, x + 10, y + 31);
}

function desenharMala(x, y) {
  contexto.fillStyle = '#263d4d';
  contexto.fillRect(x, y - altura * 0.055, largura * 0.027, altura * 0.05);
  contexto.strokeStyle = '#83b9d1';
  contexto.strokeRect(x + largura * 0.006, y - altura * 0.063, largura * 0.014, altura * 0.01);
}

function desenharPainelBoasVindas(agora) {
  const x = largura * 0.54;
  const y = altura * 0.47;
  contexto.fillStyle = 'rgba(16, 43, 58, 0.9)';
  contexto.fillRect(x, y, largura * 0.07, altura * 0.06);
  contexto.strokeStyle = `rgba(123, 226, 255, ${0.55 + (Math.sin(agora / 350) + 1) * 0.2})`;
  contexto.strokeRect(x, y, largura * 0.07, altura * 0.06);
  contexto.fillStyle = '#a4eaff';
  contexto.fillRect(x + largura * 0.01, y + altura * 0.019, largura * 0.05, 2);
  contexto.fillRect(x + largura * 0.01, y + altura * 0.034, largura * 0.035, 2);
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
  visualAtual = cena.visual;
  telas.cutscene.classList.toggle('sem-dialogo', !cena.texto);
  rotuloCena.textContent = cena.rotulo === 'SISTEMA DA CASA' ? cena.rotulo : '';
  textoCena.textContent = cena.texto;
  textoCena.className = `texto-cena ${cena.tipo || ''}`;
  telas.cutscene.classList.toggle('revelacao-final', revelacaoFinal);
  document.getElementById('titulo-revelado').classList.toggle('visivel', revelacaoFinal);
  indicadorCena.textContent = indiceCena < 4 ? 'REGISTRO DE CHEGADA' : 'PROTOCOLO DE ADAPTAÇÃO';
  progressoCena.textContent = `${String(indiceCena + 1).padStart(2, '0')} / ${String(cenas.length).padStart(2, '0')}`;
  document.getElementById('btn-pular').hidden = cena.visual === 'black';
  btnContinuar.innerHTML = indiceCena === cenas.length - 1
    ? 'Prosseguir <span aria-hidden="true">→</span>'
    : 'Continuar <span aria-hidden="true">→</span>';
  atualizarTelaPreta();
}

function iniciarCenaPergunta(id, animar = true) {
  modoCutscene = 'pergunta';
  perguntaAtual = id;
  visualAtual = perguntas[id].visual;
  tempoCena = performance.now();
  rotuloCena.textContent = '';
  textoCena.textContent = '';
  telas.cutscene.classList.add('sem-dialogo');
  telas.cutscene.classList.remove('revelacao-final');
  document.getElementById('titulo-revelado').classList.remove('visivel');
  indicadorCena.textContent = 'CENA — PROTOCOLO DE ADAPTAÇÃO';
  progressoCena.textContent = 'CENA';
  document.getElementById('btn-pular').hidden = true;
  btnContinuar.innerHTML = 'Ver pergunta <span aria-hidden="true">→</span>';
  mostrarTela(telas.cutscene, animar);
  atualizarTelaPreta();
  redimensionarCanvas();
}

function atualizarTelaPreta() {
  const preto = telas.cutscene.classList.contains('ativa') && visualAtual === 'black';
  document.body.classList.toggle('cena-preta', preto);
  app.classList.toggle('cena-preta', preto);
}

function mostrarPergunta(id, animar = true) {
  const pergunta = perguntas[id];
  if (id === 'confirmacao') {
    document.getElementById('pergunta-confirmacao').textContent = pergunta.pergunta;
    document.getElementById('contexto-pergunta-inicial').textContent = pergunta.contexto;
    mostrarTela(telas.perguntaInicial, animar);
    return;
  }

  document.getElementById('etapa-historia').textContent = pergunta.etapa;
  document.getElementById('rotulo-pergunta-historia').textContent = pergunta.personagem;
  document.getElementById('pergunta-historia').textContent = pergunta.pergunta;
  document.getElementById('contexto-historia').textContent = pergunta.contexto;
  const respostasHistoria = document.getElementById('respostas-historia');
  respostasHistoria.replaceChildren();

  pergunta.opcoes.forEach(opcao => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'btn';
    botao.textContent = opcao.texto;
    botao.addEventListener('click', () => {
      if (opcao.destino) {
        iniciarCenaPergunta(opcao.destino);
        return;
      }
      document.getElementById('titulo-final').textContent = opcao.final[0];
      document.getElementById('texto-final').textContent = opcao.final[1];
      mostrarTela(telas.final, true);
    });
    respostasHistoria.append(botao);
  });

  mostrarTela(telas.historia, animar);
  respostasHistoria.querySelector('button')?.focus();
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
  clearTimeout(temporizadorTelaPreta);
  modoCutscene = 'abertura';
  perguntaAtual = null;
  indiceCena = 0;
  tempoCena = performance.now();
  exibirCena();
  mostrarTela(telas.cutscene);
  atualizarTelaPreta();
  redimensionarCanvas();
  iniciarSomChegada();
  temporizadorTelaPreta = setTimeout(() => {
    if (telas.cutscene.classList.contains('ativa')
      && modoCutscene === 'abertura'
      && visualAtual === 'black') {
      avancarCutscene();
    }
  }, 1800);
}

function avancarCutscene() {
  clearTimeout(temporizadorTelaPreta);
  if (modoCutscene === 'pergunta') {
    mostrarPergunta(perguntaAtual);
    return;
  }

  if (indiceCena < cenas.length - 1) {
    const saiuDaTelaPreta = visualAtual === 'black';
    indiceCena += 1;
    tempoCena = performance.now();
    exibirCena();
    if (saiuDaTelaPreta) {
      app.classList.add('revelando');
      setTimeout(() => app.classList.remove('revelando'), 1500);
    }
    redimensionarCanvas();
    return;
  }
  iniciarCenaPergunta('confirmacao');
}

const perguntas = {
  confirmacao: {
    visual: 'interior-panel',
    personagem: 'SISTEMA DA CASA',
    pergunta: 'Você realmente deseja iniciar?',
    contexto: '“Posso começar a adaptação da residência agora. Como deseja prosseguir?”',
    opcoes: [
      { texto: 'Sim, iniciar', acao: 'sim' },
      { texto: 'Não', acao: 'nao' },
      { texto: 'Quero saber mais', acao: 'informacoes' }
    ]
  },
  informacoes: {
    visual: 'interior-privacy',
    personagem: 'SISTEMA DA CASA',
    etapa: 'CENTRAL DE PRIVACIDADE',
    pergunta: 'Que tipo de informação você gostaria de conhecer antes de começar?',
    contexto: '“Posso explicar a personalização, mostrar os controles de privacidade ou voltar à configuração inicial.”',
    opcoes: [
      { texto: 'Como funciona a personalização?', destino: 'inicio' },
      { texto: 'Quais controles de privacidade existem?', destino: 'privacidade' },
      { texto: 'Voltar à decisão inicial', destino: 'confirmacao' }
    ]
  },
  inicio: {
    visual: 'interior-sensors',
    personagem: 'SISTEMA DA CASA',
    etapa: 'PROTOCOLO DE ADAPTAÇÃO',
    pergunta: 'Para adaptar a casa aos seus hábitos, como você gostaria de configurar a residência?',
    contexto: '“Sua escolha pode ser alterada depois. Nenhuma preferência será aplicada sem sua autorização.”',
    opcoes: [
      { texto: 'Autorizar a personalização', destino: 'personalizar' },
      { texto: 'Configurar tudo manualmente', destino: 'privacidade' },
      { texto: 'Ver quais dados serão usados', destino: 'dados' }
    ]
  },
  dados: {
    visual: 'interior-dados',
    personagem: 'SISTEMA DA CASA',
    etapa: 'PERMISSÕES DE DADOS',
    pergunta: 'Quais dados você permite que eu use para preparar a sua estadia?',
    contexto: '“Posso usar apenas suas preferências de conforto, mostrar cada permissão ou operar sem personalização.”',
    opcoes: [
      { texto: 'Somente preferências de conforto', destino: 'personalizar' },
      { texto: 'Revisar as permissões uma a uma', destino: 'privacidade' },
      { texto: 'Não usar dados pessoais', final: ['Sem personalização', 'A casa confirma que manterá os sensores pessoais desligados. Algumas funções automáticas ficam indisponíveis, mas você mantém o controle.'] }
    ]
  },
  personalizar: {
    visual: 'interior-thermostat',
    personagem: 'SISTEMA DA CASA',
    etapa: 'AJUSTE DE AMBIENTE',
    pergunta: 'Como prefere que eu ajuste o ambiente durante sua estadia?',
    contexto: '“Posso automatizar o conforto, pedir sua autorização a cada ajuste ou deixar os controles com você.”',
    opcoes: [
      { texto: 'Automatize iluminação e temperatura', final: ['Uma casa à sua medida', 'As luzes e a temperatura se ajustam ao seu gosto. A Residência agradece pela confiança — e começa a observar seus hábitos.'] },
      { texto: 'Pergunte antes de cada ajuste', final: ['Nada sem sua permissão', 'A casa confirma cada mudança antes de executá-la. A adaptação será mais lenta, mas cada decisão continua sendo sua.'] },
      { texto: 'Quero controlar tudo manualmente', final: ['No seu próprio ritmo', 'Você assume o controle da iluminação e do ambiente. A casa obedece, embora continue oferecendo sugestões.'] }
    ]
  },
  privacidade: {
    visual: 'interior-privacy',
    personagem: 'SISTEMA DA CASA',
    etapa: 'CONTROLES DO RESIDENTE',
    pergunta: 'Como você gostaria de administrar os sensores e as permissões da residência?',
    contexto: '“Você pode rever essas permissões a qualquer momento pelo painel principal.”',
    opcoes: [
      { texto: 'Desativar sensores não essenciais', final: ['Menos sensores, mais controle', 'A casa desativa os sensores opcionais. Por um instante, uma luz continua acesa no corredor — e então também se apaga.'] },
      { texto: 'Revisar cada permissão agora', final: ['Acesso não identificado', 'Nos registros, você encontra uma permissão ativa que não se lembra de ter concedido. A tela escurece antes que consiga abrir os detalhes.'] },
      { texto: 'Manter apenas os controles básicos', final: ['Uma rotina mais simples', 'A Residência mantém as funções essenciais e deixa os recursos experimentais desligados. A porta da sala se abre para você.'] }
    ]
  }
};

document.getElementById('btn-jogar').addEventListener('click', iniciarCutscene);
btnContinuar.addEventListener('click', avancarCutscene);
document.getElementById('btn-pular').addEventListener('click', () => {
  iniciarCenaPergunta('confirmacao');
});
document.getElementById('btn-config').addEventListener('click', () => dialogConfig.showModal());
document.getElementById('btn-credito').addEventListener('click', () => dialogCreditos.showModal());
document.getElementById('btn-voltar').addEventListener('click', () => mostrarTela(telas.inicio));

document.querySelectorAll('.resposta').forEach(botao => {
  botao.addEventListener('click', () => {
    if (botao.dataset.resposta === 'sim') {
      iniciarCenaPergunta('inicio');
      return;
    }
    if (botao.dataset.resposta === 'informacoes') {
      iniciarCenaPergunta('informacoes');
      return;
    }

    mostrarTela(telas.tarde, true);
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
