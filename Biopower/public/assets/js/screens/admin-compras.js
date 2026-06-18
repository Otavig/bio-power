document.addEventListener("DOMContentLoaded", function () {
  const tabelaCompras = document.getElementById("tabela-compras");
  if (tabelaCompras) {
    tabelaCompras.addEventListener("click", function (event) {
      if (event.target.closest("select, input, button, a")) return;

      const row = event.target.closest("tr.js-purchase-row");
      if (!row) return;

      const detail = row.nextElementSibling;
      if (!detail || !detail.classList.contains("adm-purchase-detail")) return;

      const isOpen = detail.style.display !== "none";
      detail.style.display = isOpen ? "none" : "table-row";

      const icon = row.querySelector(".adm-purchase-toggle");
      if (icon) icon.textContent = isOpen ? "+" : "-";
    });
  }

  const tabelaEstoque = document.querySelector("#estoque .adm-table");
  if (tabelaEstoque) {
    tabelaEstoque.addEventListener("click", function (event) {
      if (event.target.closest("select, input, button, a")) return;

      const row = event.target.closest("tr.js-stock-row");
      if (!row) return;

      const detail = row.nextElementSibling;
      if (!detail || !detail.classList.contains("adm-stock-detail")) return;

      const isOpen = detail.style.display !== "none";
      detail.style.display = isOpen ? "none" : "table-row";
      row.classList.toggle("is-open", !isOpen);

      const icon = row.querySelector(".adm-stock-toggle");
      if (icon) icon.textContent = isOpen ? "+" : "-";
    });
  }

  const modal = document.getElementById("novaCompra");
  const openBtn = document.getElementById("abrirNovaCompra");
  const closeBtn = document.getElementById("fecharNovaCompra");
  const cancelBtn = document.getElementById("cancelarNovaCompra");
  const backdrop = document.getElementById("novaCompraBackdrop");
  const form = document.getElementById("novaCompraForm");
  const fornecedor = document.getElementById("novaCompraFornecedor");
  const produtoSelect = document.getElementById("novaCompraProdutoSelect");
  const produtoQty = document.getElementById("novaCompraProdutoQty");
  const addProdutoBtn = document.getElementById("novaCompraAddProduto");
  const selectedList = document.getElementById("novaCompraSelectedList");
  const selectedInput = document.getElementById("novaCompraSelectedProducts");
  const totalQuantidade = document.getElementById("totalQuantidade");
  const error = document.getElementById("novaCompraError");
  let selectedProducts = [];

  function setError(message) {
    if (error) error.textContent = message || "";
  }

  function openModal() {
    if (!modal) return;
    modal.classList.add("adm-dialog--open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("adm-dialog--open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function syncSelectedInput() {
    if (selectedInput) {
      selectedInput.value = JSON.stringify(selectedProducts.map(function (item) {
        return {
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
        };
      }));
    }

    if (totalQuantidade) {
      totalQuantidade.value = selectedProducts.reduce(function (sum, item) {
        return sum + Number(item.quantidade || 0);
      }, 0) || "";
    }
  }

  function renderSelectedProducts() {
    if (!selectedList) return;

    if (!selectedProducts.length) {
      selectedList.innerHTML = '<p class="empty-state">Nenhum produto selecionado.</p>';
      syncSelectedInput();
      return;
    }

    selectedList.innerHTML = selectedProducts.map(function (item) {
      return `
        <article class="selected-item">
          <div class="selected-product-summary">
            <div>
              <strong>${item.nome}</strong>
              <span>R$ ${Number(item.valorUnitario || 0).toFixed(2)} por unidade</span>
            </div>
            <div class="selected-item-details">
              <span class="product-stock ${Number(item.estoque || 0) < 3 ? "stock-low" : ""}">Estoque atual: ${item.estoque}</span>
            </div>
          </div>
          <div class="selected-product-actions">
            <label>
              Quantidade
              <input type="number" min="1" value="${item.quantidade}" data-produto-id="${item.produtoId}" class="selected-quantity" />
            </label>
            <button type="button" class="btn-remove-product" data-produto-id="${item.produtoId}">Remover</button>
          </div>
        </article>
      `;
    }).join("");

    selectedList.querySelectorAll(".selected-quantity").forEach(function (input) {
      input.addEventListener("input", function () {
        const produtoId = Number(input.dataset.produtoId);
        const item = selectedProducts.find(function (produto) {
          return produto.produtoId === produtoId;
        });
        if (!item) return;
        item.quantidade = Math.max(1, Number(input.value) || 1);
        input.value = item.quantidade;
        syncSelectedInput();
      });
    });

    selectedList.querySelectorAll(".btn-remove-product").forEach(function (button) {
      button.addEventListener("click", function () {
        const produtoId = Number(button.dataset.produtoId);
        selectedProducts = selectedProducts.filter(function (produto) {
          return produto.produtoId !== produtoId;
        });
        renderSelectedProducts();
      });
    });

    syncSelectedInput();
  }

  function addProduto() {
    if (!produtoSelect || !produtoQty) return;

    const option = produtoSelect.selectedOptions[0];
    const produtoId = Number(produtoSelect.value);
    const quantidade = Math.max(1, Number(produtoQty.value) || 1);

    if (!produtoId || !option) {
      setError("Selecione um produto.");
      return;
    }

    const existing = selectedProducts.find(function (item) {
      return item.produtoId === produtoId;
    });
    if (existing) {
      existing.quantidade += quantidade;
    } else {
      selectedProducts.push({
        produtoId,
        nome: option.dataset.nome || option.textContent.trim(),
        valorUnitario: Number(option.dataset.preco || 0),
        estoque: Number(option.dataset.estoque || 0),
        quantidade,
      });
    }

    produtoSelect.value = "";
    produtoQty.value = "1";
    setError("");
    renderSelectedProducts();
  }

  if (openBtn) {
    openBtn.addEventListener("click", function () {
      if (form) form.reset();
      selectedProducts = [];
      renderSelectedProducts();
      setError("");
      openModal();
    });
  }

  [closeBtn, cancelBtn, backdrop].forEach(function (element) {
    if (element) element.addEventListener("click", closeModal);
  });

  if (addProdutoBtn) addProdutoBtn.addEventListener("click", addProduto);

  if (form) {
    form.addEventListener("submit", function (event) {
      setError("");

      if (!fornecedor || !fornecedor.value) {
        event.preventDefault();
        setError("Selecione um fornecedor.");
        return;
      }

      if (!selectedProducts.length) {
        event.preventDefault();
        setError("Selecione pelo menos um produto.");
        return;
      }

      syncSelectedInput();
    });
  }

  // ===== MODAL DE RECEBIMENTO =====
  const modalRecebimento = document.getElementById("confirmarRecebimento");
  const openBtnReceber = document.querySelectorAll(".btn-receber-compra");
  const closeBtnReceber = document.getElementById("fecharConfirmarRecebimento");
  const cancelBtnReceber = document.getElementById("cancelarConfirmarRecebimento");
  const backdropReceber = document.getElementById("confirmarRecebimentoBackdrop");
  const formReceber = document.getElementById("confirmarRecebimentoForm");
  const inputCompraId = document.getElementById("compraIdRecebimento");
  const inputLote = document.getElementById("loteProduto");
  const inputValidade = document.getElementById("validadeProduto");
  const errorReceber = document.getElementById("erroRecebimento");

  function formatDateCompact(date) {
    return date.toISOString().split("T")[0].replaceAll("-", "");
  }

  function buildLotePadrao(compraId) {
    return `LOTE-COMPRA-${compraId}-${formatDateCompact(new Date())}`;
  }

  function openModalRecebimento(compraId) {
    if (!modalRecebimento) return;

    inputCompraId.value = compraId;
    errorReceber.textContent = "";

    inputLote.value = buildLotePadrao(compraId);
    inputValidade.value = "";

    modalRecebimento.classList.add("adm-dialog--open");
    modalRecebimento.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModalRecebimento() {
    if (!modalRecebimento) return;
    modalRecebimento.classList.remove("adm-dialog--open");
    modalRecebimento.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openBtnReceber.forEach(function (button) {
    button.addEventListener("click", function () {
      const compraId = button.dataset.compraId;
      try {
        const itensJson = button.dataset.compraItens;
        if (itensJson) JSON.parse(itensJson);
      } catch (err) {
        console.error("Erro ao parsear itens:", err);
      }
      openModalRecebimento(compraId);
    });
  });

  [closeBtnReceber, cancelBtnReceber, backdropReceber].forEach(function (element) {
    if (element) element.addEventListener("click", closeModalRecebimento);
  });

  if (formReceber) {
    formReceber.addEventListener("submit", async function (event) {
      event.preventDefault();
      errorReceber.textContent = "";

      const compraId = inputCompraId.value;
      const lote = inputLote.value.trim();
      const validade = inputValidade.value;

      if (!compraId || isNaN(compraId)) {
        errorReceber.textContent = "ID de compra inválido.";
        return;
      }

      if (!lote) {
        errorReceber.textContent = "Número do lote é obrigatório.";
        return;
      }

      if (!validade) {
        errorReceber.textContent = "Data de validade é obrigatória.";
        return;
      }

      try {
        const response = await fetch(`/dashboard/compras/${compraId}/receber`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loteProduto: lote,
            validadeProduto: validade,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
          errorReceber.textContent = data.msg || "Erro ao receber compra.";
          return;
        }

        // Sucesso - recarregar pagina
        window.location.href = "/dashboard?flash=compra-recebimento-sucesso#compras";
      } catch (err) {
        console.error("Erro:", err);
        errorReceber.textContent = "Erro ao processar recebimento.";
      }
    });
  }

  // ===== REPOR ESTOQUE =====
  const botoesRepor = document.querySelectorAll(".btn-repor-estoque");
  
  botoesRepor.forEach(function (botao) {
    botao.addEventListener("click", function () {
      const produtoId = Number(botao.dataset.produtoId);
      
      if (form) form.reset();
      selectedProducts = [];
      renderSelectedProducts();
      
      if (produtoSelect) {
        const option = Array.from(produtoSelect.options).find(function (opt) {
          return Number(opt.value) === produtoId;
        });
        
        if (option) {
          produtoSelect.value = produtoId;
          produtoQty.value = "1";
          
          addProduto();
        }
      }
      
      setError("");
      openModal();
    });
  });
});
