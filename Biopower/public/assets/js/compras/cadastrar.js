document.addEventListener('DOMContentLoaded', () => {
  // dados dos produtos vindos do servidor
  const productData = window.__productData || [];

  const state = { selected: [] };

  const dom = {
    pickerModal: document.getElementById('productPickerModal'),
    novaModal: document.getElementById('novaCompra'),
    resumoModal: document.getElementById('resumoCompraModal'),
    pickerList: document.getElementById('productPickerList'),
    selectedList: document.getElementById('novaCompraSelectedList'),
    resumoList: document.getElementById('resumoCompraList'),
    totalQuantidade: document.getElementById('totalQuantidade'),
    hiddenInput: document.getElementById('novaCompraSelectedProducts'),
    error: document.getElementById('novaCompraError'),
    resumoTotal: document.getElementById('resumoTotal'),
    abrirPickerBtn: document.getElementById('abrirPickerProdutos'),
    fecharProductPicker: document.getElementById('fecharProductPicker'),
    fecharNovaCompra: document.getElementById('fecharNovaCompra'),
    fecharResumoCompra: document.getElementById('fecharResumoCompra'),
    btnConfirmarCompra: document.getElementById('btnConfirmarCompra'),
    btnFinalizarCompra: document.getElementById('btnFinalizarCompra'),
    btnCancelarResumo: document.getElementById('btnCancelarResumo')
  };

  const showAlert = (options) => {
    if (window.Swal) return window.Swal.fire(options);
    console.log(options.title || options.text || '');
    return Promise.resolve();
  };

  function openModal(el) {
    if (el) el.style.display = 'flex';
  }

  function closeModal(el) {
    if (el) el.style.display = 'none';
  }

  // abrir/fechar modais
  if (dom.abrirPickerBtn) {
    dom.abrirPickerBtn.addEventListener('click', () => openModal(dom.pickerModal));
  }
  if (dom.fecharProductPicker) {
    dom.fecharProductPicker.addEventListener('click', () => closeModal(dom.pickerModal));
  }
  if (dom.fecharNovaCompra) {
    dom.fecharNovaCompra.addEventListener('click', () => closeModal(dom.novaModal));
  }
  if (dom.fecharResumoCompra) {
    dom.fecharResumoCompra.addEventListener('click', () => closeModal(dom.resumoModal));
  }

  // delegado: selecionar produto dentro do picker
  if (dom.pickerList) {
    dom.pickerList.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-select-product');
      if (!btn) return;
      const idx = Number(btn.dataset.index);
      const prod = productData[idx];
      if (!prod) return;
      addProduct(prod);
    });
  }

  function addProduct(prod) {
    const existing = state.selected.find(s => s.id === prod.id);
    if (existing) {
      if (existing.quantidade < prod.estoque) {
        existing.quantidade++;
      }
    } else {
      state.selected.push({ ...prod, quantidade: 1 });
    }
    renderSelected();
  }

  function renderSelected() {
    if (!dom.selectedList) return;
    if (state.selected.length === 0) {
      dom.selectedList.innerHTML = '<p class="empty-state">Nenhum produto selecionado.</p>';
    } else {
      dom.selectedList.innerHTML = '';
      state.selected.forEach((p, i) => {
        const article = document.createElement('article');
        article.className = 'selected-item';
        article.innerHTML = `
          <div class="selected-product-summary">
            <div>
              <strong>${escapeHtml(p.nome)}</strong>
              <span>${escapeHtml(p.categoria)} • ${escapeHtml(p.marca)}</span>
            </div>
            <div class="selected-item-details">
              <span>Estoque: ${p.estoque}</span>
            </div>
          </div>
          <div class="selected-product-actions">
            <span class="product-price">${escapeHtml(String(p.preco))}</span>
            <div>
              <input type="number" min="1" max="999" value="${p.quantidade}" data-index="${i}" class="item-qty" />
              <button type="button" class="btn-remove-product" data-index="${i}">Remover</button>
            </div>
          </div>
        `;
        dom.selectedList.appendChild(article);
      });
    }
    updateTotalsAndHidden();
  }

  // eventos dentro da lista de selecionados (ajustar quantidade / remover)
  if (dom.selectedList) {
    dom.selectedList.addEventListener('input', (e) => {
      const input = e.target.closest('.item-qty');
      if (!input) return;
      const i = Number(input.dataset.index);
      if (!Number.isFinite(i) || !state.selected[i]) return;
      const value = Math.max(1, Math.min(Number(input.value) || 1, 999));
      state.selected[i].quantidade = value;
      input.value = value;
      updateTotalsAndHidden();
    });

    dom.selectedList.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-remove-product');
      if (!btn) return;
      const i = Number(btn.dataset.index);
      if (Number.isFinite(i)) {
        state.selected.splice(i, 1);
        renderSelected();
      }
    });
  }

  function updateTotalsAndHidden() {
    const total = state.selected.reduce((s, p) => s + (Number(p.quantidade) || 0), 0);
    if (dom.totalQuantidade) dom.totalQuantidade.value = total;
    if (dom.hiddenInput) dom.hiddenInput.value = JSON.stringify(state.selected);
    if (dom.error) dom.error.textContent = '';
  }

  // abrir resumo e preencher com os itens selecionados
  if (dom.btnConfirmarCompra) {
    dom.btnConfirmarCompra.addEventListener('click', () => {
      if (state.selected.length === 0) {
        if (dom.error) dom.error.textContent = 'Selecione ao menos um produto.';
        return;
      }
      if (dom.resumoList) {
        dom.resumoList.innerHTML = '';
        state.selected.forEach(p => {
          const valorTotal = (Number(p.preco) || 0) * (Number(p.quantidade) || 0);
          const div = document.createElement('article');
          div.className = 'selected-item';
          div.innerHTML = `
            <div class="selected-product-summary">
              <div>
                <strong>${escapeHtml(p.nome)}</strong>
                <span>${escapeHtml(p.categoria)} • ${escapeHtml(p.marca)}</span>
              </div>
              <div class="selected-item-details">
                <span>Quantidade: ${p.quantidade}</span>
                <span>Valor Total: R$ ${escapeHtml(String(valorTotal.toFixed(2)))}</span>
              </div>
            </div>
          `;
          dom.resumoList.appendChild(div);
        });
      }
      if (dom.resumoTotal) {
        dom.resumoTotal.textContent = (dom.totalQuantidade && dom.totalQuantidade.value) || '0';
      }
      openModal(dom.resumoModal);
    });
  }

  // botao editar
  if (dom.btnCancelarResumo) {
    dom.btnCancelarResumo.addEventListener('click', () => {
      closeModal(dom.resumoModal);
      openModal(dom.novaModal);
    });
  }

  // finalizar compra
  if (dom.btnFinalizarCompra) {
    dom.btnFinalizarCompra.addEventListener('click', async (e) => {
      e.preventDefault();

      if (state.selected.length === 0) {
        await showAlert({
          icon: 'warning',
          title: 'Selecione ao menos um produto.'
        });
        return;
      }

      const btn = dom.btnFinalizarCompra;
      btn.disabled = true;
      const originalText = btn.textContent;
      btn.textContent = 'Finalizando...';

      try {
        const res = await fetch('/compras', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: state.selected })
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || 'Erro ao finalizar pedido');
        }

        await showAlert({
          icon: 'success',
          title: 'Pedido finalizado com sucesso!'
        });

        closeModal(dom.resumoModal);
        closeModal(dom.pickerModal);
        closeModal(dom.novaModal);

        state.selected = [];
        renderSelected();

        window.location.reload();
      } catch (err) {
        await showAlert({
          icon: 'error',
          title: 'Erro ao finalizar pedido',
          text: err.message || 'Tente novamente'
        });
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  }
M
  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  renderSelected();
});
