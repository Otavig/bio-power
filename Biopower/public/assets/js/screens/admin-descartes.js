document.addEventListener("DOMContentLoaded", function () {
  const filterForm = document.querySelector(".discard-filter-form");
  const tabelaDescartes = document.getElementById("tabela-descartes");
  const modal = document.getElementById("confirmarDescarte");
  const form = document.getElementById("confirmarDescarteForm");
  const closeBtn = document.getElementById("fecharConfirmarDescarte");
  const cancelBtn = document.getElementById("cancelarConfirmarDescarte");
  const backdrop = document.getElementById("confirmarDescarteBackdrop");
  const inputLoteId = document.getElementById("descarteLoteId");
  const inputQuantidade = document.getElementById("descarteQuantidade");
  const inputMotivo = document.getElementById("descarteMotivo");
  const error = document.getElementById("descarteError");
  const produtoNome = document.getElementById("descarteProdutoNome");
  const loteNome = document.getElementById("descarteLoteNome");
  const quantidadeDisponivel = document.getElementById("descarteQuantidadeDisponivel");

  let maxQuantidade = 0;

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

  if (filterForm) {
    filterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const submitter = event.submitter;
      const diasInput = document.getElementById("descarteDiasInput");
      const dias = submitter?.dataset?.dias || diasInput?.value || "30";
      window.location.href = `/dashboard?descarteDias=${encodeURIComponent(dias)}#descartes`;
    });
  }

  if (tabelaDescartes) {
    tabelaDescartes.addEventListener("click", function (event) {
      const discardButton = event.target.closest(".btn-confirmar-descarte");
      if (discardButton) {
        event.preventDefault();
        event.stopPropagation();

        const quantidade = Number(discardButton.dataset.quantidade || 0);
        maxQuantidade = quantidade;

        inputLoteId.value = discardButton.dataset.loteId || "";
        inputQuantidade.value = quantidade > 0 ? String(quantidade) : "";
        inputQuantidade.max = String(quantidade);
        inputMotivo.value = "Descarte por validade";
        produtoNome.textContent = discardButton.dataset.produto || "";
        loteNome.textContent = `Lote: ${discardButton.dataset.lote || ""}`;
        quantidadeDisponivel.textContent = `Disponivel: ${quantidade} un.`;
        setError("");
        openModal();
        return;
      }

      if (event.target.closest("select, input, button, a")) return;

      const row = event.target.closest("tr.js-discard-row");
      if (!row) return;

      const detail = row.nextElementSibling;
      if (!detail || !detail.classList.contains("adm-discard-detail")) return;

      const isOpen = detail.style.display !== "none";
      detail.style.display = isOpen ? "none" : "table-row";
      row.classList.toggle("is-open", !isOpen);

      const icon = row.querySelector(".adm-discard-toggle");
      if (icon) icon.textContent = isOpen ? "+" : "-";
    });
  }

  [closeBtn, cancelBtn, backdrop].forEach(function (element) {
    if (element) element.addEventListener("click", closeModal);
  });

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      setError("");

      const loteId = Number(inputLoteId.value);
      const quantidade = Number(inputQuantidade.value);
      const motivo = inputMotivo.value.trim() || "Descarte por validade";

      if (!loteId) {
        setError("Lote invalido.");
        return;
      }

      if (!Number.isInteger(quantidade) || quantidade <= 0) {
        setError("Informe uma quantidade valida.");
        return;
      }

      if (quantidade > maxQuantidade) {
        setError("Quantidade maior que o estoque disponivel.");
        return;
      }

      try {
        const response = await fetch(`/dashboard/descartes/lotes/${loteId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ quantidade, motivo }),
        });

        const data = await response.json().catch(() => ({ ok: false }));
        if (!response.ok || !data.ok) {
          setError(data.msg || "Erro ao confirmar descarte.");
          return;
        }

        window.location.href = "/dashboard?flash=descarte-confirmado#descartes";
      } catch (err) {
        console.error(err);
        setError("Erro ao confirmar descarte.");
      }
    });
  }
});
