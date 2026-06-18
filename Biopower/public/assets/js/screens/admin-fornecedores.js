document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("novoFornecedor");
  const openBtn = document.getElementById("abrirNovoFornecedor");
  const closeBtn = document.getElementById("fecharNovoFornecedor");
  const cancelBtn = document.getElementById("cancelarNovoFornecedor");
  const backdrop = document.getElementById("novoFornecedorBackdrop");
  const form = document.getElementById("novoFornecedorForm");
  const error = document.getElementById("novoFornecedorError");

  if (!modal) return;

  function setError(message) {
    if (error) error.textContent = message || "";
  }

  function openModal() {
    modal.classList.add("adm-dialog--open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("adm-dialog--open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function onlyDigits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  if (openBtn) {
    openBtn.addEventListener("click", function () {
      if (form) form.reset();
      setError("");
      openModal();
    });
  }

  [closeBtn, cancelBtn, backdrop].forEach(function (element) {
    if (element) element.addEventListener("click", closeModal);
  });

  if (form) {
    form.addEventListener("submit", function (event) {
      setError("");

      const cnpjInput = form.querySelector("[name='cnpj']");
      const cnpj = onlyDigits(cnpjInput ? cnpjInput.value : "");

      if (cnpj.length !== 14) {
        event.preventDefault();
        setError("Informe um CNPJ com 14 digitos.");
        if (cnpjInput) cnpjInput.focus();
      }
    });
  }
});
