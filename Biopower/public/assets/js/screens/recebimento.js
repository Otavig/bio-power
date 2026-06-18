let metodoAtual = 'credito';

function formatarMoedaBR(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function calcularJurosParcelamento(parcelas) {
    if (parcelas >= 10) return 0.05;
    if (parcelas >= 7) return 0.025;
    return 0;
}

function obterTotalCheckout() {
    if (typeof window.checkoutCalcularTotal === 'function') {
        return window.checkoutCalcularTotal();
    }

    try {
        const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
        return Array.isArray(carrinho)
            ? carrinho.reduce((acc, item) => {
                const preco = typeof item.preco === 'string'
                    ? parseFloat(item.preco.replace(',', '.'))
                    : Number(item.preco || 0);
                return acc + preco * Number(item.quantidade || 1);
            }, 0)
            : 0;
    } catch {
        return 0;
    }
}

function atualizarTotalVisual(totalCompra = obterTotalCheckout()) {
    const totalValor = document.getElementById('totalValor');
    const btnValor = document.getElementById('btnValor');
    const totalFormatado = formatarMoedaBR(totalCompra);
    const valorSemPrefixo = totalFormatado.replace(/^R\$\s?/, '');

    if (totalValor) totalValor.innerHTML = `R$ <span>${valorSemPrefixo}</span>`;
    if (btnValor) btnValor.textContent = totalFormatado;
}

window.atualizarParcelamento = function atualizarParcelamento(totalCompra = obterTotalCheckout()) {
    const selectParcelas = document.getElementById('parcelas');
    if (!selectParcelas) return;

    const valorBase = Number(totalCompra || 0);
    const valorSelecionado = selectParcelas.value;

    selectParcelas.innerHTML = Array.from({ length: 12 }, (_, index) => {
        const parcelas = index + 1;
        const juros = calcularJurosParcelamento(parcelas);
        const totalComJuros = valorBase * (1 + juros);
        const valorParcela = totalComJuros / parcelas;
        const textoJuros = juros > 0 ? `com juros (${(juros * 100).toLocaleString('pt-BR')}%)` : 'sem juros';

        return `<option value="${parcelas}" data-total="${totalComJuros.toFixed(2)}">${parcelas}x de ${formatarMoedaBR(valorParcela)} - ${textoJuros}</option>`;
    }).join('');

    if ([...selectParcelas.options].some((option) => option.value === valorSelecionado)) {
        selectParcelas.value = valorSelecionado;
    }
};

  function selecionarMetodo(el) {
    document.querySelectorAll('.metodo-btn').forEach(b => b.classList.remove('ativo'));
    el.classList.add('ativo');
    metodoAtual = el.dataset.metodo;

    document.querySelectorAll('.painel').forEach(p => p.classList.remove('visivel'));
    document.getElementById('painel-' + metodoAtual).classList.add('visivel');

    // Ajustes de total / sublabel
    const pixDesc = document.getElementById('linhaDescPix');
    const subLabel = document.getElementById('subLabel');
    const totalCheckout = obterTotalCheckout();

    if (metodoAtual === 'pix') {
      if (pixDesc) pixDesc.style.display = 'flex';
      atualizarTotalVisual(totalCheckout);
      if (subLabel) subLabel.textContent = 'pagamento instantâneo';
      gerarQR();
      iniciarTimer();
    } else {
      if (pixDesc) pixDesc.style.display = 'none';
      atualizarTotalVisual(totalCheckout);
      if (subLabel) subLabel.textContent = metodoAtual === 'credito' ? 'parcelamento em até 12x' : 'pagamento à vista';
      if (metodoAtual === 'credito') window.atualizarParcelamento(totalCheckout);
    }

    validarFormulario();
  }

function normalizarCpf(cpf) {
    return cpf.replace(/\D/g, '').slice(0, 11);
}

function mascararCpf(input) {
    const cpf = normalizarCpf(input.value);
    input.value = cpf
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function normalizarCep(cep) {
    return String(cep || '').replace(/\D/g, '').slice(0, 8);
}

function mascararCep(input) {
    const cep = normalizarCep(input.value);
    input.value = cep.replace(/(\d{5})(\d)/, '$1-$2');
}

function carrinhoTemItens() {
    try {
        const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
        return Array.isArray(carrinho) && carrinho.length > 0;
    } catch {
        return false;
    }
}

window.getDadosPagamento = function() {
    return {
        nome: document.getElementById('inputNome').value.trim(),
        cpf: normalizarCpf(document.getElementById('inputCpf').value),
        email: document.getElementById('inputEmail').value.trim()
    };
};

window.getMetodoPagamento = function() {
    return metodoAtual;
};

window.getDadosEntrega = function() {
    return {
        cep: normalizarCep(document.getElementById('inputCep')?.value),
        endereco: document.getElementById('inputEndereco')?.value.trim() || '',
        numero: document.getElementById('inputNumero')?.value.trim() || '',
        complemento: document.getElementById('inputComplemento')?.value.trim() || '',
        bairro: document.getElementById('inputBairro')?.value.trim() || '',
        cidade: document.getElementById('inputCidade')?.value.trim() || '',
        uf: (document.getElementById('inputUf')?.value || '').trim().toUpperCase()
    };
};

function validarEntrega() {
    const entrega = window.getDadosEntrega();
    return entrega.cep.length === 8
        && entrega.endereco.length > 2
        && entrega.bairro.length > 1
        && entrega.cidade.length > 1
        && entrega.uf.length === 2;
}

let cepStatusTimer = null;

function atualizarCepStatus(mensagem = '', tipo = '') {
    const status = document.getElementById('cepStatus');
    if (!status) return;

    if (cepStatusTimer) clearTimeout(cepStatusTimer);

    status.textContent = mensagem;
    status.classList.remove('is-hidden');
    status.classList.toggle('is-error', tipo === 'error');
    status.classList.toggle('is-ok', tipo === 'ok');

    if (mensagem) {
        cepStatusTimer = setTimeout(() => {
            status.classList.add('is-hidden');
            cepStatusTimer = setTimeout(() => {
                status.textContent = '';
                status.classList.remove('is-error', 'is-ok', 'is-hidden');
            }, 250);
        }, 3500);
    }
}

async function buscarCep() {
    const cep = normalizarCep(document.getElementById('inputCep')?.value);

    if (cep.length !== 8) {
        atualizarCepStatus('Informe um CEP valido.', 'error');
        validarFormulario();
        return;
    }

    atualizarCepStatus('Buscando CEP...');

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        if (!resposta.ok || dados.erro) {
            atualizarCepStatus('CEP nao encontrado.', 'error');
            validarFormulario();
            return;
        }

        document.getElementById('inputEndereco').value = dados.logradouro || '';
        document.getElementById('inputBairro').value = dados.bairro || '';
        document.getElementById('inputCidade').value = dados.localidade || '';
        document.getElementById('inputUf').value = dados.uf || '';

        atualizarCepStatus('Endereco preenchido pelo ViaCEP.', 'ok');
        validarFormulario();
    } catch (erro) {
        console.error('Erro ao buscar CEP:', erro);
        atualizarCepStatus('Nao foi possivel buscar o CEP agora.', 'error');
        validarFormulario();
    }
}

window.validarFormulario = function validarFormulario() {
    const btnPagar = document.getElementById('btnPagar');
    
    const nome = document.getElementById('inputNome').value;
    const cpf = normalizarCpf(document.getElementById('inputCpf').value);
    const email = document.getElementById('inputEmail').value;
    
    const cpfValido = typeof validCPF === 'function'
        ? validCPF(cpf)
        : cpf.length === 11;
    let camposValidos = (nome.length > 3 && cpfValido && email.includes('@'));

    if (metodoAtual === 'credito') {
        const num = document.getElementById('numCartao').value;
        const nomeCard = document.getElementById('nomeCartao').value;
        const val = document.getElementById('validadeCartao').value;
        const cvv = document.getElementById('cvvCartao').value;
        
        if (!num || !nomeCard || !val || !cvv) camposValidos = false;
    } 
    else if (metodoAtual === 'debito') {
        const numDeb = document.getElementById('numDeb').value;
        const nomeDeb = document.getElementById('nomeDeb').value;
        const valDeb = document.getElementById('valDeb').value;
        
        if (!numDeb || !nomeDeb || !valDeb) camposValidos = false;
    }

    const estoqueValido = typeof window.checkoutEstoqueValido === 'function'
        ? window.checkoutEstoqueValido()
        : true;

    btnPagar.disabled = !camposValidos || !validarEntrega() || !carrinhoTemItens() || !estoqueValido;
}

// Inicializa o botão como desativado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnPagar').disabled = true;
    const checkoutTabsCard = document.querySelector('.checkout-tabs-card');
    document.querySelectorAll('.checkout-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const destino = tab.dataset.tab;

        document.querySelectorAll('.checkout-tab').forEach((item) => {
          item.classList.toggle('active', item === tab);
        });

        document.querySelectorAll('.checkout-tab-panel').forEach((panel) => {
          panel.classList.toggle('active', panel.dataset.tabPanel === destino);
        });

        if (checkoutTabsCard) {
          checkoutTabsCard.classList.toggle('checkout-tabs-card--pagamento', destino === 'pagamento');
        }
      });
    });

    [
      'numCartao',
      'nomeCartao',
      'validadeCartao',
      'cvvCartao',
      'parcelas',
      'numDeb',
      'nomeDeb',
      'valDeb',
      'inputCep',
      'inputEndereco',
      'inputNumero',
      'inputComplemento',
      'inputBairro',
      'inputCidade',
      'inputUf'
    ].forEach((id) => {
      const input = document.getElementById(id);
      if (input) input.addEventListener('input', validarFormulario);
    });

    const btnBuscarCep = document.getElementById('btnBuscarCep');
    if (btnBuscarCep) btnBuscarCep.addEventListener('click', buscarCep);

    const inputCep = document.getElementById('inputCep');
    if (inputCep) {
      inputCep.addEventListener('blur', () => {
        if (normalizarCep(inputCep.value).length === 8) buscarCep();
      });
    }

    window.atualizarParcelamento(obterTotalCheckout());
    atualizarTotalVisual(obterTotalCheckout());
});

  /* ---- QR CODE ---- */
  let qrGerado = false;
  function gerarQR() {
    if (qrGerado) return;
    const canvas = document.getElementById('qrCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 174, 174);

    // Gera QR manualmente como bloco de pixels aleatório (simulado, mas funcional visualmente)
    // Usa qrcodejs se disponível
    try {
      const div = document.createElement('div');
      new QRCode(div, {
        text: document.getElementById('chavePix').textContent,
        width: 174, height: 174,
        colorDark: '#000', colorLight: '#fff',
        correctLevel: QRCode.CorrectLevel.M
      });
      setTimeout(() => {
        const img = div.querySelector('img') || div.querySelector('canvas');
        if (img) {
          const tmp = new Image();
          tmp.onload = () => { ctx.drawImage(tmp, 0, 0, 174, 174); };
          tmp.src = img.src || img.toDataURL();
        }
      }, 200);
    } catch(e) {
      // Fallback: desenha um padrão simulado
      desenharQRFallback(ctx);
    }
    qrGerado = true;
  }

  function desenharQRFallback(ctx) {
    const size = 174, mod = 7;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000';
    const seed = 42;
    const pattern = [];
    for (let i = 0; i < mod * mod; i++) {
      pattern.push(((i * 2654435761) ^ seed) % 3 !== 0);
    }
    // Posicionamento
    const cell = size / mod;
    // Quadros de posição
    [[0,0],[0,5],[5,0]].forEach(([r,c]) => {
      ctx.fillRect(c*cell, r*cell, cell*2, cell*2);
    });
    for (let r = 0; r < mod; r++) {
      for (let c = 0; c < mod; c++) {
        if (pattern[r * mod + c]) {
          ctx.fillRect(c * cell + 1, r * cell + 1, cell - 2, cell - 2);
        }
      }
    }
  }

  /* ---- TIMER PIX ---- */
  let timerInterval = null;
  function iniciarTimer() {
    if (timerInterval) return;
    let segundos = 14 * 60 + 59;
    const el = document.getElementById('countdown');
    timerInterval = setInterval(() => {
      if (segundos <= 0) { clearInterval(timerInterval); el.textContent = '00:00'; return; }
      segundos--;
      const m = Math.floor(segundos / 60).toString().padStart(2, '0');
      const s = (segundos % 60).toString().padStart(2, '0');
      el.textContent = m + ':' + s;
    }, 1000);
  }

  /* ---- COPIAR PIX ---- */
  function copiarPix() {
    const chave = document.getElementById('chavePix').textContent;
    navigator.clipboard.writeText(chave).catch(() => {});
    const icon = document.getElementById('iconCopy');
    icon.className = 'fas fa-check';
    setTimeout(() => { icon.className = 'fas fa-copy'; }, 2000);
  }

  /* ---- FORMATAÇÃO CARTÃO CRÉDITO ---- */
  document.getElementById('numCartao').addEventListener('input', function() {
    fmtNum(this);
    document.getElementById('prevNum').innerHTML = (this.value || '•••• &nbsp;&nbsp;•••• &nbsp;&nbsp;•••• &nbsp;&nbsp;••••').replace(/ /g, ' &nbsp;&nbsp;');
    detectarBandeira(this.value);
  });
  document.getElementById('nomeCartao').addEventListener('input', function() {
    document.getElementById('prevNome').textContent = this.value.toUpperCase() || 'NOME DO TITULAR';
  });
  document.getElementById('validadeCartao').addEventListener('input', function() {
    fmtVal(this);
    document.getElementById('prevVal').textContent = this.value || 'MM/AA';
  });

  function fmtNum(el) {
    let v = el.value.replace(/\D/g, '').substring(0, 16);
    el.value = v.replace(/(.{4})/g, '$1 ').trim();
  }
  function fmtVal(el) {
    let v = el.value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    el.value = v;
  }
  function atualizarDebito() {
    const v = document.getElementById('numDeb').value;
    document.getElementById('prevNumDeb').innerHTML = (v || '•••• &nbsp;&nbsp;•••• &nbsp;&nbsp;•••• &nbsp;&nbsp;••••').replace(/ /g, ' &nbsp;&nbsp;');
  }

  function detectarBandeira(num) {
    const n = num.replace(/\D/g, '');
    let cls = 'fab fa-credit-card';
    if (/^4/.test(n)) cls = 'fab fa-cc-visa';
    else if (/^5[1-5]/.test(n)) cls = 'fab fa-cc-mastercard';
    else if (/^3[47]/.test(n)) cls = 'fab fa-cc-amex';
    document.getElementById('prevBandeira').className = cls;
  }

  /* ---- BOTÃO PAGAR ---- */
  async function pagar() {
    const btn = document.getElementById('btnPagar');
    const txt = document.getElementById('btnTexto');

    if (typeof window.checkoutEstoqueValido === 'function' && !window.checkoutEstoqueValido()) {
      txt.textContent = 'Estoque insuficiente';
      btn.disabled = true;
      return;
    }

    btn.disabled = true;

    const pedidoGravado = typeof window.gravarPedido === 'function'
      ? await window.gravarPedido()
      : false;

    if (!pedidoGravado) {
      btn.disabled = false;
      txt.textContent = 'Confirmar pagamento';
      return;
    }

    if (metodoAtual === 'pix') {
      txt.textContent = 'Aguardando confirmação Pix...';
      return;
    }

    txt.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:6px;"></i> Processando...';
    setTimeout(() => {
      btn.style.background = '#22c55e';
      txt.innerHTML = '<i class="fas fa-check-circle" style="margin-right:6px;"></i> Pagamento aprovado!';
      const btnValor = document.getElementById('btnValor');
      if (btnValor) btnValor.textContent = '';
    }, 800);
  }

