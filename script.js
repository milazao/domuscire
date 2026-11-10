// Seleção das telas
const telaInicial = document.getElementById('tela-inicial');
const cutscene = document.getElementById('cutscene');
const perguntaInicial = document.getElementById('pergunta-inicial');
const telaTarde = document.getElementById('tela-tarde');

const btnJogar = document.getElementById('btn-jogar');
const btnConfig = document.getElementById('btn-config');
const btnCredito = document.getElementById('btn-credito');

const respostas = document.querySelectorAll('.resposta');

let cutsceneTimeouts = [];

// Função para trocar telas
function mostrarTela(tela) {
  [telaInicial, cutscene, perguntaInicial, telaTarde].forEach(t => t.classList.remove('ativa'));
  tela.classList.add('ativa');
}

// Função para rodar a cutscene com delay
function rodarCutscene() {
  mostrarTela(cutscene);

  const textos = cutscene.querySelectorAll('.texto-cutscene p');
  textos.forEach(p => { p.style.opacity = 0; });

  let delay = 1000;
  textos.forEach((p, i) => {
    const t = setTimeout(() => {
      p.style.opacity = 1;
    }, delay);
    cutsceneTimeouts.push(t);
    delay += 4000;
  });

  // Após mostrar toda a cutscene, mostra a pergunta inicial
  cutsceneTimeouts.push(setTimeout(() => {
    mostrarTela(perguntaInicial);
  }, delay));
}

// Evento clique jogar
btnJogar.addEventListener('click', () => {
  rodarCutscene();
});

// Evento clique configurações (pode ser expandido)
btnConfig.addEventListener('click', () => {
  alert("Configurações ainda não implementadas.");
});

// Evento clique crédito
btnCredito.addEventListener('click', () => {
  alert("Créditos: Milps Julips");
});

// Evento respostas
respostas.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const resposta = e.target.getAttribute('data-resposta');
    if (resposta === 'sim') {
      alert("O jogo seguirá para a próxima pergunta (em desenvolvimento).");
      // Aqui você pode iniciar o caminho narrativo do jogo
    } else {
      mostrarTela(telaTarde);
      setTimeout(() => {
        mostrarTela(telaInicial);
      }, 3000);
    }
  });
});

// Animar canvas cutscene (formas geométricas abstratas)
const canvas = document.getElementById('canvas-cutscene');
const ctx = canvas.getContext('2d');
let width, height;
function resizeCanvas() {
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const shapes = [];
const maxShapes = 15;

class Shape {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = 20 + Math.random() * 40;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.angle = Math.random() * Math.PI * 2;
    this.color = `rgba(15, 76, 255, ${0.1 + Math.random() * 0.3})`;
    this.type = Math.floor(Math.random() * 3); // 0: rect, 1: circle, 2: triangle
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.angle += 0.01;
    if (this.x < -this.size) this.x = width + this.size;
    if (this.x > width + this.size) this.x = -this.size;
    if (this.y < -this.size) this.y = height + this.size;
    if (this.y > height + this.size) this.y = -this.size;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    switch (this.type) {
      case 0:
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        break;
      case 1:
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 2:
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.closePath();
        ctx.fill();
        break;
    }
    ctx.restore();
  }
}

for (let i = 0; i < maxShapes; i++) {
  shapes.push(new Shape());
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  shapes.forEach(shape => {
    shape.update();
    shape.draw(ctx);
  });
  requestAnimationFrame(animate);
}

animate();
