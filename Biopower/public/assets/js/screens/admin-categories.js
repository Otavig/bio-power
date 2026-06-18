document.addEventListener("DOMContentLoaded", function () {
  const dialog = document.getElementById("dialog-nova-categoria");
  const btnNova = document.getElementById("btnNovaCategoria");
  const btnSalvar = document.getElementById("btnSalvarCategoria");
  const form = document.getElementById("formCategoria");
  const nomeInput = document.getElementById("categoriaNome");
  const modalTitle = document.getElementById("categoryModalTitle");
  const submitText = document.getElementById("categorySubmitText");
  const categoriesPayload = document.getElementById("categoriesPayload");
  const categoriesData = categoriesPayload ? JSON.parse(categoriesPayload.textContent || "[]") : [];
  let categoriaEditandoId = null;

  if (!dialog || !btnSalvar || !form || !nomeInput) return;

  const showAlert = (options) => {
    if (window.Swal) return window.Swal.fire(options);
    window.alert(options.title || options.text || "");
    return Promise.resolve();
  };

  function limparModalCategoria() {
    categoriaEditandoId = null;
    form.reset();
    nomeInput.style.borderColor = "#ced4da";
    form.action = "/dashboard/categories";
    if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-tag"></i> Nova categoria';
    if (submitText) submitText.textContent = "Salvar categoria";
  }

  function abrirModalCategoria(categoria = null) {
    limparModalCategoria();
    if (categoria) {
      categoriaEditandoId = categoria.id;
      nomeInput.value = categoria.nome || "";
      form.action = `/dashboard/categories/${categoria.id}`;
      if (modalTitle) modalTitle.innerHTML = '<i class="fas fa-edit"></i> Editar categoria';
      if (submitText) submitText.textContent = "Salvar alterações";
    }
    dialog.classList.add("adm-dialog--open");
    nomeInput.focus();
  }

  window.closeCategoryModal = function () {
    dialog.classList.remove("adm-dialog--open");
    limparModalCategoria();
  };

  async function salvarCategoria() {
    const nome = nomeInput.value.trim();
    nomeInput.style.borderColor = "#ced4da";

    if (!nome) {
      nomeInput.style.borderColor = "red";
      await showAlert({ icon: "warning", title: "Informe o nome da categoria." });
      return;
    }

    btnSalvar.disabled = true;

    try {
      const resposta = await fetch(categoriaEditandoId ? `/dashboard/categories/${categoriaEditandoId}` : "/dashboard/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ nome }),
      });
      const corpo = await resposta.json().catch(() => ({ ok: false, msg: "Erro ao ler resposta." }));

      if (resposta.ok && corpo.ok) {
        window.location.hash = "categories";
        window.location.reload();
      } else {
        await showAlert({ icon: "error", title: corpo.msg || "Erro ao salvar categoria." });
      }
    } catch (err) {
      console.error(err);
      await showAlert({ icon: "error", title: "Erro ao salvar categoria. Tente novamente." });
    } finally {
      btnSalvar.disabled = false;
    }
  }

  async function excluirCategoria(deleteForm) {
    const nome = deleteForm.dataset.nome || "esta categoria";
    const result = window.Swal
      ? await window.Swal.fire({
          title: "Excluir categoria?",
          html: `Você está prestes a excluir <strong>${nome}</strong>.`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: '<i class="fa-solid fa-trash"></i> Excluir',
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#cc0000",
          cancelButtonColor: "#6b7280",
          reverseButtons: true,
          focusCancel: true,
        })
      : { isConfirmed: window.confirm(`Excluir ${nome}?`) };

    if (!result.isConfirmed) return;

    try {
      const resposta = await fetch(deleteForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      const corpo = await resposta.json().catch(() => ({ ok: false, msg: "Erro ao ler resposta." }));

      if (resposta.ok && corpo.ok) {
        window.location.hash = "categories";
        window.location.reload();
      } else {
        await showAlert({
          icon: resposta.status === 409 ? "warning" : "error",
          title: corpo.msg || "Erro ao excluir categoria.",
        });
      }
    } catch (err) {
      console.error(err);
      await showAlert({ icon: "error", title: "Erro ao excluir categoria. Tente novamente." });
    }
  }

  btnNova?.addEventListener("click", () => abrirModalCategoria());
  btnSalvar.addEventListener("click", salvarCategoria);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    salvarCategoria();
  });

  document.querySelectorAll(".btn-edit-category").forEach((btn) => {
    btn.addEventListener("click", function () {
      const categoria = categoriesData.find((item) => String(item.id) === String(btn.dataset.id));
      abrirModalCategoria(categoria || { id: btn.dataset.id, nome: btn.dataset.nome });
    });
  });

  document.querySelectorAll(".form-delete-category").forEach((deleteForm) => {
    deleteForm.addEventListener("submit", (e) => e.preventDefault());
    deleteForm.querySelector("button")?.addEventListener("click", function (e) {
      e.preventDefault();
      excluirCategoria(deleteForm);
    });
  });
});
