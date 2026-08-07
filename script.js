/**
 * ==========================================================================
 * KINGDOM PROTECTION - REMASTERED SCRIPT (CORRIGIDO)
 * (Com Cartas Épicas+, Modos Hardcore/Sandbox e Easter Eggs Secreto)
 * ==========================================================================
 */

// ==========================================================================
// 1. BANCO DE DADOS E CONFIGURAÇÕES DE RARIDADE
// ==========================================================================
const CONFIG = {
    tamanhoTabuleiroInicial: 6,
    ouroInicial: 15,
    custoReroll: 2,
    hpBaseInimigo: 100,
    aumentoHpInimigoPorOnda: 1.1,
    tempoAFKRei: 5 * 60 * 1000 // 5 minutos em milissegundos
};

const RARIDADES = {
    COMUM: { nome: 'Comum', cor: '#aaaaaa', chance: 0.50, multStatus: 1.0, multCusto: 1, classe: 'raridade-comum' },
    INCOMUM: { nome: 'Incomum', cor: '#28a745', chance: 0.25, multStatus: 1.3, multCusto: 1.5, classe: 'raridade-incomum' },
    RARO: { nome: 'Raro', cor: '#007bff', chance: 0.15, multStatus: 1.7, multCusto: 2, classe: 'raridade-raro' },
    EPICO: { nome: 'Épico', cor: '#6f42c1', chance: 0.07, multStatus: 2.5, multCusto: 3.5, classe: 'raridade-epico' },
    LENDARIO: { nome: 'Lendário', cor: '#fd7e14', chance: 0.025, multStatus: 4.5, multCusto: 6, classe: 'raridade-lendario' },
    MITICO: { nome: 'Mítico', cor: '#dc3545', chance: 0.005, multStatus: 8.0, multCusto: 10, classe: 'raridade-mitico' }
};

// Base de Tropas Padrão
const TROPAS_BASE = [
    { id: 'espada', nome: 'Espadachim', ataque: 10, hp: 50, classe: 'Guerreiro', elemento: 'Físico', icone: '⚔️', custoBase: 3 },
    { id: 'arco', nome: 'Arqueiro', ataque: 15, hp: 30, classe: 'Ranger', elemento: 'Físico', icone: '🏹', custoBase: 3 },
    { id: 'mago', nome: 'Mago Aprendiz', ataque: 20, hp: 25, classe: 'Mago', elemento: 'Fogo', icone: '🧙‍♂️', custoBase: 4 },
    { id: 'escudo', nome: 'Guarda Real', ataque: 5, hp: 80, classe: 'Guardião', elemento: 'Físico', icone: '🛡️', custoBase: 4 }
];

// CARTAS ÉPICAS+ (REAJUSTADAS PARA A NOVA REALIDADE DE PODER)
const CARTAS_EPICAS_PLUS = [
    { id: 'c1', nome: 'Mestre Recruta de Espada', classe: 'Guerreiro', elemento: 'Físico', ataque: 45, hp: 60, custoBase: 12, raridadeForçada: RARIDADES.EPICO, icone: '🗡️' },
    { id: 'c2', nome: 'Arqueiro das Sombras', classe: 'Ranger', elemento: 'Sombra', ataque: 65, hp: 35, custoBase: 15, raridadeForçada: RARIDADES.EPICO, icone: '🏹' },
    { id: 'c3', nome: 'Mago de Fogo Devastador', classe: 'Mago', elemento: 'Fogo', ataque: 85, hp: 40, custoBase: 18, raridadeForçada: RARIDADES.EPICO, icone: '🔥' },
    { id: 'c4', nome: 'Paladino da Luz Sagrada', classe: 'Guerreiro', elemento: 'Sagrado', ataque: 60, hp: 140, custoBase: 24, raridadeForçada: RARIDADES.LENDARIO, icone: '🛡️' },
    { id: 'c5', nome: 'Dragão Vermelho Ancestral', classe: 'Besta', elemento: 'Fogo', ataque: 140, hp: 130, custoBase: 35, raridadeForçada: RARIDADES.LENDARIO, icone: '🐉' },
    { id: 'c6', nome: 'Elementar de Gelo Eterno', classe: 'Mago', elemento: 'Gelo', ataque: 70, hp: 80, custoBase: 20, raridadeForçada: RARIDADES.EPICO, icone: '❄️' },
    { id: 'c7', nome: 'Assassino Vorpal', classe: 'Ranger', elemento: 'Sombra', ataque: 120, hp: 45, custoBase: 30, raridadeForçada: RARIDADES.LENDARIO, icone: '🗡️' },
    { id: 'c8', nome: 'Golem de Pedra Ancestral', classe: 'Guardião', elemento: 'Terra', ataque: 35, hp: 220, custoBase: 28, raridadeForçada: RARIDADES.EPICO, icone: '🗿' },
    { id: 'c9', nome: 'Fênix Imortal', classe: 'Besta', elemento: 'Fogo', ataque: 160, hp: 90, custoBase: 42, raridadeForçada: RARIDADES.MITICO, icone: '🦅' },
    { id: 'c10', nome: 'Senhor do Trovão', classe: 'Mago', elemento: 'Trovão', ataque: 150, hp: 80, custoBase: 38, raridadeForçada: RARIDADES.MITICO, icone: '⚡' }
];

// Climas
const CLIMAS = [
    { id: 'sol', nome: 'Sol Radiante', icone: '☀️', efeitoDesc: '+10% Dano Aliado', classe: 'clima-sol' },
    { id: 'chuva', nome: 'Chuva Forte', icone: '🌧️', efeitoDesc: '-10% Dano Aliado, Cura Inimigo', classe: 'clima-chuva' },
    { id: 'neve', nome: 'Nevasca', icone: '❄️', efeitoDesc: 'Ataques Críticos Reduzidos', classe: 'clima-neve' },
    { id: 'tempestade', nome: 'Tempestade de Raios', icone: '⛈️', efeitoDesc: 'Raios causam dano aleatório', classe: 'clima-tempestade' },
    { id: 'eclipse', nome: 'Eclipse Sangrento', icone: '🌘', efeitoDesc: 'Inimigos têm +50% de Vida e Dano', classe: 'clima-eclipse' }
];

// ==========================================================================
// 2. ESTADO DO JOGO E PERSISTÊNCIA
// ==========================================================================
let estado = {
    ouro: CONFIG.ouroInicial,
    ondaAtual: 1,
    espacosMax: CONFIG.tamanhoTabuleiroInicial,
    danoGlobal: 1.0,
    tabuleiro: [],
    lojaAtual: [],
    climaAtual: CLIMAS[0],
    emCombate: false,
    inimigoAtual: null,
    dificuldade: 'cavaleiro',
    multiplicadorDiff: 1.0,
    modoHardcore: false,
    modoSandbox: false,
    cheatsUtilizados: false
};

let statsUsuario = JSON.parse(localStorage.getItem('kp_stats')) || {
    chefesMortos: 0,
    ouroGasto: 0,
    ondaMaxima: 0,
    tropasCompradas: 0,
    rerollsFeitos: 0,
    tesouroOcultoEncontrado: false,
    hardcoreVencido: false,
    possuiCartaFantasma: false
};

function salvarStats() {
    localStorage.setItem('kp_stats', JSON.stringify(statsUsuario));
}

// ==========================================================================
// 3. INICIALIZAÇÃO E MODOS DE JOGO
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // CORREÇÃO: Garante que a tela de jogo esteja invisível no começo
    const gameScreen = document.getElementById('game-screen');
    if (gameScreen) gameScreen.style.display = 'none';

    // Dificuldades Tradicionais
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const diff = e.target.getAttribute('data-diff');
            const mults = { 'escudeiro': 0.8, 'cavaleiro': 1.0, 'comandante': 1.5 };
            iniciarPartida(diff, mults[diff] || 1.0, false, false);
        });
    });

    // Modo Hardcore
    document.getElementById('btn-modo-hardcore')?.addEventListener('click', () => {
        iniciarPartida('HARDCORE', 2.0, true, false);
    });

    // Modo Sandbox
    document.getElementById('btn-modo-sandbox')?.addEventListener('click', () => {
        iniciarPartida('SANDBOX', 1.0, false, true);
    });

    setupEventListenersGlobais();
    setupEasterEggs();
});

function iniciarPartida(diffNome, multiplicador, hardcore = false, sandbox = false) {
    estado.dificuldade = diffNome;
    estado.multiplicadorDiff = multiplicador;
    estado.modoHardcore = hardcore;
    estado.modoSandbox = sandbox;
    
    if (sandbox) {
        estado.ouro = 999999;
    } else {
        estado.ouro = CONFIG.ouroInicial;
    }

    const startScreen = document.getElementById('start-screen');
    const headerLobby = document.getElementById('header-lobby');
    const gameScreen = document.getElementById('game-screen');

    // CORREÇÃO: Esconde adequadamente o lobby e mostra o jogo
    if (startScreen) startScreen.style.display = 'none';
    if (headerLobby) headerLobby.style.display = 'none';
    if (gameScreen) gameScreen.style.display = 'block';

    // Desabilita botão de salvar no Modo Hardcore
    const btnSalvar = document.getElementById('salvar-jogo');
    if (btnSalvar && hardcore) {
        btnSalvar.disabled = true;
        btnSalvar.title = "Salvamento desabilitado no Modo Hardcore!";
    }

    initGame();
    
    if (hardcore) showToast("🔥 Modo Hardcore Ativado! Uma vida. Sem saves.", "error");
    if (sandbox) showToast("🛠️ Modo Sandbox Ativado! Recursos Infinitos.", "success");
}

function initGame() {
    estado.tabuleiro = Array(estado.espacosMax).fill(null);
    
    // Easter Egg: Carta Starter Única do Fantasma do Dev
    if (statsUsuario.possuiCartaFantasma) {
        estado.tabuleiro[0] = {
            idUnico: 'dev_ghost_card',
            nome: 'Bênção do Dev',
            classe: 'Criador',
            elemento: 'Cósmico',
            icone: '👻',
            raridade: RARIDADES.MITICO,
            ataque: 1000,
            hp: 1500,
            hpAtual: 1500,
            custo: 0
        };
    }

    atualizarUIOuro();
    atualizarUIOnda();
    rolarClima();
    gerarLoja();
    renderizarTabuleiro();
    iniciarTimerReiEsquecido();
    testarInvocacaoFantasmaDev();
}

function atualizarUIOuro() {
    const el = document.getElementById('ouro-display');
    if (el) el.innerText = estado.modoSandbox ? '∞' : estado.ouro;
}

function atualizarUIOnda() {
    const el = document.getElementById('onda-display');
    if (el) el.innerText = estado.ondaAtual;
}

// ==========================================================================
// 4. SISTEMA DE LOJA & CARTAS ÉPICAS+
// ==========================================================================
function obterRaridadeAleatoria() {
    const roll = Math.random();
    const raridades = [RARIDADES.MITICO, RARIDADES.LENDARIO, RARIDADES.EPICO, RARIDADES.RARO, RARIDADES.INCOMUM, RARIDADES.COMUM];
    for (let r of raridades) {
        if (roll < r.chance) return r;
    }
    return RARIDADES.COMUM;
}

function gerarTropaAleatoria() {
    // CORREÇÃO: Reduzido de 35% (0.35) para 1% (0.01) para balancear o jogo.
    if (Math.random() < 0.01) {
        const cartaEpica = CARTAS_EPICAS_PLUS[Math.floor(Math.random() * CARTAS_EPICAS_PLUS.length)];
        return {
            idUnico: Date.now() + Math.random().toString(36).substr(2, 9),
            baseId: cartaEpica.id,
            nome: cartaEpica.nome,
            classe: cartaEpica.classe,
            elemento: cartaEpica.elemento,
            icone: cartaEpica.icone,
            raridade: cartaEpica.raridadeForçada,
            ataque: cartaEpica.ataque,
            hp: cartaEpica.hp,
            hpAtual: cartaEpica.hp,
            custo: cartaEpica.custoBase
        };
    }

    // Caso contrário, gera uma tropa base tradicional escalada
    const base = TROPAS_BASE[Math.floor(Math.random() * TROPAS_BASE.length)];
    const raridade = obterRaridadeAleatoria();

    return {
        idUnico: Date.now() + Math.random().toString(36).substr(2, 9),
        baseId: base.id,
        nome: base.nome,
        classe: base.classe,
        elemento: base.elemento,
        icone: base.icone,
        raridade: raridade,
        ataque: Math.floor(base.ataque * raridade.multStatus),
        hp: Math.floor(base.hp * raridade.multStatus),
        hpAtual: Math.floor(base.hp * raridade.multStatus),
        custo: Math.floor(base.custoBase * raridade.multCusto)
    };
}

function gerarLoja() {
    estado.lojaAtual = [];
    for (let i = 0; i < 3; i++) {
        estado.lojaAtual.push(gerarTropaAleatoria());
    }
    renderizarLoja();
}

function rerollLoja() {
    if (estado.modoSandbox || estado.ouro >= CONFIG.custoReroll) {
        if (!estado.modoSandbox) estado.ouro -= CONFIG.custoReroll;
        
        statsUsuario.ouroGasto += CONFIG.custoReroll;
        statsUsuario.rerollsFeitos += 1;
        salvarStats();

        atualizarUIOuro();
        gerarLoja();
        showToast("Loja renovada!", "info");
    } else {
        showToast("Ouro insuficiente!", "error");
    }
}

function renderizarLoja() {
    const container = document.getElementById('lista-cartas');
    if (!container) return;
    
    container.innerHTML = '';
    estado.lojaAtual.forEach((tropa, index) => {
        const carta = document.createElement('div');
        carta.className = `carta-tropa ${tropa.raridade.classe}`;
        carta.innerHTML = `
            <div class="tag-raridade-badge" style="color: ${tropa.raridade.cor}">${tropa.raridade.nome}</div>
            <div class="carta-icone" style="font-size: 2.2em; margin: 5px 0;">${tropa.icone}</div>
            <div class="carta-nome">${tropa.nome}</div>
            <div class="sinergia" style="font-size: 0.75em;">${tropa.classe} | ${tropa.elemento}</div>
            <div class="carta-stats">⚔️ ${tropa.ataque} | ❤️ ${tropa.hp}</div>
            <button class="btn-comprar">🪙 ${tropa.custo}</button>
        `;
        carta.addEventListener('click', () => comprarTropa(tropa, index));
        container.appendChild(carta);
    });
}

function comprarTropa(tropa, indexLoja) {
    if (!estado.modoSandbox && estado.ouro < tropa.custo) {
        showToast("Ouro insuficiente!", "error");
        return;
    }
    
    const slotLivre = estado.tabuleiro.findIndex(slot => slot === null);
    if (slotLivre === -1) {
        showToast("Tabuleiro cheio!", "error");
        return;
    }

    if (!estado.modoSandbox) estado.ouro -= tropa.custo;
    
    statsUsuario.ouroGasto += tropa.custo;
    statsUsuario.tropasCompradas += 1;
    salvarStats();

    atualizarUIOuro();
    estado.tabuleiro[slotLivre] = tropa;
    estado.lojaAtual.splice(indexLoja, 1);

    renderizarLoja();
    renderizarTabuleiro();
    showToast(`${tropa.nome} adicionado ao exército!`, "success");
}

function venderTropa(indexBoard) {
    if (estado.emCombate) return;
    
    const tropa = estado.tabuleiro[indexBoard];
    if (!tropa) return;

    const valorVenda = Math.max(1, Math.floor(tropa.custo / 2));
    if (!estado.modoSandbox) estado.ouro += valorVenda;

    estado.tabuleiro[indexBoard] = null;
    atualizarUIOuro();
    renderizarTabuleiro();
    showToast(`${tropa.nome} vendido por 🪙 ${valorVenda}`, "info");
}

// ==========================================================================
// 5. RENDERIZAÇÃO DO TABULEIRO & SACRIFÍCIO DE ALMA
// ==========================================================================
function renderizarTabuleiro() {
    const container = document.getElementById('grid-tabuleiro');
    if (!container) return;
    
    container.innerHTML = '';
    const ocupados = estado.tabuleiro.filter(t => t !== null).length;
    
    const dica = document.querySelector('.dica-texto');
    if (dica) dica.innerText = `Ocupado: ${ocupados} / ${estado.espacosMax} (Double-Click em Mítico para Sacrifício)`;

    estado.tabuleiro.forEach((tropa, index) => {
        if (tropa) {
            const card = document.createElement('div');
            card.className = `carta-tropa ${tropa.raridade.classe}`;
            card.innerHTML = `
                <div class="carta-icone" style="font-size: 2em;">${tropa.icone}</div>
                <div class="carta-nome">${tropa.nome}</div>
                <div class="sinergia" style="font-size: 0.7em;">${tropa.classe} • ${tropa.elemento}</div>
                <div class="carta-stats">⚔️ ${tropa.ataque} | ❤️ ${tropa.hpAtual}/${tropa.hp}</div>
            `;
            
            card.addEventListener('click', (e) => {
                if (e.detail === 1) {
                    setTimeout(() => { if (!card.dataset.doubleClicked) venderTropa(index); }, 250);
                }
            });

            card.addEventListener('dblclick', () => {
                card.dataset.doubleClicked = "true";
                if (tropa.raridade.nome === RARIDADES.MITICO.nome) {
                    executarSacrificioDeAlma(index, tropa);
                }
                setTimeout(() => { delete card.dataset.doubleClicked; }, 500);
            });

            container.appendChild(card);
        } else {
            const slot = document.createElement('div');
            slot.className = 'slot-vazio';
            slot.innerText = 'Vazio';
            container.appendChild(slot);
        }
    });
}

function executarSacrificioDeAlma(index, tropa) {
    estado.tabuleiro[index] = null;
    estado.espacosMax += 3;
    
    for (let i = 0; i < 3; i++) estado.tabuleiro.push(null);
    
    estado.danoGlobal += 1.0; 
    
    renderizarTabuleiro();
    showToast(`🔥 SACRIFÍCIO DE ALMA! ${tropa.nome} foi destruído. +3 Slots & +100% Dano Global!`, "success");
}

// ==========================================================================
// 6. SISTEMA DE COMBATE & FORMULAÇÃO DE SINERGIAS
// ==========================================================================
function rolarClima() {
    if (Math.random() < 0.6 || estado.ondaAtual === 1) {
        let opcoes = CLIMAS.filter(c => c.id !== 'eclipse' || estado.ondaAtual > 5);
        estado.climaAtual = opcoes[Math.floor(Math.random() * opcoes.length)];
        renderizarClima();
    }
}

function renderizarClima() {
    const display = document.getElementById('clima-display');
    if (!display) return;
    display.innerHTML = `<span>${estado.climaAtual.icone}</span> ${estado.climaAtual.nome}`;
    display.className = estado.climaAtual.classe;
}

function verificarSinergiaReinoPerdido() {
    const raridadesPresentes = new Set(
        estado.tabuleiro.filter(t => t !== null).map(t => t.raridade.nome)
    );
    const requeridas = [RARIDADES.COMUM.nome, RARIDADES.INCOMUM.nome, RARIDADES.RARO.nome, RARIDADES.EPICO.nome, RARIDADES.LENDARIO.nome];
    const possuiTodas = requeridas.every(r => raridadesPresentes.has(r));

    if (possuiTodas) {
        showToast("👑 SINERGIA PERFEIÇÃO REAL ATIVADA! Dano multiplicado por 10x!", "success");
        return 10.0;
    }
    return 1.0;
}

function gerarInimigo() {
    let baseHp = CONFIG.hpBaseInimigo * Math.pow(CONFIG.aumentoHpInimigoPorOnda, estado.ondaAtual - 1);
    let baseAtk = 10 + (estado.ondaAtual * 4);
    let isBoss = estado.ondaAtual % 5 === 0;

    baseHp *= estado.multiplicadorDiff;
    baseAtk *= estado.multiplicadorDiff;

    if (isBoss) { baseHp *= 2.5; baseAtk *= 1.8; }
    if (estado.climaAtual.id === 'eclipse') { baseHp *= 1.5; baseAtk *= 1.5; }

    estado.inimigoAtual = {
        nome: isBoss ? `Chefe Titã (Onda ${estado.ondaAtual})` : `Horda Inimiga (Onda ${estado.ondaAtual})`,
        hpMax: Math.floor(baseHp),
        hpAtual: Math.floor(baseHp),
        ataque: Math.floor(baseAtk),
        isBoss: isBoss
    };
}

async function iniciarBatalha() {
    const tropasVivas = estado.tabuleiro.filter(t => t !== null);
    if (tropasVivas.length === 0) {
        showToast("Posicione tropas antes de batalhar!", "error");
        return;
    }

    if (estado.ondaAtual === 66 && estado.ouro === 666) {
        estado.climaAtual = CLIMAS.find(c => c.id === 'eclipse');
        renderizarClima();
        document.body.style.filter = "invert(0.8)";
        showToast("🌑 O ECLIPSE ABSOLUTO CHEGOU!", "error");
    }

    estado.emCombate = true;
    gerarInimigo();
    estado.tabuleiro.forEach(t => { if (t) t.hpAtual = t.hp; });
    
    renderizarTabuleiro();
    atualizarBarraInimigo();

    const multReinoPerdido = verificarSinergiaReinoPerdido();

    while (estado.inimigoAtual.hpAtual > 0 && estado.tabuleiro.some(t => t && t.hpAtual > 0)) {
        await processarTurnoCombate(multReinoPerdido);
        await sleep(800);
    }

    finalizarBatalha();
}

function atualizarBarraInimigo() {
    const bar = document.getElementById('inimigo-progress-bar');
    const text = document.getElementById('inimigo-hp-text');
    if (!bar || !text || !estado.inimigoAtual) return;

    const pct = Math.max(0, (estado.inimigoAtual.hpAtual / estado.inimigoAtual.hpMax) * 100);
    bar.style.width = `${pct}%`;
    text.innerText = `${estado.inimigoAtual.nome}: ${estado.inimigoAtual.hpAtual} / ${estado.inimigoAtual.hpMax} HP`;
}

async function processarTurnoCombate(multSinergia = 1.0) {
    let danoTotalAliado = 0;

    estado.tabuleiro.forEach(tropa => {
        if (tropa && tropa.hpAtual > 0) {
            let dano = Math.floor(tropa.ataque * estado.danoGlobal * multSinergia);
            danoTotalAliado += dano;
        }
    });

    estado.inimigoAtual.hpAtual -= danoTotalAliado;
    atualizarBarraInimigo();

    if (estado.inimigoAtual.hpAtual <= 0) return;

    const alvos = estado.tabuleiro.filter(t => t && t.hpAtual > 0);
    if (alvos.length > 0) {
        const alvo = alvos[Math.floor(Math.random() * alvos.length)];
        alvo.hpAtual -= estado.inimigoAtual.ataque;
        if (alvo.hpAtual <= 0) {
            const idx = estado.tabuleiro.indexOf(alvo);
            estado.tabuleiro[idx] = null;
            showToast(`${alvo.nome} foi derrotado!`, "error");
        }
    }

    renderizarTabuleiro();
}

function finalizarBatalha() {
    estado.emCombate = false;
    document.body.style.filter = "none";

    const venceu = estado.inimigoAtual.hpAtual <= 0;

    if (venceu) {
        let recompensa = 8 + estado.ondaAtual;
        if (!estado.modoSandbox) estado.ouro += recompensa;

        if (estado.ondaAtual > statsUsuario.ondaMaxima) {
            statsUsuario.ondaMaxima = estado.ondaAtual;
        }
        salvarStats();

        estado.ondaAtual++;
        showToast(`Vitória! +${recompensa} Ouro`, "success");
        
        document.getElementById('reward-modal').style.display = 'flex';
    } else {
        if (estado.modoHardcore) {
            showToast("💀 GAME OVER! Você morreu no Modo Hardcore.", "error");
            setTimeout(() => location.reload(), 3000);
            return;
        } else {
            showToast("Derrota! Reorganize seu exército.", "error");
        }
    }

    atualizarUIOuro();
    atualizarUIOnda();
    rolarClima();
    gerarLoja();
    renderizarTabuleiro();
}

// ==========================================================================
// 7. SISTEMA DE EASTER EGGS E MECÂNICAS SECRETAS
// ==========================================================================
function setupEasterEggs() {
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'p', 'j'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                estado.ouro += 10000;
                estado.climaAtual = CLIMAS.find(c => c.id === 'eclipse');
                renderizarClima();
                atualizarUIOuro();
                showToast("🎮 CÓDIGO PEDRO JORGE ATIVADO! +10000 Ouro & Eclipse Sangrento!", "success");
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

// CORREÇÃO DO CONSOLE DEV: Uso do e.code para não conflitar com a tecla Shift
    let bufferDevKeys = [];
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey) {
            // Se for Y ou 7, joga no buffer
            if (e.code === 'KeyY' || e.code === 'Digit7') {
                bufferDevKeys.push(e.code);
                
                if (bufferDevKeys.length > 2) bufferDevKeys.shift();
                
                if (bufferDevKeys[0] === 'KeyY' && bufferDevKeys[1] === 'Digit7') {
                    const devModal = document.getElementById('dev-console-modal');
                    if (devModal) devModal.style.display = 'flex';
                    showToast("🛠️ Console Dev Aberto", "info");
                    bufferDevKeys = []; // Reseta o buffer
                }
            }
        } else {
            bufferDevKeys = [];
        }
    });
// Variáveis para rastrear os limites do Console Secreto
let limitesConsoleJogador = {
    cartas: 0,
    slots: 0,
    clima: 0
};

// 1. Atalho Ctrl + Shift + E para abrir o Console Limitado
document.addEventListener('keydown', (e) => {
    // Verifica se apertou Ctrl, Shift e o 'E' (KeyE)
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyE') {
        const secretModal = document.getElementById('player-secret-modal');
        if (secretModal) {
            secretModal.style.display = 'flex';
            showToast("Console Secreto Aberto!", "info");
        }
    }
});

// 2. Lógica de Adicionar Cartas (Limite: 3)
document.getElementById('player-btn-invocar')?.addEventListener('click', () => {
    if (limitesConsoleJogador.cartas >= 3) {
        showToast("Limite de 3 cartas atingido!", "error");
        return;
    }

    const idTropa = document.getElementById('player-select-carta').value;
    const tropaBase = TROPAS_BASE.find(t => t.id === idTropa); // Busca a tropa base
    
    if (tropaBase) {
        const raridade = RARIDADES.RARO; // Força a carta a ser sempre RARA
        const carta = {
            idUnico: Date.now() + Math.random().toString(36).substr(2, 9),
            baseId: tropaBase.id,
            nome: `${tropaBase.nome} (Secreta)`,
            classe: tropaBase.classe,
            elemento: tropaBase.elemento,
            icone: tropaBase.icone,
            raridade: raridade,
            ataque: Math.floor(tropaBase.ataque * raridade.multStatus),
            hp: Math.floor(tropaBase.hp * raridade.multStatus),
            hpAtual: Math.floor(tropaBase.hp * raridade.multStatus),
            custo: 0 // Cartas do console vêm de graça
        };

        const slot = estado.tabuleiro.findIndex(s => s === null);
        if (slot !== -1) {
            estado.tabuleiro[slot] = carta;
            limitesConsoleJogador.cartas++;
            
            // Atualiza o contador na tela
            document.getElementById('count-cartas').innerText = `${limitesConsoleJogador.cartas}/3`;
            
            if (limitesConsoleJogador.cartas >= 3) {
                document.getElementById('player-btn-invocar').disabled = true;
            }
            
            renderizarTabuleiro();
            showToast(`Invocado: ${carta.nome} Raro!`, "success");
        } else {
            showToast("Tabuleiro cheio! Venda algo primeiro.", "error");
        }
    }
});

// 3. Lógica de Adicionar Slots Extras (Limite: 6)
document.getElementById('player-btn-slots')?.addEventListener('click', () => {
    const inputSlots = parseInt(document.getElementById('player-input-slots').value) || 0;
    
    if (inputSlots <= 0) return;

    if (limitesConsoleJogador.slots + inputSlots > 6) {
        showToast(`Você só pode adicionar mais ${6 - limitesConsoleJogador.slots} slots!`, "error");
        return;
    }

    estado.espacosMax += inputSlots;
    for (let i = 0; i < inputSlots; i++) {
        estado.tabuleiro.push(null);
    }
    
    limitesConsoleJogador.slots += inputSlots;
    document.getElementById('count-slots').innerText = `${limitesConsoleJogador.slots}/6`;
    
    if (limitesConsoleJogador.slots >= 6) {
        document.getElementById('player-btn-slots').disabled = true;
    }
    
    renderizarTabuleiro();
    showToast(`+${inputSlots} slots secretos adicionados!`, "success");
});

// 4. Lógica de Mudar o Clima (Limite: 1)
document.getElementById('player-btn-clima')?.addEventListener('click', () => {
    if (limitesConsoleJogador.clima >= 1) {
        showToast("Você só pode mudar o clima uma vez por partida!", "error");
        return;
    }

    const climaId = document.getElementById('player-select-clima').value;
    const novoClima = CLIMAS.find(c => c.id === climaId); // Busca o clima nas constantes globais
    
    if (novoClima) {
        estado.climaAtual = novoClima;
        limitesConsoleJogador.clima++;
        
        document.getElementById('count-clima').innerText = `${limitesConsoleJogador.clima}/1`;
        document.getElementById('player-btn-clima').disabled = true;
        
        renderizarClima();
        showToast(`O clima foi alterado pela vontade do jogador!`, "info");
    }
});
    document.getElementById('dev-input-carta').placeholder = "ID (c1, dev_ghost_card, adm_card, espada...)";

    document.getElementById('dev-btn-invocar')?.addEventListener('click', () => {
        const id = document.getElementById('dev-input-carta').value.trim().toLowerCase();
        let carta;

        if (id === 'dev_ghost_card') {
            // Carta secreta do Dev
            carta = {
                id: 'dev_ghost_card',
                nome: 'Bênção do Dev',
                classe: 'Criador',
                elemento: 'Cósmico',
                icone: '👻',
                raridadeForçada: RARIDADES.MITICO,
                ataque: 1000,
                hp: 1500,
                custoBase: 0
            };
        } 
        else if (id === 'pkz_card') {
            // Carta secreta do Patrick
            carta = {
                id: 'pkz_card',
                nome: 'Bênção do PK',
                classe: 'Dev',
                elemento: 'Digital',
                icone: '🧑‍💻',
                raridadeForçada: RARIDADES.MITICO,
                ataque: 250,
                hp: 400,
                custoBase: 0
            };
        } 
        else if (id === 'caos_card') {
            // Carta secreta do Caos
            carta = {
                id: 'caos_card',
                nome: 'Buraco Negro',
                classe: 'Universo',
                elemento: 'Cósmico',
                icone: '🕳️',
                raridadeForçada: RARIDADES.MITICO,
                ataque: Infinity,
                hp: null,
                custoBase: 0
            };
        }
        else if (id === 'sacrifice') {
            // Carta secreta do Caos
            carta = {
                id: 'caos_card',
                nome: 'Carta Sacrifício',
                classe: 'Sacrifíco',
                elemento: 'Sagrado',
                icone: '❌',
                raridadeForçada: RARIDADES.MITICO,
                ataque: 0,
                hp: 0,
                custoBase: 0
            };
        }
        else if (id === 'the_rock') {
            // Carta de Pedra
            carta = {
                id: 'the_rock',
                nome: 'Pedra',
                classe: 'Mineral',
                elemento: 'Natural',
                icone: '🪨',
                raridadeForçada: RARIDADES.COMUM,
                ataque: 1,
                hp: 2,
                custoBase: 0
            };
        }
        else if (id === 'rei' || id === 'rei_esquecido') {
            // Carta do Rei Esquecido (Dádiva Ancestral)
            carta = {
                id: 'rei_esquecido',
                nome: 'Dádiva Ancestral',
                classe: 'Rei',
                elemento: 'Sagrado',
                icone: '👑',
                raridadeForçada: RARIDADES.MITICO,
                ataque: 500,
                hp: 1000,
                custoBase: 0
            };
        } else {
            // Verifica se é uma tropa base para convertê-la na versão Mítica
            const tropaBase = TROPAS_BASE.find(t => t.id === id);
            if (tropaBase) {
                const raridade = RARIDADES.MITICO;
                carta = {
                    id: tropaBase.id,
                    nome: `${tropaBase.nome} (Mítico)`,
                    classe: tropaBase.classe,
                    elemento: tropaBase.elemento,
                    icone: tropaBase.icone,
                    raridadeForçada: raridade,
                    ataque: Math.floor(tropaBase.ataque * raridade.multStatus),
                    hp: Math.floor(tropaBase.hp * raridade.multStatus),
                    custoBase: Math.floor(tropaBase.custoBase * raridade.multCusto)
                };
            } else {
                // Caso contrário, busca nas Cartas Épicas+ (c1, c2, etc.)
                const cartaEpica = CARTAS_EPICAS_PLUS.find(c => c.id === id) || CARTAS_EPICAS_PLUS[0];
                carta = { ...cartaEpica };
            }
        }

        const slot = estado.tabuleiro.findIndex(s => s === null);
        if (slot !== -1) {
            estado.tabuleiro[slot] = { 
                ...carta, 
                raridade: carta.raridadeForçada || carta.raridade, 
                idUnico: Date.now(), 
                hpAtual: carta.hp,
                custo: carta.custoBase !== undefined ? carta.custoBase : 0
            };
            renderizarTabuleiro();
            showToast(`Invocado: ${carta.nome}`, "success");
        } else {
            showToast("Tabuleiro cheio!", "error");
        }
    });

    document.getElementById('dev-btn-onda')?.addEventListener('click', () => {
        const o = parseInt(document.getElementById('dev-input-onda').value);
        if (o) { estado.ondaAtual = o; atualizarUIOnda(); showToast(`Onda alterada para ${o}`, "info"); }
    });

    // --- NOVOS COMANDOS DO CONSOLE DEV ---

    // 1. Modificar Ouro (Definir valor exato)
    document.getElementById('dev-btn-ouro')?.addEventListener('click', () => {
        const qtd = parseInt(document.getElementById('dev-input-ouro').value);
        if (!isNaN(qtd)) {
            estado.ouro = qtd;
            atualizarUIOuro();
            showToast(`Ouro definido exatamente para: ${qtd}`, "info");
        } else {
            showToast("Digite um valor válido para o ouro!", "error");
        }
    });

    // 2. Adicionar Espaços no Tabuleiro
    document.getElementById('dev-btn-slots')?.addEventListener('click', () => {
        const qtd = parseInt(document.getElementById('dev-input-slots').value) || 3;
        estado.espacosMax += qtd;
        
        // Adiciona os slots vazios correspondentes no array do tabuleiro
        for (let i = 0; i < qtd; i++) {
            estado.tabuleiro.push(null);
        }
        
        renderizarTabuleiro();
        showToast(`+${qtd} espaços adicionados ao tabuleiro! Total: ${estado.espacosMax}`, "success");
    });

    // 3. Mudar Clima Instantaneamente
    document.getElementById('dev-btn-clima')?.addEventListener('click', () => {
        const climaId = document.getElementById('dev-select-clima').value;
        const novoClima = CLIMAS.find(c => c.id === climaId);
        
        if (novoClima) {
            estado.climaAtual = novoClima;
            renderizarClima();
            showToast(`Clima alterado para: ${novoClima.nome}`, "info");
        }
    });

    let dragonBuffer = "";
    document.addEventListener('keydown', (e) => {
        if (e.key.length === 1 && e.key === e.key.toUpperCase()) {
            dragonBuffer += e.key;
            if (dragonBuffer.endsWith("DRAGON")) {
                if (estado.ondaAtual >= 20) {
                    iniciarBatalhaDragãoDourado();
                } else {
                    showToast("🐉 Você ouve um rugido... Alcance o Nível 20 primeiro!", "info");
                }
                dragonBuffer = "";
            }
        }
    });

    let clicksOuro = 0;
    document.getElementById('ouro-display')?.addEventListener('click', () => {
        clicksOuro++;
        if (clicksOuro === 10) {
            estado.ouro += 100;
            statsUsuario.tesouroOcultoEncontrado = true;
            salvarStats();
            atualizarUIOuro();
            showToast("💰 TESOURO OCULTO DESCOBERTO! +100 Ouro!", "success");
            clicksOuro = 0;
        }
    });

    let clicksTitulo = 0;
    document.getElementById('main-title')?.addEventListener('click', () => {
        clicksTitulo++;
        if (clicksTitulo === 20) {
            const resultadoDado = Math.floor(Math.random() * 6) + 1;
            const bonus = resultadoDado * 50;
            estado.ouro += bonus;
            estado.danoGlobal += 0.20;
            atualizarUIOuro();
            showToast(`🎲 DADO DA SORTE ROLOU ${resultadoDado}! +${bonus} Ouro e +20% Dano Global!`, "success");
            clicksTitulo = 0;
        }
    });
}

let timerAFK;
function iniciarTimerReiEsquecido() {
    clearTimeout(timerAFK);
    timerAFK = setTimeout(() => {
        const modal = document.getElementById('rei-esquecido-modal');
        if (modal) {
            modal.style.display = 'flex';
            const container = document.getElementById('carta-rei-container');
            if (container) {
                container.innerHTML = `
                    <div class="carta-tropa raridade-mitico" style="margin:0 auto;">
                        <div class="carta-icone">👑</div>
                        <div class="carta-nome">Dádiva Ancestral</div>
                        <div class="carta-stats">⚔️ 500 | ❤️ 1000</div>
                    </div>
                `;
            }
        }
    }, CONFIG.tempoAFKRei);

    window.onmousemove = resetTimerAFK;
    window.onkeypress = resetTimerAFK;
}

function resetTimerAFK() {
    clearTimeout(timerAFK);
    iniciarTimerReiEsquecido();
}

document.getElementById('btn-aceitar-rei')?.addEventListener('click', () => {
    const slot = estado.tabuleiro.findIndex(s => s === null);
    if (slot !== -1) {
        estado.tabuleiro[slot] = {
            id: 'rei_esquecido',
            nome: 'Dádiva Ancestral',
            classe: 'Rei',
            elemento: 'Sagrado',
            icone: '👑',
            raridade: RARIDADES.MITICO,
            ataque: 500,
            hp: 1000,
            hpAtual: 1000,
            custo: 0
        };
        renderizarTabuleiro();
    }
    document.getElementById('rei-esquecido-modal').style.display = 'none';
});

function testarInvocacaoFantasmaDev() {
    if (Math.random() < 0.0001) { 
        const modal = document.getElementById('fantasma-dev-modal');
        if (modal) modal.style.display = 'flex';
    }
}

document.getElementById('btn-recompensa-fantasma')?.addEventListener('click', () => {
    statsUsuario.possuiCartaFantasma = true;
    salvarStats();
    showToast("👻 Carta Única do Dev Desbloqueada para todas as partidas!", "success");
    document.getElementById('fantasma-dev-modal').style.display = 'none';
    initGame();
});

function iniciarBatalhaDragãoDourado() {
    estado.inimigoAtual = {
        nome: "🐉 DRAGÃO DOURADO ANCESTRAL",
        hpMax: 100000,
        hpAtual: 100000,
        ataque: 5000,
        isBoss: true
    };
    estado.emCombate = true;
    atualizarBarraInimigo();
    showToast("🐉 BATALHA SECRETA INICIADA CONTRA O DRAGÃO DOURADO!", "error");
}

// ==========================================================================
// 8. LISTENERS GLOBAIS E UTILITÁRIOS (SUBSTITUA A FUNÇÃO INTEIRA)
// ==========================================================================
function setupEventListenersGlobais() {
    // Ações de Batalha e Loja
    document.getElementById('btn-reroll')?.addEventListener('click', rerollLoja);
    document.getElementById('btn-batalha')?.addEventListener('click', iniciarBatalha);

    // Recompensas
    document.getElementById('btn-rew-dano')?.addEventListener('click', () => { estado.danoGlobal += 0.15; coletarRecompensa(); });
    document.getElementById('btn-rew-vida')?.addEventListener('click', () => { estado.ouro += 25; coletarRecompensa(); });
    document.getElementById('btn-rew-espaco')?.addEventListener('click', () => { estado.espacosMax += 1; estado.tabuleiro.push(null); coletarRecompensa(); });

    // Fechar Modais (qualquer botão de fechar)
    document.querySelectorAll('.fechar-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal') || e.target.closest('[id$="-modal"]');
            if (modal) modal.style.display = 'none';
        });
    });

    // Botões do Lobby: Regras
    const btnRegras = document.getElementById('mostrar-regras');
    if (btnRegras) {
        btnRegras.addEventListener('click', () => {
            const modalRegras = document.getElementById('regras-modal');
            if (modalRegras) modalRegras.style.display = 'flex';
        });
    }

    // Botões do Lobby: Troféus
    const btnTrofeus = document.getElementById('btn-conquistas-inicio');
    if (btnTrofeus) {
        btnTrofeus.addEventListener('click', () => {
            renderizarTrofeus(); // CHAMA A NOVA FUNÇÃO AQUI!
            const modalTrofeus = document.getElementById('trofeus-modal');
            if (modalTrofeus) modalTrofeus.style.display = 'flex';
        });
    }

    // Botões do Lobby: Salvar
    const btnSalvar = document.getElementById('salvar-jogo');
    if (btnSalvar) {
        btnSalvar.addEventListener('click', () => {
            if (estado.modoHardcore) {
                showToast("Salvamento não permitido no Modo Hardcore!", "error");
                return;
            }
            localStorage.setItem('kp_save_estado', JSON.stringify(estado));
            salvarStats();
            showToast("Progresso salvo com sucesso!", "success");
        });
    }

    // Botões do Lobby: Carregar
    const btnCarregar = document.getElementById('carregar-jogo-inicio');
    if (btnCarregar) {
        btnCarregar.addEventListener('click', () => {
            const saveAntigo = localStorage.getItem('kp_save_estado');
            if (saveAntigo) {
                estado = JSON.parse(saveAntigo);
                
                document.getElementById('start-screen').style.display = 'none';
                document.getElementById('header-lobby').style.display = 'none';
                document.getElementById('game-screen').style.display = 'block';
                
                atualizarUIOuro();
                atualizarUIOnda();
                renderizarClima();
                renderizarLoja();
                renderizarTabuleiro();
                
                showToast("Jogo carregado com sucesso!", "success");
            } else {
                showToast("Nenhum progresso salvo encontrado.", "error");
            }
        });
    }
}
// Utilitário para pausar o combate
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função para fechar o modal de recompensa e continuar o jogo
function coletarRecompensa() {
    document.getElementById('reward-modal').style.display = 'none';
    showToast("Recompensa coletada!", "success");
}
function renderizarTrofeus() {
    const grid = document.getElementById('grid-conquistas');
    if (!grid) return;

    // Atualiza os status puxando do localStorage para garantir dados frescos
    statsUsuario = JSON.parse(localStorage.getItem('kp_stats')) || statsUsuario;

    grid.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left; margin-top: 20px;">
            <div class="painel" style="padding: 15px; margin-bottom: 0;">
                <h3 style="color: var(--gold-bright); font-size: 1.1rem; border-bottom: 1px solid var(--gold-antique); padding-bottom: 5px;">📊 Estatísticas</h3>
                <p style="margin-top: 10px;"><strong>Maior Onda:</strong> ${statsUsuario.ondaMaxima}</p>
                <p><strong>Chefes Derrotados:</strong> ${statsUsuario.chefesMortos}</p>
                <p><strong>Ouro Gasto:</strong> 🪙 ${statsUsuario.ouroGasto}</p>
                <p><strong>Tropas Compradas:</strong> ${statsUsuario.tropasCompradas}</p>
                <p><strong>Rerolls Feitos:</strong> 🔄 ${statsUsuario.rerollsFeitos}</p>
            </div>
            
            <div class="painel" style="padding: 15px; margin-bottom: 0;">
                <h3 style="color: var(--gold-bright); font-size: 1.1rem; border-bottom: 1px solid var(--gold-antique); padding-bottom: 5px;">🏆 Conquistas Especiais</h3>
                <p style="margin-top: 10px;">${statsUsuario.tesouroOcultoEncontrado ? "✅" : "❌"} <strong>Caçador de Tesouros</strong> <br><small style="color: gray;">(Achou o ouro oculto)</small></p>
                <p>${statsUsuario.hardcoreVencido ? "✅" : "❌"} <strong>Lenda Viva</strong> <br><small style="color: gray;">(Venceu no modo Hardcore)</small></p>
                <p>${statsUsuario.possuiCartaFantasma ? "✅" : "❌"} <strong>Amigo do Dev</strong> <br><small style="color: gray;">(Achou o Fantasma)</small></p>
            </div>
        </div>
    `;
}
// ==========================================================================
// SISTEMA DE NOTIFICAÇÕES (TOASTS)
// ==========================================================================
function showToast(mensagem, tipo = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Cria o elemento da notificação
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = mensagem;

    // Altera a cor da borda esquerda do CSS padrão dependendo do tipo do aviso
    if (tipo === 'error') {
        toast.style.borderLeftColor = 'var(--blood-red)';
    } else if (tipo === 'success') {
        toast.style.borderLeftColor = 'var(--emerald)';
    } else {
        toast.style.borderLeftColor = 'var(--sapphire)';
    }

    // Adiciona o toast à tela
    container.appendChild(toast);

    // O CSS tem uma animação de saída de 0.4s que começa após 3s.
    // Vamos remover o elemento HTML da memória após 3.5 segundos.
    setTimeout(() => {
        toast.remove();
    }, 3500);
}