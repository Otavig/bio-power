const tabela = document.getElementById("couponTableBody");
let cuponsGlobais = []; // Guarda os cupons em memória para facilitar a edição

function formatarData(data) {
  if (!data) return "-";
  return new Date(data).toLocaleDateString("pt-BR");
}

function formatarDataParaInput(data) {
  if (!data) return "";
  const d = new Date(data);
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function configurarAplicacaoAutomatica(form) {
  const check = form.querySelector('[name="coupon_auto_apply"]');
  const grupoDias = form.querySelector(".coupon-auto-days");
  const selectDias = form.querySelector('[name="coupon_expiration_days"]');
  if (!check || !grupoDias || !selectDias) return;

  const atualizarVisibilidade = () => {
    grupoDias.hidden = !check.checked;
    selectDias.disabled = !check.checked;
  };

  if (!check.dataset.autoApplyReady) {
    check.addEventListener("change", atualizarVisibilidade);
    check.dataset.autoApplyReady = "1";
  }
  atualizarVisibilidade();
}

function textoAplicacaoAutomatica(c) {
  const automatico = Number(c.pro_automatico || 0) === 1;
  if (!automatico) return "Manual";
  return `Automático (${c.pro_dias_vencimento || 30} dias)`;
}

function linhaCupom(c) {
  const statusAtual = c.pro_status !== undefined && c.pro_status !== null ? Number(c.pro_status) : 1;
  const desativado = statusAtual === 0;

  const expirado =
    c.pro_data_fim &&
    new Date(c.pro_data_fim).setHours(23, 59, 59, 999) < Date.now();

  let badgeTexto = "Ativo";
  let badgeClasse = "adm-badge--success";

  if (desativado) {
    badgeTexto = "Inativo";
    badgeClasse = "adm-badge--error"; 
  } else if (expirado) {
    badgeTexto = "Expirado";
    badgeClasse = "adm-badge--error";
  }

  return `
    <tr data-id="${c.pro_id}" style="${desativado ? 'opacity: 0.55;' : ''}">
      <td>
        <code class="adm-code">${c.pro_nome || ""}</code>
      </td>
      <td>${c.pro_descricao || ""}</td>
      <td>${c.pro_percentual || 0}%</td>
      <td>${formatarData(c.pro_data_fim)}</td>
      <td>${textoAplicacaoAutomatica(c)}</td>
      <td>
        <span class="adm-badge ${badgeClasse}">
          ${badgeTexto}
        </span>
      </td>
      <td>
        <div class="adm-actions">
          <button class="adm-btn-icon btn-editar-cupom" title="${desativado ? 'Reativar / Editar' : 'Editar'}">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="adm-btn-icon adm-btn-icon--danger btn-excluir-cupom" ${desativado ? 'style="display:none;"' : ''} title="Desativar">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

async function carregarCupons() {
  try {
    const res = await fetch("/dashboard/cupons");
    const json = await res.json();

    console.log("Dados recebidos do back-end:", json);

    tabela.innerHTML = "";
    
    cuponsGlobais = json.dados || json.cupons || (Array.isArray(json) ? json : []);

    cuponsGlobais.forEach((c) => {
      tabela.insertAdjacentHTML("beforeend", linhaCupom(c));
    });
  } catch (e) {
    console.error("Erro ao carregar cupons:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarCupons();

  // -------------------------------------------------------------
  // EVENTO: CRIAR CUPOM (POST)
  // -------------------------------------------------------------
  const formCreate = document.getElementById("formCreateCoupon");
  configurarAplicacaoAutomatica(formCreate);
  formCreate.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(formCreate);
    const automatico = fd.get("coupon_auto_apply") === "1";

    const dados = {
      pro_nome: fd.get("coupon_code"),
      pro_descricao: fd.get("coupon_description"),
      pro_percentual: fd.get("coupon_discount"),
      pro_data_inicio: fd.get("coupon_start_date"),
      pro_data_fim: fd.get("coupon_end_date"),
      pro_automatico: automatico ? 1 : 0,
      pro_dias_vencimento: automatico ? Number(fd.get("coupon_expiration_days")) : null,
    };

    try {
      const res = await fetch("/dashboard/cupons/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const json = await res.json();

      formCreate.reset();
      configurarAplicacaoAutomatica(formCreate);
      document.getElementById("dialog-novo-cupom").classList.remove("adm-dialog--open");

      if (json.ok) {
        Swal.fire("Sucesso", json.msg, "success");
        carregarCupons();
      } else {
        Swal.fire("Aviso", json.msg, "error");
      }
    } catch (err) {
      console.error(err);
      // Garante o fechamento mesmo se a requisição estourar um erro de rede
      document.getElementById("dialog-novo-cupom").classList.remove("adm-dialog--open");
      Swal.fire("Erro", "Erro na comunicação com servidor", "error");
    }
  });

  // -------------------------------------------------------------
  // EVENTO: ATUALIZAR CUPOM (PUT)
  // -------------------------------------------------------------
  const formEdit = document.getElementById("formEditCoupon");
  configurarAplicacaoAutomatica(formEdit);
  formEdit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(formEdit);
    const id = fd.get("coupon_id");
    const automatico = fd.get("coupon_auto_apply") === "1";

    const dados = {
      pro_nome: fd.get("coupon_code"),
      pro_descricao: fd.get("coupon_description"),
      pro_percentual: fd.get("coupon_discount"),
      pro_data_inicio: fd.get("coupon_start_date"),
      pro_data_fim: fd.get("coupon_end_date"),
      pro_status: Number(fd.get("coupon_status")), // Envia o status atualizado do select (0 ou 1)
      pro_automatico: automatico ? 1 : 0,
      pro_dias_vencimento: automatico ? Number(fd.get("coupon_expiration_days")) : null,
    };

    try {
      const res = await fetch(`/dashboard/cupons/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const json = await res.json();

      document.getElementById("dialog-editar-cupom").classList.remove("adm-dialog--open");

      if (json.ok) {
        Swal.fire("Sucesso", json.msg, "success");
        carregarCupons(); // Força a tabela a atualizar na tela na mesma hora
      } else {
        Swal.fire("Aviso", json.msg, "error");
      }
    } catch (err) {
      console.error(err);
      document.getElementById("dialog-editar-cupom").classList.remove("adm-dialog--open");
      Swal.fire("Erro", "Erro na comunicação com servidor", "error");
    }
  });

  tabela.addEventListener("click", async (e) => {
    const botaoEditar = e.target.closest(".btn-editar-cupom");
    const botaoExcluir = e.target.closest(".btn-excluir-cupom");
    const linha = e.target.closest("tr");
    if (!linha) return;
    
    const idCupom = linha.dataset.id;

    if (botaoEditar) {
      const cupom = cuponsGlobais.find((c) => String(c.pro_id) === String(idCupom));
      if (!cupom) return;

      formEdit.querySelector('[name="coupon_id"]').value = cupom.pro_id;
      formEdit.querySelector('[name="coupon_code"]').value = cupom.pro_nome || "";
      formEdit.querySelector('[name="coupon_description"]').value = cupom.pro_descricao || "";
      formEdit.querySelector('[name="coupon_discount"]').value = cupom.pro_percentual || 0;
      formEdit.querySelector('[name="coupon_start_date"]').value = formatarDataParaInput(cupom.pro_data_inicio);
      formEdit.querySelector('[name="coupon_end_date"]').value = formatarDataParaInput(cupom.pro_data_fim);
      formEdit.querySelector('[name="coupon_auto_apply"]').checked = Number(cupom.pro_automatico || 0) === 1;
      formEdit.querySelector('[name="coupon_expiration_days"]').value = cupom.pro_dias_vencimento || 30;
      formEdit.querySelector('[name="coupon_auto_apply"]').dispatchEvent(new Event("change"));
      
      const statusElement = formEdit.querySelector('[name="coupon_status"]');
      if (statusElement) {
         statusElement.value = cupom.pro_status !== undefined && cupom.pro_status !== null ? cupom.pro_status : 1;
      }

      document.getElementById("dialog-editar-cupom").classList.add("adm-dialog--open");
    }

    if (botaoExcluir) {
      const resultadoSwal = await Swal.fire({
        title: "Tem certeza?",
        text: "Esta ação desativará o uso deste cupom!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sim, desativar!",
        cancelButtonText: "Cancelar"
      });

      if (resultadoSwal.isConfirmed) {
        try {
          const res = await fetch(`/dashboard/cupons/delete/${idCupom}`, {
            method: "DELETE",
          });
          const json = await res.json();

          if (json.ok) {
            Swal.fire("Desativado!", json.msg, "success");
            carregarCupons(); 
          } else {
            Swal.fire("Erro", json.msg, "error");
          }
        } catch (err) {
          console.error(err);
          Swal.fire("Erro", "Erro ao tentar se comunicar com o servidor.", "error");
        }
      }
    }
  });
});
