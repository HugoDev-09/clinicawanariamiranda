/* ==================================================================
   SCRIPT EXCLUSIVO DA HOME (INDEX.HTML)
   Contém: Carrossel, Modais (Serviço/Login), Animações e Cadastro
   ================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa componentes apenas se a página estiver carregada
    initCarrosselHero();
    initCarrosselAvaliacoes();
    initScrollReveal();
    verificarUsuarioLogado();
});

/* ================= 1. CARROSSEL HERO (TOPO) ================= */
function initCarrosselHero() {
    const slides = document.querySelectorAll('.heroCarrossel .slide');
    const btnEsq = document.querySelector('.seta-esq');
    const btnDir = document.querySelector('.seta-dir');
    
    // Se não tiver slides na tela, para a função aqui (evita erro)
    if (!slides.length) return;

    let currentSlide = 0;
    let autoSlideInterval;

    // Garante que o primeiro slide esteja visível
    slides[0].classList.add('active');

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
    }

    // Botões
    if (btnDir) {
        btnDir.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            showSlide(currentSlide + 1);
            startAutoSlide();
        });
    }

    if (btnEsq) {
        btnEsq.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            showSlide(currentSlide - 1);
            startAutoSlide();
        });
    }

    startAutoSlide();
}

/* ================= 2. CARROSSEL AVALIAÇÕES ================= */
function initCarrosselAvaliacoes() {
    const track = document.getElementById('trackAvaliacoes'); // Ajustei para pegar pelo ID
    // Se não achar pelo ID, tenta pela classe (fallback)
    const trackElement = track || document.querySelector('.avaliacoesTrack');
    
    if (!trackElement) return; // Se não existir, sai sem dar erro

    // Animação CSS pura já está configurada no style.css (animation: scrollAvaliacoes)
    // Se quiser pausar no hover via JS:
    trackElement.addEventListener('mouseenter', () => {
        trackElement.style.animationPlayState = 'paused';
    });
    trackElement.addEventListener('mouseleave', () => {
        trackElement.style.animationPlayState = 'running';
    });
}

/* ================= 3. SCROLL REVEAL (ANIMAÇÃO AO DESCER) ================= */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Chama uma vez ao carregar
}

/* ================= 4. MODAIS DE SERVIÇOS ================= */
// Funções globais para funcionarem com onclick="" no HTML

window.abrirModalServico = function(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        console.warn(`Modal ${idModal} não encontrado.`);
    }
};

window.fecharModalServico = function(event) {
    if (event.target.classList.contains('modal-servico-overlay')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

window.fecharModalServicoBtn = function(btn) {
    const modal = btn.closest('.modal-servico-overlay');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

/* ================= 5. MODAL DE LOGIN / CADASTRO ================= */

window.abrirModalAcesso = function() {
    const modal = document.getElementById('modal-acesso');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Reseta para a aba de login ao abrir
        window.alternarAba('login');
    } else {
        console.error("ERRO: O elemento 'modal-acesso' não existe no HTML.");
    }
};

window.fecharModalAcesso = function(event) {
    if (event.target.classList.contains('modal-acesso-overlay')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

window.fecharModalAcessoBtn = function() {
    const modal = document.getElementById('modal-acesso');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

window.alternarAba = function(tipo) {
    const formLogin = document.getElementById('form-login');
    const formCadastro = document.getElementById('form-cadastro');
    const btns = document.querySelectorAll('.aba-btn');

    if (!formLogin || !formCadastro) return;

    // Remove classes
    formLogin.classList.remove('ativo');
    formCadastro.classList.remove('ativo');
    btns.forEach(b => b.classList.remove('ativo'));

    // Ativa o correto
    if (tipo === 'login') {
        formLogin.classList.add('ativo');
        if(btns[0]) btns[0].classList.add('ativo');
    } else {
        formCadastro.classList.add('ativo');
        if(btns[1]) btns[1].classList.add('ativo');
    }
};

/* ================= 6. LÓGICA DE USUÁRIO (LOGIN/CADASTRO) ================= */

function verificarUsuarioLogado() {
    // Verifica se o objeto 'storage' existe (carregado do storage.js)
    if (typeof storage !== 'undefined') {
        const usuario = storage.getUsuarioLogado();
        const btnLogin = document.getElementById('btnLoginHome');
        const userArea = document.getElementById('userAreaHome');
        const userName = document.getElementById('userNameHome');

        if (usuario && btnLogin && userArea) {
            btnLogin.style.display = 'none'; // Esconde botão de login
            userArea.style.display = 'flex'; // Mostra área do usuário
            if(userName) {
                userName.textContent = `Olá, ${usuario.nome_completo.split(' ')[0]}`;
            }
        }
    }
}

// Função de Cadastro (Conectada ao Backend)
window.cadastrarUsuario = async function() {
    const inputNome = document.getElementById("nome");
    
    // Verificação de segurança: se não tiver campo nome, não faz nada
    if (!inputNome) return; 

    const nome_completo = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Validação básica
    if(!nome_completo || !email || !senha) {
        alert("Por favor, preencha os campos obrigatórios.");
        return;
    }

    try {
        const resp = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome_completo, cpf, telefone, email, senha })
        });

        const dados = await resp.json();

        if (!resp.ok) {
            throw new Error(dados.erro || "Erro ao cadastrar");
        }

        alert("Cadastro realizado com sucesso! Faça login para continuar.");
        window.alternarAba('login'); // Muda para a aba de login automaticamente
        
    } catch (erro) {
        console.error("Erro no cadastro:", erro);
        alert("Erro ao cadastrar: " + erro.message);
    }
};

// Teste de conexão (Opcional)
fetch('http://localhost:3000/api/ping')
  .then(res => res.json())
  .then(data => console.log('BACKEND ONLINE:', data))
  .catch(err => console.warn('Backend Offline (Isto é normal se o servidor não estiver rodando)'));

  /* ================= MENU DO USUÁRIO & LOGOUT ================= */

// Alternar visibilidade do menu
window.toggleUserMenu = function() {
    const menu = document.getElementById('userDropdown');
    menu.classList.toggle('active');
};

// Fechar menu se clicar fora
window.onclick = function(event) {
    if (!event.target.closest('.user-menu-container')) {
        const menu = document.getElementById('userDropdown');
        if (menu && menu.classList.contains('active')) {
            menu.classList.remove('active');
        }
    }
    // Mantém a lógica de fechar modais que já existia
    if (event.target.classList.contains('modal-servico-overlay')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Função de Logout
window.fazerLogout = function(e) {
    e.preventDefault();
    if(typeof storage !== 'undefined') {
        storage.logout(); // Limpa a sessão
        window.location.reload(); // Recarrega a página (volta ao estado inicial)
    }
};

// Atualiza a verificação de usuário para mostrar a seta
function verificarUsuarioLogado() {
    if (typeof storage !== 'undefined') {
        const usuario = storage.getUsuarioLogado();
        const btnLogin = document.getElementById('btnLoginHome');
        const userArea = document.getElementById('userAreaHome');
        const userName = document.getElementById('userNameHome');

        if (usuario && btnLogin && userArea) {
            btnLogin.style.display = 'none';
            userArea.style.display = 'flex';
            // Pega o primeiro nome
            if(userName) userName.textContent = `Olá, ${usuario.nome_completo.split(' ')[0]}`;
        }
    }
}