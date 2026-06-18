document.addEventListener("DOMContentLoaded", function () {
  if (window.__bioPowerCarrinhoInicializado) return;
  window.__bioPowerCarrinhoInicializado = true;

  let listaCarrinho = lerCarrinho();

  atualizarContador();
  ligarEventosProdutos();
  ligarEventosCarrinho();

  window.gravarPedido = gravarPedido;

  function lerCarrinho() {
    try {
      const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
      return Array.isArray(carrinho) ? carrinho : [];
    } catch {
      return [];
    }
  }

  function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
    atualizarContador();
  }

  function mostrarAlerta(opcoes) {
    if (window.Swal) return Swal.fire(opcoes);

    if (opcoes?.text || opcoes?.title) {
      alert(opcoes.text || opcoes.title);
    }
    return Promise.resolve();
  }

  function ligarEventosProdutos() {
    document
      .querySelectorAll(".product-card .btn-cart, .product-card .btn-buy")
      .forEach((btn) => btn.addEventListener("click", adicionarAoCarrinho));

    document.querySelectorAll(".product-qty").forEach((controle) => {
      controle.addEventListener("click", alterarQuantidadeCard);
    });

    document.querySelectorAll(".product-qty-input").forEach((input) => {
      input.addEventListener("input", normalizarQuantidadeCard);
    });
  }

  function ligarEventosCarrinho() {
    const btnCarrinhoIcon = document.querySelector(".cart-button");
    if (btnCarrinhoIcon) btnCarrinhoIcon.addEventListener("click", abrirCarrinho);

    const offcanvasElement = document.getElementById("offcanvasCarrinho");
    if (offcanvasElement) {
      offcanvasElement.addEventListener("show.bs.offcanvas", abrirCarrinho);
    }
  }

  function atualizarContador() {
    const contador = document.querySelector("#contadorCarrinho");
    const totalItens = listaCarrinho.reduce((acc, item) => acc + Number(item.quantidade || 1), 0);
    if (contador) contador.textContent = totalItens;
  }

  function parsePreco(preco) {
    if (typeof preco === "number") return preco;
    return parseFloat(String(preco || "0").replace(/[^\d,.-]/g, "").replace(",", ".")) || 0;
  }

  function formatarMoeda(valor) {
    return `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;
  }

  function lerQuantidadeCard(card) {
    const inputQtd = card.querySelector(".product-qty-input");
    let quantidade = parseInt(inputQtd?.value || "1", 10);

    if (!Number.isInteger(quantidade) || quantidade < 1) quantidade = 1;
    if (quantidade > 99) quantidade = 99;
    if (inputQtd) inputQtd.value = quantidade;

    return quantidade;
  }

  function normalizarQuantidadeCard() {
    let quantidade = parseInt(this.value || "1", 10);
    if (!Number.isInteger(quantidade) || quantidade < 1) quantidade = 1;
    if (quantidade > 99) quantidade = 99;
    this.value = quantidade;
  }

  function alterarQuantidadeCard(event) {
    const botao = event.target.closest(".product-qty-btn");
    if (!botao) return;

    event.preventDefault();
    event.stopPropagation();

    const input = botao.closest(".product-qty")?.querySelector(".product-qty-input");
    if (!input) return;

    let quantidade = parseInt(input.value || "1", 10);
    if (!Number.isInteger(quantidade) || quantidade < 1) quantidade = 1;

    if (botao.dataset.acao === "mais") quantidade += 1;
    if (botao.dataset.acao === "menos") quantidade -= 1;

    input.value = Math.min(Math.max(quantidade, 1), 99);
  }

  function alterarQuantidadeCarrinho(event) {
    const produtoId = event.currentTarget.dataset.produto;
    const acao = event.currentTarget.dataset.acao;
    const item = listaCarrinho.find((produto) => String(produto.id) === String(produtoId));

    if (!item) return;

    if (acao === "mais") item.quantidade = Number(item.quantidade || 1) + 1;
    if (acao === "menos") item.quantidade = Math.max(1, Number(item.quantidade || 1) - 1);

    salvarCarrinho();
    abrirCarrinho();
  }

  function excluirProdutoCarrinho(event) {
    const produtoIdExcluir = event.currentTarget.dataset.produto;
    listaCarrinho = listaCarrinho.filter((item) => String(item.id) !== String(produtoIdExcluir));
    salvarCarrinho();
    abrirCarrinho();
  }

  function abrirCarrinho() {
    const modalCorpo = document.getElementById("modalCarrinhoCorpo");
    const textoValorTotal = document.querySelector("#offcanvasCarrinho .cart-drawer-total strong");
    const btnFinalizar = document.querySelector("#offcanvasCarrinho .cart-drawer-checkout");

    if (!modalCorpo) return;

    if (!listaCarrinho.length) {
      modalCorpo.innerHTML = `
        <div class="cart-drawer-empty">
          <i class="fa-solid fa-cart-shopping"></i>
          <strong>Seu carrinho está vazio</strong>
          <span>Seus produtos aparecerão aqui.</span>
        </div>`;
      if (textoValorTotal) textoValorTotal.textContent = "R$ 0,00";
      if (btnFinalizar) btnFinalizar.disabled = true;
      return;
    }

    let valorTotal = 0;
    const itensHtml = listaCarrinho
      .map((item) => {
        const precoNumerico = parsePreco(item.preco);
        const precoOriginal = parsePreco(item.precoOriginal || item.preco);
        const temPromocao = precoOriginal > precoNumerico;
        const quantidade = Number(item.quantidade || 1);
        const subtotal = precoNumerico * quantidade;
        valorTotal += subtotal;
        const precoUnitarioHtml = temPromocao
          ? `<span class="cart-drawer-unit-price"><span class="cart-drawer-old-price">${formatarMoeda(precoOriginal)}</span><span>${formatarMoeda(precoNumerico)} cada</span></span>`
          : "";
        const descontoHtml = temPromocao && item.desconto
          ? `<span class="cart-drawer-discount">${item.desconto} OFF</span>`
          : "";

        return `
          <article class="cart-drawer-item">
            <img src="${item.imagem}" class="cart-drawer-img" alt="${item.nome}">
            <div class="cart-drawer-info">
              <strong class="cart-drawer-name">${item.nome}</strong>
              <div class="cart-drawer-qty" aria-label="Quantidade">
                <button data-produto="${item.id}" data-acao="menos" class="cart-drawer-qty-btn btn-qtd" type="button" aria-label="Diminuir quantidade">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span class="cart-drawer-qty-value">${quantidade}</span>
                <button data-produto="${item.id}" data-acao="mais" class="cart-drawer-qty-btn btn-qtd" type="button" aria-label="Aumentar quantidade">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
              ${precoUnitarioHtml}
              ${descontoHtml}
              <span class="cart-drawer-price">${formatarMoeda(subtotal)}</span>
            </div>
            <button data-produto="${item.id}" class="cart-drawer-remove excluirCarrinho" type="button" aria-label="Remover produto">
              <i class="fa-solid fa-trash"></i>
            </button>
          </article>`;
      })
      .join("");

    modalCorpo.innerHTML = `<div class="cart-drawer-list">${itensHtml}</div>`;
    if (textoValorTotal) textoValorTotal.textContent = formatarMoeda(valorTotal);
    if (btnFinalizar) btnFinalizar.disabled = false;

    modalCorpo.querySelectorAll(".excluirCarrinho").forEach((btn) => {
      btn.addEventListener("click", excluirProdutoCarrinho);
    });

    modalCorpo.querySelectorAll(".btn-qtd").forEach((btn) => {
      btn.addEventListener("click", alterarQuantidadeCarrinho);
    });
  }

  function adicionarAoCarrinho(event) {
    event.preventDefault();
    event.stopPropagation();

    const card = event.currentTarget.closest(".product-card");
    if (!card) return;

    const produtoId = card.dataset.id;
    const nome = card.dataset.name;
    const preco = parsePreco(card.dataset.price);
    const precoOriginal = parsePreco(card.dataset.originalPrice || card.dataset.price);
    const desconto = card.dataset.discountLabel || "";
    const imagem = card.querySelector("img")?.src || "/assets/imgs/product/default.png";
    const quantidade = lerQuantidadeCard(card);

    if (!produtoId) {
      alert("ID do produto não encontrado no HTML.");
      return;
    }

    const item = {
      id: produtoId,
      nome,
      preco,
      precoOriginal,
      desconto,
      imagem,
      quantidade
    };

    if (event.currentTarget.classList.contains("btn-buy")) {
      listaCarrinho = [item];
      salvarCarrinho();
      window.location.href = "/recebimento";
      return;
    }

    const existente = listaCarrinho.find((produto) => String(produto.id) === String(produtoId));
    if (existente) {
      existente.quantidade = Number(existente.quantidade || 1) + quantidade;
      existente.preco = preco;
      existente.precoOriginal = precoOriginal;
      existente.desconto = desconto;
      existente.imagem = imagem;
    } else {
      listaCarrinho.push(item);
    }

    salvarCarrinho();

    mostrarAlerta({
      title: "Produto adicionado",
      text: `${nome} foi adicionado ao carrinho.`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end"
    });
  }

  function gravarPedido() {
    const dadosPagamento = typeof window.getDadosPagamento === "function"
      ? window.getDadosPagamento()
      : null;
    const dadosEntrega = typeof window.getDadosEntrega === "function"
      ? window.getDadosEntrega()
      : null;
    const metodoPagamento = typeof window.getMetodoPagamento === "function"
      ? window.getMetodoPagamento()
      : null;

    if (!listaCarrinho.length) {
      mostrarAlerta({
        title: "Carrinho vazio",
        text: "Nenhum produto adicionado ao carrinho.",
        icon: "info"
      });
      return Promise.resolve(false);
    }

    return fetch("/recebimento/gravar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        itens: listaCarrinho,
        cliente: dadosPagamento,
        entrega: dadosEntrega,
        metodoPagamento
      })
    })
      .then((resposta) => resposta.json())
      .then((corpo) => {
        if (!corpo.ok) {
          mostrarAlerta({
            title: "Atenção",
            text: corpo.msg || "Erro ao processar pedido.",
            icon: "warning"
          });
          return false;
        }

        mostrarAlerta({
          title: "Sucesso!",
          text: corpo.msg || "Pedido realizado com sucesso!",
          icon: "success"
        });

        listaCarrinho = [];
        localStorage.removeItem("carrinho");
        atualizarContador();

        if (typeof window.checkoutAtualizarResumo === "function") {
          window.checkoutAtualizarResumo();
        }

        return true;
      })
      .catch((erro) => {
        console.error("Erro ao gravar:", erro);
        mostrarAlerta({
          title: "Erro",
          text: "Não foi possível finalizar o pedido.",
          icon: "error"
        });
        return false;
      });
  }
});
