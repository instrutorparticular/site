"use strict";

/* ========================================
   ÁREA DE ACESSO DO INSTRUTOR NO TOPO
   Detecta automaticamente se o usuário
   está logado (via localStorage) e exibe
   o botão correto.
======================================== */

(function() {
    const topbar = document.getElementById("topbarInstrutor");
    if (!topbar) return;

    const btnEntrar = topbar.querySelector(".btn-entrar");
    const btnPainel = topbar.querySelector(".btn-painel");
    const btnSair = topbar.querySelector(".btn-sair");
    const userBox = topbar.querySelector(".topbar-user");
    const userName = topbar.querySelector(".topbar-user .name");

    /* ========================================
       VERIFICA SESSÃO
    ======================================== */
    const token = localStorage.getItem("instrutor_token");
    let dadosInstrutor = null;

    try {
        const raw = localStorage.getItem("instrutor_dados");
        dadosInstrutor = raw ? JSON.parse(raw) : null;
    } catch (e) {
        dadosInstrutor = null;
    }

    /* ========================================
       MOSTRA ESTADO CORRETO
    ======================================== */
    if (token && dadosInstrutor && dadosInstrutor.nome) {
        // Usuário logado
        if (btnEntrar) btnEntrar.style.display = "none";
        if (btnPainel) btnPainel.style.display = "inline-flex";
        if (btnSair) btnSair.style.display = "inline-flex";
        if (userBox) {
            userBox.style.display = "flex";
            const primeiroNome = dadosInstrutor.nome.split(" ")[0];
            if (userName) userName.textContent = `Olá, ${primeiroNome}`;
        }
    } else {
        // Usuário não logado
        if (btnEntrar) btnEntrar.style.display = "inline-flex";
        if (btnPainel) btnPainel.style.display = "none";
        if (btnSair) btnSair.style.display = "none";
        if (userBox) userBox.style.display = "none";
    }

    /* ========================================
       BOTÃO SAIR
    ======================================== */
    if (btnSair) {
        btnSair.addEventListener("click", function(e) {
            e.preventDefault();

            if (confirm("Deseja realmente sair da sua conta?")) {
                localStorage.removeItem("instrutor_token");
                localStorage.removeItem("instrutor_dados");
                window.location.href = "index.html";
            }
        });
    }

})();