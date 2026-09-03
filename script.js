const estadoSelect = document.getElementById("estado");
const cidadeSelect = document.getElementById("cidade");
const whatsappInput = document.getElementById("whatsapp");
const form = document.getElementById("instrutorForm");
const submitButton = document.getElementById("submitButton");


/* ========================================
   ESTADOS
======================================== */

async function carregarEstados() {

    try {

        const resposta = await fetch(
            "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
        );

        const estados = await resposta.json();


        estados.forEach(estado => {

            const option = document.createElement("option");

            option.value = estado.sigla;

            option.textContent =
                `${estado.nome} (${estado.sigla})`;

            estadoSelect.appendChild(option);

        });

    } catch (erro) {

        console.error(erro);

        estadoSelect.innerHTML = `
            <option value="">
                Erro ao carregar estados
            </option>
        `;

    }

}


/* ========================================
   CIDADES
======================================== */

async function carregarCidades(uf) {

    cidadeSelect.disabled = true;

    cidadeSelect.innerHTML = `
        <option value="">
            Carregando cidades...
        </option>
    `;


    try {

        const resposta = await fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`
        );

        const cidades = await resposta.json();


        cidadeSelect.innerHTML = `
            <option value="">
                Selecione a cidade
            </option>
        `;


        cidades.forEach(cidade => {

            const option = document.createElement("option");

            option.value = cidade.nome;

            option.textContent = cidade.nome;

            cidadeSelect.appendChild(option);

        });


        cidadeSelect.disabled = false;

    } catch (erro) {

        console.error(erro);

        cidadeSelect.innerHTML = `
            <option value="">
                Erro ao carregar cidades
            </option>
        `;

    }

}


/* ========================================
   ALTERAÇÃO DO ESTADO
======================================== */

estadoSelect.addEventListener("change", function () {

    const uf = this.value;


    if (!uf) {

        cidadeSelect.disabled = true;

        cidadeSelect.innerHTML = `
            <option value="">
                Primeiro selecione o estado
            </option>
        `;

        return;
    }


    carregarCidades(uf);

});


/* ========================================
   MÁSCARA WHATSAPP
======================================== */

whatsappInput.addEventListener("input", function () {

    let numero = this.value.replace(/\D/g, "");

    numero = numero.substring(0, 11);


    if (numero.length <= 2) {

        this.value = `(${numero}`;

    } else if (numero.length <= 7) {

        this.value =
            `(${numero.substring(0, 2)}) ` +
            `${numero.substring(2)}`;

    } else {

        this.value =
            `(${numero.substring(0, 2)}) ` +
            `${numero.substring(2, 7)}-` +
            `${numero.substring(7)}`;

    }

});


/* ========================================
   VALIDAÇÃO
======================================== */

form.addEventListener("submit", function (event) {

    const numero =
        whatsappInput.value.replace(/\D/g, "");


    if (numero.length !== 11) {

        event.preventDefault();

        alert(
            "Informe um número de WhatsApp válido com DDD."
        );

        whatsappInput.focus();

        return;

    }


    submitButton.innerHTML =
        "ENVIANDO...";

    submitButton.disabled = true;

});


/* ========================================
   INICIALIZAÇÃO
======================================== */

carregarEstados();