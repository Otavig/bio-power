document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("btnSalvarProduto");
  const form = document.getElementById("formProduto");
  if (!btn || !form) return;

  const dialogProduto = document.getElementById("dialog-novo-produto");
  const btnNovoProduto = document.getElementById("btnNovoProduto");
  const modalTitle = document.getElementById("productModalTitle");
  const submitText = document.getElementById("productSubmitText");
  const productsPayload = document.getElementById("productsPayload");
  const productsData = productsPayload ? JSON.parse(productsPayload.textContent || "[]") : [];
  let produtoEditandoId = null;

  const nome = document.getElementById("nome");
  const preco = document.getElementById("preco");
  const categoria = document.getElementById("categoria");
  const marca = document.getElementById("marca");
  const sabor = document.getElementById("sabor");
  const desconto = document.getElementById("desconto");
  const imagem = document.getElementById("imagem");
  const previewImagemProduto = document.getElementById("previewImgProduto");

  const camposObrigatorios = [nome, preco, categoria];

  const showAlert = (options) => {
    if (window.Swal) return window.Swal.fire(options);
    console.log(options.title || options.text || "");
    return Promise.resolve();
  };

  function recarregarProdutos() {
    if (window.location.hash !== "#products") {
      window.location.hash = "products";
    }
    window.location.reload();
  }

  function resetBordas() {
    [nome, preco, categoria, marca, sabor, desconto, imagem]
      .filter(Boolean)
      .forEach((el) => (el.style.borderColor = "#ced4da"));
  }

  function validarCampos() {
    const faltando = [];
    if (!nome.value.trim()) faltando.push(nome);
    if (!preco.value.trim()) faltando.push(preco);
    if (!categoria.value.trim()) faltando.push(categoria);
    return faltando;
  }

  function aplicarMascaraPreco() {
    const digitos = preco.value.replace(/\D/g, "");
    if (!digitos) {
      preco.value = "";
      return;
    }
    const valor = Number(digitos) / 100;
    preco.value = valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function aplicarMascaraPorcentagem() {
    let valor = desconto.value.replace(/[^\d,.]/g, "").replace(",", ".");
    const partes = valor.split(".");
    if (partes.length > 2) valor = `${partes[0]}.${partes.slice(1).join("")}`;
    let numero = Number(valor);
    if (Number.isNaN(numero)) {
      desconto.value = "0,00";
      return;
    }
    numero = Math.min(Math.max(numero, 0), 100);
    desconto.value = String(numero.toFixed(2)).replace(".", ",");
  }

  function normalizarPorcentagem(value) {
    const numero = Number(String(value || 0).replace(/[^\d,.]/g, "").replace(",", "."));
    if (Number.isNaN(numero)) return "0";
    return String(Math.min(Math.max(numero, 0), 100)).replace(".", ",");
  }

  function formatarPrecoInput(value) {
    const numero = Number(value || 0);
    preco.value = numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function limparModalProduto() {
    produtoEditandoId = null;
    form.reset();
    desconto.value = "0";
    if (previewImagemProduto) {
      previewImagemProduto.removeAttribute("src");
      previewImagemProduto.style.display = "none";
    }
    if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-box-open"></i> Novo produto';
    if (submitText) submitText.textContent = "Salvar produto";
  }

  function abrirModalProduto(produto = null) {
    limparModalProduto();
    if (produto) {
      produtoEditandoId = produto.id;
      nome.value = produto.nome || "";
      categoria.value = produto.categoriaId || "";
      marca.value = produto.laboratorioId || "";
      formatarPrecoInput(produto.precoNumber || 0);
      sabor.value = produto.descricao || "";
      desconto.value = String(Number(produto.descontoNumber || 0).toFixed(2)).replace(".", ",");
      if (produto.imagem && previewImagemProduto) {
        previewImagemProduto.src = produto.imagem;
        previewImagemProduto.style.display = "block";
      }
      if (modalTitle) modalTitle.innerHTML = '<i class="fas fa-edit"></i> Editar produto';
      if (submitText) submitText.textContent = "Salvar alterações";
    }
    dialogProduto?.classList.add("adm-dialog--open");
  }

  window.closeProductModal = function () {
    dialogProduto?.classList.remove("adm-dialog--open");
    limparModalProduto();
  };

  async function salvarProduto() {
    resetBordas();
    const faltando = validarCampos();

    if (faltando.length) {
      faltando.forEach((el) => (el.style.borderColor = "red"));
      showAlert({ icon: "warning", title: "Preencha os campos obrigatórios (Nome, Preço e Categoria)." });
      return;
    }

    btn.disabled = true;
    btn.classList.add("is-loading");

    const payload = new FormData();
    payload.append("nome", nome.value.trim());
    payload.append("preco", preco.value.trim());
    payload.append("categoria", categoria.value.trim());
    payload.append("marca", marca.value.trim());
    payload.append("sabor", sabor.value.trim());
    payload.append("desconto", normalizarPorcentagem(desconto.value));
    if (imagem?.files?.[0]) payload.append("imagem", imagem.files[0]);

    try {
      const resposta = await fetch(produtoEditandoId ? `/dashboard/products/${produtoEditandoId}` : "/dashboard/products", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: payload,
      });

      const corpo = await resposta.json().catch(() => ({ ok: false, msg: "Erro ao ler resposta." }));

      if (resposta.ok && corpo.ok) {
        dialogProduto?.classList.remove("adm-dialog--open");
        const fallback = produtoEditandoId
          ? "/dashboard?flash=produto-atualizado#products"
          : "/dashboard?flash=produto-adicionado#products";
        window.location.assign(corpo.redirectTo || fallback);
      } else {
        await showAlert({ icon: "error", title: corpo.msg || "Erro ao cadastrar produto." });
      }
    } catch (err) {
      await showAlert({ icon: "error", title: "Erro ao cadastrar produto. Tente novamente." });
      console.error(err);
    } finally {
      btn.disabled = false;
      btn.classList.remove("is-loading");
    }
  }

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    salvarProduto();
  });

  btnNovoProduto?.addEventListener("click", function () {
    abrirModalProduto();
  });

  document.querySelectorAll(".btn-edit-product").forEach((editBtn) => {
    editBtn.addEventListener("click", function () {
      const produto = productsData.find((item) => String(item.id) === String(editBtn.dataset.id));
      if (produto) abrirModalProduto(produto);
    });
  });

  preco.addEventListener("input", aplicarMascaraPreco);
  desconto.addEventListener("blur", aplicarMascaraPorcentagem);
  desconto.addEventListener("input", function () {
    desconto.value = desconto.value.replace(/[^\d,.]/g, "");
  });

  if (imagem && previewImagemProduto) {
    imagem.addEventListener("change", function () {
      const file = imagem.files?.[0];
      if (!file) {
        previewImagemProduto.removeAttribute("src");
        previewImagemProduto.style.display = "none";
        return;
      }
      previewImagemProduto.src = URL.createObjectURL(file);
      previewImagemProduto.style.display = "block";
    });
  }

  // Exclusão via fetch (com SweetAlert, se disponível)
  function confirmDialog(opts) {
    if (window.Swal) {
      return window.Swal.fire(opts);
    }
    const ok = window.confirm(opts.title || "Confirmar?");
    return Promise.resolve({ isConfirmed: ok });
  }

  async function excluirProduto(form) {
    const nomeProduto = form.dataset.nome || "este produto";
    const action = form.getAttribute("action") || form.action;
    const confirmOpts = {
      title: "Excluir produto?",
      html: `Você está prestes a excluir <strong>${nomeProduto}</strong>.<br>Essa ação é irreversível.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: '<i class="fa-solid fa-trash"></i> Excluir',
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#cc0000",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      focusCancel: true,
    };

    const result = await confirmDialog(confirmOpts);
    if (!result.isConfirmed) return;

    const btnDelete = form.querySelector("button") || form.querySelector("[type='button']");
    if (btnDelete) btnDelete.disabled = true;
    try {
      const resposta = await fetch(action, {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      const corpo = await resposta.json().catch(() => ({ ok: false, msg: "Erro ao ler resposta." }));
      if (resposta.ok && corpo.ok) {
        window.location.hash = "products";
        window.location.reload();
      } else {
        await showAlert({
          icon: resposta.status === 409 ? "warning" : "error",
          title: corpo.msg || "Erro ao excluir produto.",
        });
      }
    } catch (err) {
      await showAlert({ icon: "error", title: "Erro ao excluir produto. Tente novamente." });
      console.error(err);
    } finally {
      if (btnDelete) btnDelete.disabled = false;
    }
  }

  document.querySelectorAll(".form-delete-product").forEach((f) => {
    f.addEventListener("submit", (e) => e.preventDefault());
    const btnDelete = f.querySelector("button");
    if (btnDelete) {
      btnDelete.addEventListener("click", (e) => {
        e.preventDefault();
        excluirProduto(f);
      });
    }
  });

  // Reposição/ajuste de estoque via fetch
  async function reporEstoque(btnRepor) {
    const produtoId = btnRepor.dataset.id;
    const nome = btnRepor.dataset.nome || "este produto";

    const result = await confirmDialog({
      title: "Atualizar estoque",
      html:
        "Produto: <strong>" +
        nome +
        "</strong><br>Informe a quantidade a <b>adicionar</b> (use número negativo para subtrair).",
      input: "number",
      inputLabel: "Quantidade",
      inputPlaceholder: "Ex: 50",
      inputAttributes: { min: "-9999", step: "1" },
      showCancelButton: true,
      confirmButtonText: '<i class="fa-solid fa-boxes-stacked"></i> Atualizar',
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#cc0000",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      inputValidator: function (value) {
        if (!value || isNaN(Number(value))) return "Informe uma quantidade válida.";
      },
    });

    if (!result.isConfirmed) return;

    const quantidade = Number(result.value);
    if (Number.isNaN(quantidade)) {
      showAlert({ icon: "warning", title: "Informe uma quantidade válida." });
      return;
    }

    btnRepor.disabled = true;
    try {
      const resposta = await fetch(`/dashboard/stock/update/${produtoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ quantidade }),
      });
      const corpo = await resposta.json().catch(() => ({ ok: false, msg: "Erro ao ler resposta." }));
      if (resposta.ok && corpo.ok) {
        await showAlert({ icon: "success", title: corpo.msg || "Estoque atualizado.", text: corpo.total !== undefined ? `Novo total: ${corpo.total}.` : undefined });
        window.location.reload();
      } else {
        await showAlert({ icon: "error", title: corpo.msg || "Erro ao atualizar estoque." });
      }
    } catch (err) {
      console.error(err);
      await showAlert({ icon: "error", title: "Erro ao atualizar estoque. Tente novamente." });
    } finally {
      btnRepor.disabled = false;
    }
  }

  document.querySelectorAll("[onclick^='reporEstoque']").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      reporEstoque(btn);
    });
  });

  // Mantém compatibilidade com handlers inline
  window.reporEstoque = reporEstoque;
});
