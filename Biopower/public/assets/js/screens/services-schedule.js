(function () {
  let data = { services: [] };
  const dataNode = document.getElementById("schedule-data");
  if (dataNode?.textContent) {
    try {
      data = JSON.parse(dataNode.textContent);
    } catch (err) {
      data = { services: [] };
    }
  }

  const services = data.services || [];
  const preselectedServiceId = Number(data.preselectedServiceId || 0) || null;
  const items = [];

  const serviceSelect = document.getElementById("serviceSelect");
  const serviceQty = document.getElementById("serviceQty");
  const servicePreview = document.getElementById("servicePreview");
  const btnAddItem = document.getElementById("btnAddItem");
  const itensBody = document.getElementById("itensBody");
  const subtotalEl = document.getElementById("subtotal");
  const descontosEl = document.getElementById("descontos");
  const totalEl = document.getElementById("total");
  const btnCheckout = document.getElementById("btnCheckout");

  function toMoney(v) {
    return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function getSelectedService() {
    const id = Number(serviceSelect.value);
    return services.find((s) => Number(s.id) === id);
  }

  function renderServicePreview() {
    const s = getSelectedService();
    if (!s) {
      servicePreview.innerHTML = "";
      return;
    }

    servicePreview.innerHTML = `
      <h3>${s.nome}</h3>
      <p>${s.descricao || "Sem descrição disponível."}</p>
      <div class="price">${toMoney(s.preco)}</div>
    `;
  }

  function render() {
    itensBody.innerHTML = "";
    let subtotal = 0;

    items.forEach((item, idx) => {
      const total = item.preco * item.quantidade;
      subtotal += total;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.nome}</td>
        <td>${item.quantidade}</td>
        <td>${toMoney(item.preco)}</td>
        <td>${toMoney(total)}</td>
        <td>
          <button class="btn-remove" data-index="${idx}" type="button" aria-label="Remover item">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      itensBody.appendChild(tr);
    });

    const desconto = 0;
    subtotalEl.textContent = toMoney(subtotal);
    descontosEl.textContent = toMoney(desconto);
    totalEl.textContent = toMoney(subtotal - desconto);
  }

  serviceSelect?.addEventListener("change", renderServicePreview);

  btnAddItem?.addEventListener("click", function () {
    const servico = getSelectedService();
    const quantidade = Math.max(1, Number(serviceQty.value || 1));
    if (!servico) return;

    const servicoId = Number(servico.id);
    const existente = items.find((i) => Number(i.servicoId) === servicoId);

    if (existente) {
      existente.quantidade += quantidade;
    } else {
      items.push({
        servicoId,
        nome: servico.nome,
        preco: Number(servico.preco || 0),
        quantidade,
      });
    }

    render();
  });

  itensBody?.addEventListener("click", function (e) {
    const btn = e.target.closest(".btn-remove");
    if (!btn) return;
    items.splice(Number(btn.dataset.index), 1);
    render();
  });

  btnCheckout?.addEventListener("click", async function () {
    const dataAgendamentoInput = document.getElementById("dataAgendamento").value;
    const profissionalId = Number(document.getElementById("profissionalId").value);
    const observacoes = document.getElementById("observacoes").value || null;

    if (!dataAgendamentoInput || !profissionalId || !items.length) {
      alert("Preencha data, profissional e pelo menos um item.");
      return;
    }

    const dataAgendamento = dataAgendamentoInput.replace("T", " ") + ":00";

    const payload = {
      dataAgendamento,
      profissionalId,
      observacoes,
      itens: items.map((i) => ({ servicoId: i.servicoId, quantidade: i.quantidade })),
    };

    const r = await fetch("/services/schedule/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await r.json();

    if (!r.ok || !j.ok) {
      alert(j.msg || "Erro ao Finalizar Agendamento.");
      return;
    }

    alert("Agendamento Concluído Com Sucesso.");
    window.location.href = "/services#meus";
  });

  if (preselectedServiceId && serviceSelect) {
    const existeOpcao = Array.from(serviceSelect.options).some((opt) => Number(opt.value) === preselectedServiceId);
    if (existeOpcao) serviceSelect.value = String(preselectedServiceId);
  }

  renderServicePreview();
  render();
})();
