"use strict";

/* ========================================
   ELEMENTOS
======================================== */

const estadoSelect = document.getElementById("estado");
const cidadeSelect = document.getElementById("cidade");
const whatsappInput = document.getElementById("whatsapp");
const form = document.getElementById("instrutorForm");
const submitButton = document.getElementById("submitButton");

/* ========================================
   API DO IBGE
======================================== */

const API_IBGE = "https://servicodados.ibge.gov.br/api/v1/localidades";

/* ========================================
   CARREGAR ESTADOS
======================================== */

async function carregarEstados() {
    try {
        estadoSelect.disabled = true;
        estadoSelect.innerHTML = `<option value="">Carregando estados...</option>`;

        const resposta = await fetch(`${API_IBGE}/estados?orderBy=nome`);
        if (!resposta.ok) throw new Error("Não foi possível carregar os estados.");

        const estados = await resposta.json();

        estadoSelect.innerHTML = `<option value="">Selecione o estado</option>`;

        estados.forEach(estado => {
            const option = document.createElement("option");
            option.value = estado.sigla;
            option.textContent = `${estado.nome} (${estado.sigla})`;
            estadoSelect.appendChild(option);
        });

        estadoSelect.disabled = false;
    } catch (erro) {
        console.error("Erro ao carregar estados:", erro);
        estadoSelect.innerHTML = `<option value="">Erro ao carregar estados</option>`;
        estadoSelect.disabled = true;
    }
}

/* ========================================
   CARREGAR CIDADES
======================================== */

async function carregarCidades(uf) {
    cidadeSelect.disabled = true;
    cidadeSelect.innerHTML = `<option value="">Carregando cidades...</option>`;

    try {
        const resposta = await fetch(`${API_IBGE}/estados/${uf}/municipios?orderBy=nome`);
        if (!resposta.ok) throw new Error("Não foi possível carregar as cidades.");

        const cidades = await resposta.json();

        cidadeSelect.innerHTML = `<option value="">Selecione a cidade</option>`;

        cidades.forEach(cidade => {
            const option = document.createElement("option");
            option.value = cidade.nome;
            option.textContent = cidade.nome;
            cidadeSelect.appendChild(option);
        });

        cidadeSelect.disabled = false;
    } catch (erro) {
        console.error("Erro ao carregar cidades:", erro);
        cidadeSelect.innerHTML = `<option value="">Erro ao carregar cidades</option>`;
        cidadeSelect.disabled = true;
    }
}

/* ========================================
   QUANDO O ESTADO MUDAR
======================================== */

estadoSelect.addEventListener("change", function () {
    const uf = this.value;
    if (!uf) {
        cidadeSelect.disabled = true;
        cidadeSelect.innerHTML = `<option value="">Primeiro selecione o estado</option>`;
        return;
    }
    carregarCidades(uf);
});

/* ========================================
   MÁSCARA DO WHATSAPP
======================================== */

whatsappInput.addEventListener("input", function () {
    let numero = this.value.replace(/\D/g, "");
    numero = numero.substring(0, 11);

    if (numero.length === 0) {
        this.value = "";
        return;
    }

    if (numero.length <= 2) {
        this.value = `(${numero}`;
    } else if (numero.length <= 7) {
        this.value = `(${numero.substring(0, 2)}) ${numero.substring(2)}`;
    } else {
        this.value = `(${numero.substring(0, 2)}) ${numero.substring(2, 7)}-${numero.substring(7)}`;
    }
});

/* ========================================
   ENVIO DO FORMULÁRIO - VIA AJAX
======================================== */

form.addEventListener("submit", function (event) {
    event.preventDefault();

    /* ------------------------------
       VALIDAR WHATSAPP
    ------------------------------ */
    const numero = whatsappInput.value.replace(/\D/g, "");
    if (numero.length !== 11) {
        alert("Informe um número de WhatsApp válido com DDD.");
        whatsappInput.focus();
        return;
    }

    /* ------------------------------
       VERIFICAR ESTADO
    ------------------------------ */
    if (!estadoSelect.value) {
        alert("Selecione o seu estado.");
        estadoSelect.focus();
        return;
    }

    /* ------------------------------
       VERIFICAR CIDADE
    ------------------------------ */
    if (cidadeSelect.disabled || !cidadeSelect.value) {
        alert("Selecione a sua cidade.");
        cidadeSelect.focus();
        return;
    }

    /* ------------------------------
       VERIFICAR CATEGORIA
    ------------------------------ */
    const categoria = document.getElementById("categoria");
    if (!categoria.value) {
        alert("Selecione uma categoria.");
        categoria.focus();
        return;
    }

    /* ------------------------------
       VERIFICAR AUTORIZAÇÃO
    ------------------------------ */
    const termos = document.getElementById("termos");
    if (!termos.checked) {
        alert("É necessário autorizar o uso dos dados para continuar.");
        termos.focus();
        return;
    }

    /* ------------------------------
       ALTERAR BOTÃO
    ------------------------------ */
    submitButton.disabled = true;
    const textoBotao = submitButton.querySelector("span");
    if (textoBotao) {
        textoBotao.textContent = "ENVIANDO...";
    }

    /* ------------------------------
       ENVIAR VIA AJAX
    ------------------------------ */
    const formData = new FormData(form);

    fetch("https://formsubmit.co/ajax/instrutorparticularcontato@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Formulário enviado com sucesso:", data);
        
        // Redirecionar para página de obrigado
        window.location.href = "obrigado.html";
    })
    .catch(error => {
        console.error("❌ Erro ao enviar formulário:", error);
        
        // Redirecionar mesmo em caso de erro (para não travar o usuário)
        window.location.href = "obrigado.html";
    });
});

/* ========================================
   INICIALIZAÇÃO
======================================== */

carregarEstados();