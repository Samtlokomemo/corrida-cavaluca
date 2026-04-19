const cavalos = [
    { nome: 'James Baxter', img: 'cavalos/jamesbaxter.png' },
    { nome: 'Lillia', img: 'cavalos/lillia.png' },
    { nome: 'Mula Sem Cabeça', img: 'cavalos/mulasemcabeca.png' },
    { nome: 'Pé de Pano', img: 'cavalos/pedepano.png' },
    { nome: 'Rainbow Dash', img: 'cavalos/rainbowdash.png' }
];

const estado = {
    em_corrida: false,
    cavalos_posicoes: {},
    cavalos_tempos: {}
};

const container = document.getElementById('cavalos-container');
const hud = document.getElementById('hud');
const hudToggle = document.getElementById('hud-toggle');

// Função de easing com Curva de Bézier cúbica (easeInOutCubic)
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Inicializar cavalos
function inicializarCavalos() {
    container.innerHTML = '';
    estado.cavalos_posicoes = {};
    estado.cavalos_tempos = {};

    cavalos.forEach((cavalo, index) => {
        const cavaloEl = document.createElement('div');
        cavaloEl.className = 'cavalo';
        cavaloEl.id = `cavalo-${index}`;

        const img = document.createElement('img');
        img.src = cavalo.img;
        img.alt = cavalo.nome;
        img.title = cavalo.nome;

        cavaloEl.appendChild(img);
        container.appendChild(cavaloEl);

        estado.cavalos_posicoes[index] = 0;
    });

    hud.innerHTML = '';
    cavalos.forEach((cavalo, index) => {
        const hudItem = document.createElement('div');
        hudItem.className = 'hud-item';
        hudItem.innerHTML = `
            <div class="hud-name">${cavalo.nome}</div>
            <div class="hud-row">
                <span class="hud-label">Tempo:</span>
                <span class="hud-value" id="cavalo-time-${index}">0.00s</span>
            </div>
            <div class="hud-row">
                <span class="hud-label">Velocidade:</span>
                <span class="hud-value" id="cavalo-speed-${index}">0 px/s</span>
            </div>
        `;
        hud.appendChild(hudItem);
    });
}


function iniciarCorrida() {
    if (estado.em_corrida) return;

    estado.em_corrida = true;

    // Gerar tempos aleatórios para cada cavalo
    const temposFinais = {};
    cavalos.forEach((_, index) => {
        temposFinais[index] = Math.random() * 3000 + 3000;
        estado.cavalos_tempos[index] = temposFinais[index];
    });


    const tempoInicio = Date.now();
    let ultimoTempoFrame = tempoInicio;

    // Calcular o tamanho do cavalo dinamicamente
    const cavaloTemp = document.createElement('div');
    cavaloTemp.className = 'cavalo';
    document.body.appendChild(cavaloTemp);
    const tamanhoDoCavalo = cavaloTemp.offsetWidth;
    document.body.removeChild(cavaloTemp);

    // Posição final: antes da linha de chegada (right: 20px)
    const posicaoFinal = window.innerWidth - 40; // 20px da borda + 20px de margem

    // Distância que o cavalo precisa percorrer (da posição inicial 30px até a posição final, subtraindo a largura do cavalo)
    const distanciaTotal = posicaoFinal - 30 - tamanhoDoCavalo;

    const intervalo = setInterval(() => {
        const agora = Date.now();
        const tempoDecorrido = agora - tempoInicio;
        const dt = Math.max((agora - ultimoTempoFrame) / 1000, 0.01);
        ultimoTempoFrame = agora;
        let todosTerminaram = true;

        cavalos.forEach((_, index) => {
            const cavaloEl = document.getElementById(`cavalo-${index}`);
            const tempoFinal = estado.cavalos_tempos[index];

            let posicao;
            if (tempoDecorrido < tempoFinal) {
                todosTerminaram = false;
                const progresso = tempoDecorrido / tempoFinal;
                const progressoEasing = easeInOutCubic(progresso);
                posicao = distanciaTotal * progressoEasing;
                cavaloEl.style.left = posicao + 'px';
                cavaloEl.classList.add('correndo');
            } else {
                posicao = distanciaTotal;
                cavaloEl.style.left = distanciaTotal + 'px';
                cavaloEl.classList.remove('correndo');
            }

            const delta = posicao - estado.cavalos_posicoes[index];
            const velocidade = tempoDecorrido < tempoFinal ? Math.round(delta / dt) : 0;
            estado.cavalos_posicoes[index] = posicao;

            const tempoEl = document.getElementById(`cavalo-time-${index}`);
            const velocidadeEl = document.getElementById(`cavalo-speed-${index}`);
            if (tempoEl) {
                const tempoExibido = Math.min(tempoDecorrido, tempoFinal) / 1000;
                tempoEl.textContent = `${tempoExibido.toFixed(2)}s`;
            }
            if (velocidadeEl) {
                velocidadeEl.textContent = `${velocidade} px/s`;
            }
        });

        if (todosTerminaram) {
            clearInterval(intervalo);
            finalizarCorrida();
        }
    }, 16);
}

function finalizarCorrida() {
    estado.em_corrida = false;


    const resultadosOrdenados = Object.entries(estado.cavalos_tempos)
        .map(([index, tempo]) => ({
            nome: cavalos[parseInt(index)].nome,
            img: cavalos[parseInt(index)].img,
            tempo: tempo
        }))
        .sort((a, b) => a.tempo - b.tempo);


    setTimeout(() => {
        mostrarPodio(resultadosOrdenados);
    }, 1000);
    

}

window.addEventListener('load', () => {
    inicializarCavalos();
    setTimeout(iniciarCorrida, 500);

    if (hudToggle) {
        hudToggle.addEventListener('click', () => {
            hud.classList.toggle('hud-visible');
        });
    }
});

function mostrarPodio(resultados) {
    const modal = document.getElementById('podium-modal');
    modal.style.display = 'flex';

    resultados.forEach((cavalo, index) => {
        const pos = index + 1;
        const imgElement = document.getElementById(`pos-${pos}-img`);
        const nameElement = document.getElementById(`pos-${pos}-name`);

        if (imgElement && nameElement) {
            imgElement.innerHTML = `<img src="${cavalo.img}" alt="${cavalo.nome}">`;
            nameElement.textContent = cavalo.nome;
        }
    });
}

function reiniciarJogo() {
    window.location.href = 'choose.html';
}
function verEstatisticas() {
    window.location.href = 'estatisticas.html';
}


function dispararConfetes() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#FDD134', '#1fa64a', '#f44336', '#2196F3', '#FFFFFF'];

    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 6
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
            p.y += p.speed;
            p.x += Math.sin(p.angle);
        });
        if (estado.em_corrida === false) requestAnimationFrame(draw);
    }
    draw();
}