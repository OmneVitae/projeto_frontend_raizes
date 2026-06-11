// ==================== VARIÁVEIS GLOBAIS ====================

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let users = JSON.parse(localStorage.getItem("users")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
let currentCity = localStorage.getItem("city") || "salvador";
let lgpdAccepted = localStorage.getItem("lgpdAccepted") === "true";

// ==================== UTILITÁRIOS ====================

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function updateCartCount() {
    const total = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartCountSpan = document.getElementById("cartCount");
    if (cartCountSpan) cartCountSpan.innerText = total;
}

// ==================== RENDERIZAÇÃO DE TELAS ====================

function showScreen(screenId) {
    document.querySelectorAll(".nav-btn").forEach(btn => {
        if (btn.dataset.screen === screenId) btn.classList.add("active");
        else btn.classList.remove("active");
    });
    if (screenId === "home") renderHome();
    else if (screenId === "menu") renderMenu();
    else if (screenId === "orders") renderOrders();
    else if (screenId === "loyalty") renderLoyalty();
}

function renderHome() {
    const promo = promocoes[currentCity];
    const html = `
        <div class="home-content">
            <!-- Imagem representativa do restaurante -->
            <div class="restaurant-image">
                <img src="images/restaurante_fachada.jpg" alt="Ambiente do Raízes do Nordeste">
            </div>
            <div class="promo-banner">
                <i class="fas fa-tag"></i> Promoção da unidade ${currentCity.toUpperCase()}: ${promo?.descricao || "Aproveite nossos sabores!"}
            </div>
            <h2>Bem-vindo, ${currentUser ? currentUser.nome : "visitante"}!</h2>
            <p>Peça online e acumule pontos no programa Raízes Fidelidade.</p>
            <div class="feature-grid">
                <div class="feature-card"><i class="fas fa-mobile-alt"></i> Peça pelo app</div>
                <div class="feature-card"><i class="fas fa-trophy"></i> Pontos a cada real</div>
                <div class="feature-card"><i class="fas fa-shield-alt"></i> Dados protegidos (LGPD)</div>
            </div>
            <button class="btn-primary" id="goToMenuBtn">Ver Cardápio →</button>
        </div>
    `;
    document.getElementById("mainContent").innerHTML = html;
    const goToMenuBtn = document.getElementById("goToMenuBtn");
    if (goToMenuBtn) goToMenuBtn.addEventListener("click", () => showScreen("menu"));
}

function renderMenu() {
    const items = menuData[currentCity];
    if (!items) {
        document.getElementById("mainContent").innerHTML = "<p>Erro ao carregar cardápio.</p>";
        return;
    }
    let html = `<div class="menu-grid">`;
    items.forEach(item => {
        let precoFinal = item.preco;
        if (promocoes[currentCity] && promocoes[currentCity].itemId === item.id && promocoes[currentCity].descontoPercent) {
            precoFinal = item.preco * (1 - promocoes[currentCity].descontoPercent / 100);
        }
        html += `
            <div class="card-item">
                <img src="${item.imagem}" class="card-img" alt="${item.nome}">
                <div class="card-info">
                    <h3>${item.nome}</h3>
                    <p>${item.descricao}</p>
                    <div class="price">R$ ${precoFinal.toFixed(2)}</div>
                    <button class="btn-add" data-id="${item.id}" data-nome="${item.nome}" data-preco="${precoFinal}">Adicionar</button>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    document.getElementById("mainContent").innerHTML = html;
    document.querySelectorAll(".btn-add").forEach(btn => {
        btn.addEventListener("click", () => {
            if (!currentUser) {
                alert("Faça login para adicionar itens ao carrinho.");
                showAuthModal();
                return;
            }
            const id = parseInt(btn.dataset.id);
            const nome = btn.dataset.nome;
            const preco = parseFloat(btn.dataset.preco);
            const existing = cart.find(i => i.id === id);
            if (existing) existing.quantity++;
            else cart.push({ id, nome, preco, quantity: 1 });
            saveToLocalStorage("cart", cart);
            updateCartCount();
            alert(`${nome} adicionado!`);
        });
    });
}

function renderOrders() {
    if (!currentUser) {
        document.getElementById("mainContent").innerHTML = "<p>Faça login para ver seus pedidos.</p>";
        return;
    }
    const userOrders = pedidos.filter(p => p.userEmail === currentUser.email);
    if (userOrders.length === 0) {
        document.getElementById("mainContent").innerHTML = "<p>Nenhum pedido realizado ainda.</p>";
        return;
    }
    let html = `<div class="orders-list">`;
    userOrders.forEach(order => {
        html += `
            <div class="card-item">
                <div class="card-info">
                    <h3>Pedido #${order.id}</h3>
                    <p>Status: <strong>${order.status}</strong></p>
                    <p>Total: R$ ${order.total.toFixed(2)}</p>
                    <p>Data: ${new Date(order.date).toLocaleString()}</p>
                    <p>Unidade: ${order.city}</p>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    document.getElementById("mainContent").innerHTML = html;
}

function renderLoyalty() {
    if (!currentUser) {
        document.getElementById("mainContent").innerHTML = "<p>Faça login para ver seus pontos.</p>";
        return;
    }
    const userPoints = currentUser.pontos || 0;
    const html = `
        <div class="loyalty-card">
            <h2><i class="fas fa-gem"></i> Programa Raízes Fidelidade</h2>
            <p>Você acumula <strong>${userPoints} pontos</strong></p>
            <p>A cada R$1 gasto = 1 ponto. 100 pontos = R$5 de desconto em pedidos.</p>
            <p>Use seus pontos diretamente no carrinho de compras!</p>
        </div>
    `;
    document.getElementById("mainContent").innerHTML = html;
}

// ==================== CARRINHO E CHECKOUT ====================

function openCartModal() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }
    renderCartModal();
    document.getElementById("cartModal").style.display = "flex";
}

function renderCartModal() {
    let itemsHtml = `<div class="cart-items">`;
    let subtotal = 0;
    cart.forEach(item => {
        const totalItem = item.preco * item.quantity;
        subtotal += totalItem;
        itemsHtml += `<p>${item.nome} x${item.quantity} = R$ ${totalItem.toFixed(2)}</p>`;
    });
    itemsHtml += `</div>`;
    document.getElementById("cartItems").innerHTML = itemsHtml;
    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    const userPoints = currentUser ? (currentUser.pontos || 0) : 0;
    document.getElementById("userPoints").innerText = userPoints;
    document.getElementById("pointsToUse").value = 0;
    document.getElementById("discountAmount").innerText = "0.00";
    document.getElementById("cartTotal").innerText = subtotal.toFixed(2);

    const pointsInput = document.getElementById("pointsToUse");
    pointsInput.oninput = () => {
        let points = parseInt(pointsInput.value) || 0;
        points = Math.min(points, userPoints, Math.floor(subtotal * 100 / 5));
        const discount = Math.floor(points / 100) * 5;
        const totalFinal = subtotal - discount;
        document.getElementById("discountAmount").innerText = discount.toFixed(2);
        document.getElementById("cartTotal").innerText = totalFinal.toFixed(2);
        pointsInput.value = points;
    };
}

function processPayment(total) {
    return new Promise((resolve) => {
        const paymentModal = document.getElementById("paymentModal");
        if (paymentModal) paymentModal.style.display = "flex";
        setTimeout(() => {
            if (paymentModal) paymentModal.style.display = "none";
            resolve(true);
        }, 2000);
    });
}

async function finalizarPedido() {
    if (!currentUser) {
        alert("Você precisa estar logado.");
        return;
    }
    const subtotal = parseFloat(document.getElementById("subtotal").innerText);
    const discount = parseFloat(document.getElementById("discountAmount").innerText);
    const total = subtotal - discount;
    const pontosUsados = parseInt(document.getElementById("pointsToUse").value) || 0;

    const pagamentoSucesso = await processPayment(total);
    if (pagamentoSucesso) {
        const novoPedido = {
            id: Date.now(),
            userEmail: currentUser.email,
            items: [...cart],
            subtotal: subtotal,
            desconto: discount,
            total: total,
            status: "Recebido (preparando)",
            date: new Date().toISOString(),
            city: currentCity,
            pontosUsados: pontosUsados
        };
        pedidos.push(novoPedido);
        saveToLocalStorage("pedidos", pedidos);

        let pontosGanhos = Math.floor(subtotal);
        let novosPontos = (currentUser.pontos || 0) - pontosUsados + pontosGanhos;
        currentUser.pontos = novosPontos;
        const index = users.findIndex(u => u.email === currentUser.email);
        if (index !== -1) users[index].pontos = novosPontos;
        saveToLocalStorage("users", users);
        saveToLocalStorage("currentUser", currentUser);

        cart = [];
        saveToLocalStorage("cart", cart);
        updateCartCount();
        alert("Pedido finalizado com sucesso! Acompanhe na tela 'Meus Pedidos'.");
        document.getElementById("cartModal").style.display = "none";
        showScreen("orders");
    } else {
        alert("Falha no pagamento. Tente novamente.");
    }
}

// ==================== AUTENTICAÇÃO ====================

function showAuthModal() {
    const modal = document.getElementById("authModal");
    if (modal) modal.style.display = "flex";
}

function handleLogin() {
    const email = document.getElementById("loginEmail").value.trim();
    const pwd = document.getElementById("loginPassword").value;
    const user = users.find(u => u.email === email && u.senha === pwd);
    if (user) {
        currentUser = user;
        saveToLocalStorage("currentUser", currentUser);
        document.getElementById("authModal").style.display = "none";
        updateUserInterface();
        showScreen("home");
    } else {
        document.getElementById("loginError").innerText = "E-mail ou senha inválidos.";
    }
}

function handleRegister() {
    const nome = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const senha = document.getElementById("regPassword").value;
    const consent = document.getElementById("lgpdConsent").checked;

    if (!nome || !email || !senha) {
        document.getElementById("regError").innerText = "Preencha todos os campos.";
        return;
    }
    if (senha.length < 6) {
        document.getElementById("regError").innerText = "A senha deve ter no mínimo 6 caracteres.";
        return;
    }
    if (!consent) {
        document.getElementById("regError").innerText = "Você deve aceitar a LGPD para se cadastrar.";
        return;
    }
    if (users.find(u => u.email === email)) {
        document.getElementById("regError").innerText = "E-mail já cadastrado.";
        return;
    }

    const newUser = { nome, email, senha, pontos: 0 };
    users.push(newUser);
    saveToLocalStorage("users", users);
    currentUser = newUser;
    saveToLocalStorage("currentUser", currentUser);

    document.getElementById("authModal").style.display = "none";
    updateUserInterface();
    showScreen("home");
    alert("Cadastro realizado com sucesso!");
}

function updateUserInterface() {
    const area = document.getElementById("userArea");
    if (!area) return;
    if (currentUser) {
        area.innerHTML = `<span><i class="fas fa-user-check"></i> ${currentUser.nome}</span> <button id="logoutBtn" class="btn-icon">Sair</button>`;
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                localStorage.removeItem("currentUser");
                currentUser = null;
                updateUserInterface();
                showScreen("home");
            });
        }
    } else {
        area.innerHTML = `<button id="loginBtn" class="btn-icon"><i class="fas fa-user"></i> Entrar</button>`;
        const loginBtn = document.getElementById("loginBtn");
        if (loginBtn) loginBtn.addEventListener("click", showAuthModal);
    }
}

// ==================== LGPD MODAL ====================

function initLgpd() {
    if (!lgpdAccepted) {
        const modal = document.getElementById("lgpdModal");
        if (modal) modal.style.display = "flex";
        const acceptBtn = document.getElementById("acceptLgpd");
        if (acceptBtn) {
            acceptBtn.addEventListener("click", () => {
                localStorage.setItem("lgpdAccepted", "true");
                modal.style.display = "none";
            });
        }
    }
}

// ==================== EVENTOS E INICIALIZAÇÃO ====================

function bindGlobalEvents() {
    // Seletor de cidade
    
    const citySelect = document.getElementById("citySelect");
    if (citySelect) {
        citySelect.addEventListener("change", (e) => {
            currentCity = e.target.value;
            localStorage.setItem("city", currentCity);
            showScreen("menu");
        });
        citySelect.value = currentCity;
    }

    // Botão carrinho
    
    const cartBtn = document.getElementById("cartBtn");
    if (cartBtn) cartBtn.addEventListener("click", openCartModal);

    // Fechar modais
    
    document.querySelectorAll(".close").forEach(close => {
        close.addEventListener("click", () => {
            document.querySelectorAll(".modal").forEach(modal => modal.style.display = "none");
        });
    });

    // Navegação principal
    
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.addEventListener("click", () => showScreen(btn.dataset.screen));
    });

    // Link LGPD rodapé
    
    const lgpdLink = document.getElementById("lgpdLink");
    if (lgpdLink) {
        lgpdLink.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Política de Privacidade: Coletamos dados para processar pedidos e fidelidade. Você pode solicitar exclusão via e-mail. Consentimento dado no cadastro.");
        });
    }

    // Botão de checkout (carrinho)
    
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) checkoutBtn.addEventListener("click", finalizarPedido);

    // Botões de autenticação (usando handlers definidos)
    
    const doLoginBtn = document.getElementById("doLogin");
    if (doLoginBtn) doLoginBtn.addEventListener("click", handleLogin);

    const doRegisterBtn = document.getElementById("doRegister");
    if (doRegisterBtn) doRegisterBtn.addEventListener("click", handleRegister);

    // Tabs do modal de autent
    
    const tabBtns = document.querySelectorAll("#authTabs .tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            document.querySelectorAll(".auth-form").forEach(form => form.classList.remove("active"));
            if (tab === "login") document.getElementById("loginForm").classList.add("active");
            else if (tab === "register") document.getElementById("registerForm").classList.add("active");
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });
}

// Inicialização completa

function init() {
    bindGlobalEvents();
    updateCartCount();
    updateUserInterface();
    initLgpd();
    showScreen("home");
}

// Iniciar quando o DOM estiver pronto

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
