document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("myOrdersTable");
  if (!table) return;

  table.addEventListener("click", function (event) {
    const paymentButton = event.target.closest(".order-confirm-payment");
    if (paymentButton) {
      event.preventDefault();
      event.stopPropagation();
      confirmarPagamento(paymentButton);
      return;
    }

    const confirmButton = event.target.closest(".order-confirm-delivery");
    if (confirmButton) {
      event.preventDefault();
      event.stopPropagation();
      confirmarEntrega(confirmButton);
      return;
    }

    if (event.target.closest("a, button, input, select")) return;

    const row = event.target.closest("tr.js-my-order-row");
    if (!row) return;

    const detail = row.nextElementSibling;
    if (!detail || !detail.classList.contains("my-order-detail")) return;

    const isOpen = detail.style.display !== "none";
    detail.style.display = isOpen ? "none" : "table-row";
    row.classList.toggle("is-open", !isOpen);

    const icon = row.querySelector(".order-toggle");
    if (icon) {
      icon.innerHTML = isOpen
        ? '<i class="fa-solid fa-chevron-right"></i>'
        : '<i class="fa-solid fa-chevron-down"></i>';
    }
  });

  async function confirmarPagamento(button) {
    const pedidoId = button.dataset.pedidoId;
    if (!pedidoId) return;

    const confirmado = window.confirm("Confirmar o pagamento deste pedido?");
    if (!confirmado) return;

    button.disabled = true;
    const originalHtml = button.innerHTML;
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Confirmando';

    try {
      const response = await fetch(`/pedidos/${pedidoId}/confirmar-pagamento`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json().catch(() => ({ ok: false }));
      if (!response.ok || !data.ok) {
        alert(data.msg || "Nao foi possivel confirmar o pagamento.");
        button.disabled = false;
        button.innerHTML = originalHtml;
        return;
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Erro ao confirmar pagamento.");
      button.disabled = false;
      button.innerHTML = originalHtml;
    }
  }

  async function confirmarEntrega(button) {
    const pedidoId = button.dataset.pedidoId;
    if (!pedidoId) return;

    const confirmado = window.confirm("Confirmar que este pedido foi entregue?");
    if (!confirmado) return;

    button.disabled = true;
    const originalHtml = button.innerHTML;
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Confirmando';

    try {
      const response = await fetch(`/pedidos/${pedidoId}/confirmar-entrega`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json().catch(() => ({ ok: false }));
      if (!response.ok || !data.ok) {
        alert(data.msg || "Nao foi possivel confirmar a entrega.");
        button.disabled = false;
        button.innerHTML = originalHtml;
        return;
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Erro ao confirmar entrega.");
      button.disabled = false;
      button.innerHTML = originalHtml;
    }
  }
});
