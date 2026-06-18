document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("resumoPedidoCorpo");
  const total = document.getElementById("totalValor");
  const btnValor = document.getElementById("btnValor");
  const btnPagar = document.getElementById("btnPagar");
  const btnTexto = document.getElementById("btnTexto");

  let listaItens = carregarCarrinho();
  let estoqueValido = false;
  let cupomAplicado = null;

  window.checkoutEstoqueValido = function () {
    return estoqueValido;
  };

  window.checkoutAtualizarResumo = function () {
    listaItens = carregarCarrinho();
    renderizarResumo();
    validarEstoque();
  };

  renderizarResumo();
  validarEstoque();
  inicializarCupomCheckout();

  function carregarCarrinho() {
    try {
      const dados = JSON.parse(localStorage.getItem("carrinho") || "[]");
      return Array.isArray(dados) ? dados : [];
    } catch {
      return [];
    }
  }

  function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(listaItens));
    window.dispatchEvent(new Event("storage"));
  }

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function calcularTotal() {
    return listaItens.reduce((acc, item) => {
      const preco = typeof item.preco === "string" ? parseFloat(item.preco.replace(",", ".")) : Number(item.preco || 0);
      return acc + preco * Number(item.quantidade || 1);
    }, 0);
  }

  function calcularDescontoCupom(totalPedido = calcularTotal()) {
    if (!cupomAplicado) return 0;
    const percentual = Number(cupomAplicado.percentual || 0);
    if (!Number.isFinite(percentual) || percentual <= 0) return 0;
    return Number((Number(totalPedido || 0) * (percentual / 100)).toFixed(2));
  }

  function calcularTotalOriginal() {
    return listaItens.reduce((acc, item) => {
      const preco = typeof item.preco === "string" ? parseFloat(item.preco.replace(",", ".")) : Number(item.preco || 0);
      const precoOriginal = typeof item.precoOriginal === "string"
        ? parseFloat(item.precoOriginal.replace(",", "."))
        : Number(item.precoOriginal || preco);
      const precoBase = Number.isFinite(precoOriginal) && precoOriginal > preco ? precoOriginal : preco;
      return acc + precoBase * Number(item.quantidade || 1);
    }, 0);
  }

  window.checkoutCalcularTotal = function checkoutCalcularTotal() {
    const totalPedido = calcularTotal();
    return Number(Math.max(totalPedido - calcularDescontoCupom(totalPedido), 0).toFixed(2));
  };

  window.checkoutObterCupom = function checkoutObterCupom() {
    return cupomAplicado?.codigo || "";
  };

  function atualizarTotal() {
    const totalPedido = calcularTotal();
    const totalOriginal = calcularTotalOriginal();
    const descontoCupom = calcularDescontoCupom(totalPedido);
    const totalFinal = Number(Math.max(totalPedido - descontoCupom, 0).toFixed(2));
    const totalDescontos = Math.max(totalOriginal - totalPedido, 0);
    const totalFormatado = totalFinal.toFixed(2).replace(".", ",");
    const resumoCupom = document.getElementById("resumoCupom");
    const rotuloCupom = document.getElementById("rotuloCupom");
    const valorCupom = document.getElementById("valorCupom");
    const resumoDescontos = document.getElementById("resumoDescontos");
    const valorDescontos = document.getElementById("valorDescontos");

    if (total) total.innerHTML = `R$ <span>${totalFormatado}</span>`;
    if (btnValor) btnValor.innerText = `R$ ${totalFormatado}`;
    if (resumoCupom) resumoCupom.style.display = descontoCupom > 0.009 ? "flex" : "none";
    if (rotuloCupom) rotuloCupom.textContent = cupomAplicado ? `Cupom ${cupomAplicado.codigo}` : "Cupom";
    if (valorCupom) valorCupom.textContent = `- ${formatarMoeda(descontoCupom)}`;
    if (resumoDescontos) resumoDescontos.style.display = totalDescontos > 0.009 ? "flex" : "none";
    if (valorDescontos) valorDescontos.textContent = `- ${formatarMoeda(totalDescontos)}`;
    if (typeof window.atualizarParcelamento === "function") {
      window.atualizarParcelamento(totalFinal);
    }
  }

  function renderizarResumo() {
    if (!container) return;

    if (!listaItens.length) {
      container.innerHTML = "<p class='text-muted mb-0'>O resumo do pedido está vazio.</p>";
      atualizarTotal();
      atualizarBotaoPagamento(false, "Adicione produtos ao carrinho.");
      return;
    }

    container.innerHTML = listaItens
      .map((item) => {
        const preco = typeof item.preco === "string" ? parseFloat(item.preco.replace(",", ".")) : Number(item.preco || 0);
        const precoOriginal = typeof item.precoOriginal === "string"
          ? parseFloat(item.precoOriginal.replace(",", "."))
          : Number(item.precoOriginal || preco);
        const temPromocao = precoOriginal > preco && Number.isFinite(precoOriginal);
        const quantidade = Number(item.quantidade || 1);
        const subtotal = preco * quantidade;
        const precoHtml = temPromocao
          ? `<small class="checkout-price-line"><span class="checkout-old-price">${formatarMoeda(precoOriginal)}</span><span class="checkout-new-price">${formatarMoeda(preco)}</span> cada</small>`
          : `<small>${formatarMoeda(preco)} cada</small>`;
        const descontoHtml = temPromocao && item.desconto
          ? `<span class="checkout-discount-badge">${item.desconto} OFF</span>`
          : "";

        return `
          <div class="checkout-item" data-produto="${item.id}">
            <img src="${item.imagem}" class="checkout-item-img" alt="${item.nome}">
            <div class="checkout-item-main">
              <div class="checkout-item-info">
                <h6>${item.nome}</h6>
                ${precoHtml}
                ${descontoHtml}
                <div class="checkout-stock-msg" data-stock-msg="${item.id}"></div>
              </div>
            </div>
            <div class="checkout-item-actions">
              <div class="checkout-qty">
                <button type="button" class="checkout-qty-btn" data-acao="menos" aria-label="Diminuir quantidade">-</button>
                <input type="number" class="checkout-qty-input" min="1" max="99" value="${quantidade}" aria-label="Quantidade">
                <button type="button" class="checkout-qty-btn" data-acao="mais" aria-label="Aumentar quantidade">+</button>
              </div>
              <button type="button" class="checkout-remove" aria-label="Remover produto">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
            <strong class="checkout-item-total">${formatarMoeda(subtotal)}</strong>
          </div>
        `;
      })
      .join("");

    container.querySelectorAll(".checkout-qty-btn").forEach((btn) => {
      btn.addEventListener("click", alterarQuantidade);
    });

    container.querySelectorAll(".checkout-qty-input").forEach((input) => {
      input.addEventListener("input", editarQuantidade);
    });

    container.querySelectorAll(".checkout-remove").forEach((btn) => {
      btn.addEventListener("click", removerItem);
    });

    atualizarTotal();
  }

  function atualizarStatusCupom(mensagem = "", tipo = "") {
    const status = document.getElementById("cupomCheckoutStatus");
    if (!status) return;
    status.textContent = mensagem;
    status.classList.toggle("is-ok", tipo === "ok");
    status.classList.toggle("is-error", tipo === "error");
  }

  async function validarCupomCheckout() {
    const input = document.getElementById("inputCupomCheckout");
    if (!input) return;

    const codigo = input.value.trim();
    if (!codigo) {
      cupomAplicado = null;
      atualizarStatusCupom("");
      atualizarTotal();
      return;
    }

    atualizarStatusCupom("Validando cupom...");

    try {
      const resposta = await fetch("/recebimento/cupom", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ codigo }),
      });
      const corpo = await resposta.json().catch(() => ({ ok: false }));

      if (!resposta.ok || !corpo.ok || !corpo.cupom) {
        cupomAplicado = null;
        atualizarStatusCupom(corpo.msg || "Cupom inválido.", "error");
        atualizarTotal();
        return;
      }

      cupomAplicado = {
        codigo: corpo.cupom.codigo,
        percentual: Number(corpo.cupom.percentual || 0),
      };
      input.value = cupomAplicado.codigo;
      atualizarStatusCupom(`${cupomAplicado.percentual}% de desconto aplicado.`, "ok");
      atualizarTotal();
    } catch (erro) {
      console.error("Erro ao validar cupom:", erro);
      cupomAplicado = null;
      atualizarStatusCupom("Erro ao validar cupom.", "error");
      atualizarTotal();
    }
  }

  function inicializarCupomCheckout() {
    const input = document.getElementById("inputCupomCheckout");
    if (!input) return;

    input.addEventListener("blur", validarCupomCheckout);
    input.addEventListener("input", () => {
      if (!input.value.trim()) {
        cupomAplicado = null;
        atualizarStatusCupom("");
        atualizarTotal();
      }
    });
  }

  function encontrarItemPorElemento(elemento) {
    const row = elemento.closest(".checkout-item");
    const produtoId = row?.dataset.produto;
    return listaItens.find((item) => String(item.id) === String(produtoId));
  }

  function alterarQuantidade(event) {
    const item = encontrarItemPorElemento(event.currentTarget);
    if (!item) return;

    const acao = event.currentTarget.dataset.acao;
    const quantidadeAtual = Number(item.quantidade || 1);
    item.quantidade = acao === "mais" ? quantidadeAtual + 1 : Math.max(1, quantidadeAtual - 1);

    salvarCarrinho();
    renderizarResumo();
    validarEstoque();
  }

  function editarQuantidade(event) {
    const item = encontrarItemPorElemento(event.currentTarget);
    if (!item) return;

    let quantidade = parseInt(event.currentTarget.value || "1", 10);
    if (!Number.isInteger(quantidade) || quantidade < 1) quantidade = 1;
    if (quantidade > 99) quantidade = 99;

    item.quantidade = quantidade;
    event.currentTarget.value = quantidade;

    salvarCarrinho();
    renderizarResumo();
    validarEstoque();
  }

  function removerItem(event) {
    const row = event.currentTarget.closest(".checkout-item");
    const produtoId = row?.dataset.produto;
    listaItens = listaItens.filter((item) => String(item.id) !== String(produtoId));

    salvarCarrinho();
    renderizarResumo();
    validarEstoque();
  }

  function atualizarBotaoPagamento(disponivel, mensagem) {
    estoqueValido = disponivel;

    if (!btnPagar) return;
    if (typeof window.validarFormulario === "function") window.validarFormulario();

    if (!disponivel) {
      btnPagar.disabled = true;
      if (btnTexto) btnTexto.textContent = mensagem || "Revise o pedido";
    } else if (btnTexto && btnTexto.textContent !== "Confirmar pagamento") {
      btnTexto.textContent = "Confirmar pagamento";
    }
  }

  async function validarEstoque() {
    if (!listaItens.length) {
      atualizarBotaoPagamento(false, "Adicione produtos ao carrinho.");
      return;
    }

    try {
      const resposta = await fetch("/recebimento/validar-estoque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itens: listaItens }),
      });
      const corpo = await resposta.json();

      container.querySelectorAll(".checkout-stock-msg").forEach((msg) => {
        msg.textContent = "";
        msg.classList.remove("is-error", "is-ok");
      });

      (corpo.itens || []).forEach((item) => {
        const msg = container.querySelector(`[data-stock-msg="${item.id}"]`);
        if (!msg) return;

        if (item.disponivel) {
          msg.textContent = `Em estoque: ${item.estoque}`;
          msg.classList.add("is-ok");
        } else {
          msg.textContent = `Disponível: ${item.estoque}. Ajuste a quantidade.`;
          msg.classList.add("is-error");
        }
      });

      atualizarBotaoPagamento(!!corpo.ok, corpo.ok ? null : "Estoque insuficiente");
    } catch (erro) {
      console.error("Erro ao validar estoque:", erro);
      atualizarBotaoPagamento(false, "Erro ao validar estoque");
    }
  }
});
