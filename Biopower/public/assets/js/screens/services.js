document.addEventListener("DOMContentLoaded", function () {
  const busca = document.getElementById("buscaServicos");
  const grid = document.getElementById("gridServicos");

  if (busca && grid) {
    busca.addEventListener("input", () => {
      const termo = busca.value.toLowerCase();
      grid.querySelectorAll(".service-card").forEach((card) => {
        const nome = card.dataset.nome.toLowerCase();
        card.style.display = nome.includes(termo) ? "flex" : "none";
      });
    });
  }

  function contratar(btn) {
    const servicoId = btn.dataset.id;
    if (!servicoId) return;
    window.location.href = `/services/agendar?serviceId=${encodeURIComponent(servicoId)}`;
  }

  document.querySelectorAll(".btn-contratar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      contratar(btn);
    });
  });
});
