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
    .then(() => {
        // SEMPRE redirecionar após o envio, independente da resposta
        window.location.href = "obrigado.html";
    })
    .catch(() => {
        // Em caso de erro, também redirecionar
        window.location.href = "obrigado.html";
    })
    .finally(() => {
        // Garantia adicional: redirecionar após 2 segundos
        setTimeout(() => {
            window.location.href = "obrigado.html";
        }, 2000);
    });
});