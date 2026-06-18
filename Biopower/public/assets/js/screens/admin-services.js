document.addEventListener("DOMContentLoaded", function () {
  const dialog = document.getElementById("dialog-servico");
  const form = document.getElementById("formServico");
  const btnSalvar = document.getElementById("btnSalvarServico");
  const inputId = document.getElementById("servicoId");
  const inputNome = document.getElementById("servicoNome");
  const inputPreco = document.getElementById("servicoPreco");
  const inputDesc = document.getElementById("servicoDesc");
  const tabelaContratos = document.getElementById("tabela-contratos-servicos");
  const filtroStatusContrato = document.getElementById("filtroStatusContrato");

  const hasServiceCrud = Boolean(dialog && form && btnSalvar);

   const showAlert = (options) => {
     if (window.Swal) return window.Swal.fire(options);
     console.log(options.title || options.text || "");
     return Promise.resolve();
   };

  function resetBorders() {
    [inputNome, inputPreco].forEach((el) => {
      if (el) el.style.borderColor = "#ced4da";
    });
  }

  function openDialog() {
    dialog.classList.add("adm-dialog--open");
  }

  function closeDialog() {
    dialog.classList.remove("adm-dialog--open");
  }

  async function salvarServico() {
    resetBorders();
    const nome = inputNome.value.trim();
    const preco = inputPreco.value.trim();
    const descricao = inputDesc.value.trim();
    const id = inputId.value.trim();

    const faltando = [];
    if (!nome) faltando.push(inputNome);
    if (!preco) faltando.push(inputPreco);
    if (faltando.length) {
      faltando.forEach((el) => (el.style.borderColor = "red"));
      showAlert({ icon: "warning", title: "Preencha Nome e Preço." });
      return;
    }

    const payload = { nome, preco, descricao };
    const isEdicao = Boolean(id);
    const url = isEdicao ? `/dashboard/services/${id}` : "/dashboard/services";
    const method = isEdicao ? "PUT" : "POST";

    btnSalvar.disabled = true;
    btnSalvar.classList.add("is-loading");

    try {
      const resposta = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const corpo = await resposta.json().catch(() => ({ ok: false, msg: "Erro ao ler resposta." }));
      if (resposta.ok && corpo.ok) {
        await showAlert({ icon: "success", title: corpo.msg || "Serviço salvo." });
        window.location.reload();
      } else {
        await showAlert({ icon: "error", title: corpo.msg || "Erro ao salvar serviço." });
      }
    } catch (err) {
      console.error(err);
      await showAlert({ icon: "error", title: "Erro ao salvar serviço. Tente novamente." });
    } finally {
      btnSalvar.disabled = false;
      btnSalvar.classList.remove("is-loading");
    }
  }

  async function excluirServico(btn) {
    const id = btn.dataset.id;
    const nome = btn.dataset.nome || "este serviço";
    if (!id) return;

    const confirma = window.Swal
      ? await window.Swal.fire({
          title: "Excluir serviço?",
          html: `Você está prestes a excluir <strong>${nome}</strong>.<br>Essa ação é irreversível.`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: '<i class="fa-solid fa-trash"></i> Excluir',
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#cc0000",
          cancelButtonColor: "#6b7280",
          reverseButtons: true,
          focusCancel: true,
        })
      : { isConfirmed: window.confirm("Excluir este serviço?") };

    if (!confirma.isConfirmed) return;

    btn.disabled = true;
    try {
      const resposta = await fetch(`/dashboard/services/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      const corpo = await resposta.json().catch(() => ({ ok: false, msg: "Erro ao ler resposta." }));
      if (resposta.ok && corpo.ok) {
        await showAlert({ icon: "success", title: corpo.msg || "Serviço excluído." });
        window.location.reload();
      } else {
        await showAlert({ icon: "error", title: corpo.msg || "Erro ao excluir serviço." });
      }
    } catch (err) {
      console.error(err);
      await showAlert({ icon: "error", title: "Erro ao excluir serviço. Tente novamente." });
    } finally {
      btn.disabled = false;
    }
  }

  if (hasServiceCrud) {
    btnSalvar.addEventListener("click", function (e) {
      e.preventDefault();
      salvarServico();
    });

    window.editarServico = function (btn) {
      inputId.value = btn.dataset.id || "";
      inputNome.value = btn.dataset.nome || "";
      inputPreco.value = btn.dataset.preco || "";
      inputDesc.value = btn.dataset.descricao || "";
      openDialog();
    };

    window.excluirServico = function (btn) {
      excluirServico(btn);
    };
  }

  // ----- Gestão de contratos de serviços (admin) -----
  async function atualizarContrato(row) {
    const id = row?.dataset?.contratoId;
    if (!id) return;

  const statusSelect = row.querySelector(".js-contrato-status");
  const obsInput = row.querySelector(".js-contrato-obs");
  const metodoSelect = row.nextElementSibling?.querySelector(".js-metodo-pagamento");
  const status = statusSelect?.value;
  const observacoes = obsInput?.value?.trim() || null;
  const metodoPagamentoId = metodoSelect ? (metodoSelect.value ? Number(metodoSelect.value) : null) : null;

    // gather produtos from the dynamic list if present (detail row)
    const detailNode = row.nextElementSibling;
    const produtosListNode = detailNode?.querySelector(".js-produtos-list");
    const produtos = [];
    if (produtosListNode) {
      produtosListNode.querySelectorAll(".js-produto-item").forEach((item) => {
        const pid = Number(item.dataset.produtoId);
        const qtd = Number(item.dataset.quantidade);
        if (Number.isFinite(pid) && Number.isFinite(qtd) && qtd > 0) produtos.push({ produtoId: pid, quantidade: qtd });
      });
    }

    const btn = row.querySelector(".js-atualizar-contrato");
    if (btn) {
      btn.disabled = true;
      btn.classList.add("is-loading");
    }

    try {
      const payload = { status, observacoes, produtos };
      if (metodoPagamentoId) payload.metodoPagamentoId = metodoPagamentoId;

      const resposta = await fetch(`/dashboard/services/contratos/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const corpo = await resposta.json().catch(() => ({ ok: false, msg: "Erro ao ler resposta." }));
      if (resposta.ok && corpo.ok) {
        if (window.Swal) {
          window.Swal.fire({
            toast: true,
            position: "top-end",
            timer: 2000,
            showConfirmButton: false,
            icon: "success",
            title: corpo.msg || "Status atualizado",
          });
        } else {
          await showAlert({ icon: "success", title: corpo.msg || "Status atualizado." });
        }
        row.dataset.status = status;
        return corpo;
      } else {
        if (window.Swal) {
          window.Swal.fire({ icon: "error", title: "Erro", text: corpo.msg || "Erro ao atualizar status." });
        } else {
          await showAlert({ icon: "error", title: corpo.msg || "Erro ao atualizar status." });
        }
        return corpo;
      }
    } catch (err) {
      console.error(err);
      if (window.Swal) {
        window.Swal.fire({ icon: "error", title: "Erro", text: "Erro ao atualizar status. Tente novamente." });
      } else {
        await showAlert({ icon: "error", title: "Erro ao atualizar status. Tente novamente." });
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.classList.remove("is-loading");
      }
    }
    return false;
  }

  function filtrarContratos() {
    if (!tabelaContratos) return;
    const statusFiltro = (filtroStatusContrato?.value || "").trim().toLowerCase();
    const linhas = tabelaContratos.querySelectorAll("tbody tr.js-contract-row");
    linhas.forEach((tr) => {
      const status = (tr.dataset.status || "").trim().toLowerCase();
      const visivel = !statusFiltro || status === statusFiltro;
      tr.style.display = visivel ? "table-row" : "none";
      const detalhe = tr.nextElementSibling;
      if (detalhe && detalhe.classList.contains("adm-contract-detail")) {
        detalhe.style.display = visivel && detalhe.dataset.expanded === "true" ? "table-row" : "none";
        if (!visivel) syncToggleIcon(tr, false);
      }
    });
  }

  function syncStatusClasses(select) {
    if (!select) return;
    select.className = "adm-input adm-select-status js-contrato-status status-" + (select.value || "");
  }

  function syncToggleIcon(row, expanded) {
    const icon = row?.querySelector(".adm-contract-toggle");
    if (!icon) return;
    icon.textContent = expanded ? "▼" : "▲";
  }

  if (tabelaContratos) {
    // inicializa classes de status
    tabelaContratos.querySelectorAll(".js-contrato-status").forEach(syncStatusClasses);

    tabelaContratos.addEventListener("change", function (e) {
      const select = e.target.closest(".js-contrato-status");
      if (select) {
        const row = select.closest("tr");
        if (row) row.dataset.status = select.value;
        syncStatusClasses(select);
        filtrarContratos();
        if (row) atualizarContrato(row);
      }
    });

    tabelaContratos.addEventListener("click", function (e) {
      if (e.target.closest(".js-contrato-status") || e.target.closest(".js-contrato-obs")) return;
      const row = e.target.closest("tr.js-contract-row");
      if (!row) return;
      const detalhe = row.nextElementSibling;
      if (!detalhe || !detalhe.classList.contains("adm-contract-detail")) return;
      const expandido = detalhe.style.display === "none" || !detalhe.style.display;
      detalhe.dataset.expanded = expandido ? "true" : "false";
      detalhe.style.display = expandido ? "table-row" : "none";
      syncToggleIcon(row, expandido);
    });

    // delegated click for Cobrar button
    tabelaContratos.addEventListener("click", async function (e) {
      const cobrar = e.target.closest(".js-cobrar");
      if (!cobrar) return;
      const detail = cobrar.closest("tr.adm-contract-detail");
      if (!detail) return;
      const row = detail.previousElementSibling;
      if (!row) return;

      // set status to finalizado and call update
      const statusSelect = row.querySelector(".js-contrato-status");
      if (statusSelect) statusSelect.value = "finalizado";

      cobrar.disabled = true;
      try {
        const corpo = await atualizarContrato(row);
        if (corpo && corpo.ok) {
          // update displayed total if backend returned agendamento
          try {
            if (corpo.agendamento && corpo.agendamento.valorTotal !== undefined) {
              const valorTd = row.querySelectorAll("td")[3];
              if (valorTd) {
                const strong = valorTd.querySelector("strong");
                const formatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                  Number(corpo.agendamento.valorTotal || 0)
                );
                if (strong) strong.textContent = formatted;
              }
            }
            // collapse detail
            const detalhe = row.nextElementSibling;
            if (detalhe && detalhe.classList.contains("adm-contract-detail")) {
              detalhe.style.display = "none";
              syncToggleIcon(row, false);
            }
          } catch (e) {
            console.error(e);
          }

          if (window.Swal) {
            window.Swal.fire({ icon: "success", title: "Cobrado", text: "Venda registrada e serviço finalizado." });
          } else {
            await showAlert({ icon: "success", title: "Cobrado", text: "Venda registrada e serviço finalizado." });
          }
        } else {
          // show error if backend returned erro
          if (corpo && corpo.msg) {
            if (window.Swal) window.Swal.fire({ icon: "error", title: "Erro", text: corpo.msg });
            else await showAlert({ icon: "error", title: corpo.msg });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        cobrar.disabled = false;
      }
    });

    tabelaContratos.querySelectorAll("tr.js-contract-row").forEach((row) => syncToggleIcon(row, false));
  }

  // Dynamic product selector handling per contract row
  document.querySelectorAll(".js-contract-row").forEach((row) => {
    const detail = row.nextElementSibling;
    const addBtn = detail?.querySelector(".js-add-produto");
    const select = detail?.querySelector(".js-produto-select");
    const qty = detail?.querySelector(".js-produto-qty");
    const list = detail?.querySelector(".js-produtos-list");

    function renderList() {
      if (!list) return;
      list.innerHTML = "";
      const existing = row._produtos || [];
      existing.forEach((p, idx) => {
        const el = document.createElement("div");
        el.className = "js-produto-item";
        el.dataset.produtoId = p.produtoId;
        el.dataset.quantidade = p.quantidade;
        el.style = "display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--color-border);";
        el.innerHTML = `<div><strong>${p.nome}</strong> <small style='color:var(--color-text-muted)'>x ${p.quantidade}</small></div><div><button type='button' class='adm-btn-icon adm-btn-icon--danger btn-remove-prod' data-idx='${idx}' title='Remover'><i class='fa-solid fa-trash'></i></button></div>`;
        list.appendChild(el);
      });
      // update total display if present
      try {
        const detail = row.nextElementSibling;
        const totalEl = detail?.querySelector(".js-produtos-total");
        if (totalEl) {
          const total = (row._produtos || []).reduce((acc, p) => acc + (Number(p.preco || 0) * Number(p.quantidade || 0)), 0);
          totalEl.textContent = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total || 0);
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (addBtn && select && qty && list) {
      row._produtos = row._produtos || [];
      addBtn.addEventListener("click", function () {
        const pid = Number(select.value);
        const nome = select.options[select.selectedIndex]?.dataset?.nome || select.options[select.selectedIndex]?.text || "";
        const preco = Number(select.options[select.selectedIndex]?.dataset?.preco || 0);
        const quantidade = Math.max(1, Number(qty.value || 1));
        if (!pid || quantidade <= 0) return;

        // merge if exists
        const exists = row._produtos.find((p) => Number(p.produtoId) === pid);
        if (exists) {
          exists.quantidade = Number(exists.quantidade) + quantidade;
        } else {
          row._produtos.push({ produtoId: pid, nome, quantidade, preco });
        }
        renderList();
      });

      list.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-remove-prod");
        if (!btn) return;
        const idx = Number(btn.dataset.idx);
        if (Number.isFinite(idx)) {
          row._produtos.splice(idx, 1);
          renderList();
        }
      });
    }
  });

  if (filtroStatusContrato) {
    filtroStatusContrato.addEventListener("change", filtrarContratos);
    filtrarContratos();
  }
});
