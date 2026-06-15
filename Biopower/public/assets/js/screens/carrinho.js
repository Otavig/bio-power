document.addEventListener("DOMContentLoaded", function() {
    let listaCarrinho = [];
    let carrinho = localStorage.getItem("carrinho");

    if(carrinho) {
        listaCarrinho = JSON.parse(carrinho);
    }

    atualizarContador();

    let btns = document.querySelectorAll(".btn-cart, .btn-buy");

    for(let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", adicionarAoCarrinho);
    }

    let btnCarrinhoIcon = document.querySelector(".cart-button");
    if(btnCarrinhoIcon) {
        btnCarrinhoIcon.addEventListener("click", abrirCarrinho);
    }

    let offcanvasElement = document.getElementById('offcanvasCarrinho');
    if (offcanvasElement) {
        offcanvasElement.addEventListener("show.bs.offcanvas", abrirCarrinho);
    }

    let btnGravar = document.querySelector(".offcanvas-footer .btn-primary");
    if (btnGravar) {
        btnGravar.addEventListener("click", gravarPedido);
    }

    function excluirProdutoCarrinho() {
        let produtoIdExcluir = this.dataset.produto;
        listaCarrinho = listaCarrinho.filter(x => x.id != produtoIdExcluir);

        localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
        atualizarContador();
        abrirCarrinho();
    }

    // NOVA FUNÇÃO: Gerencia a soma e subtração das quantidades
    function alterarQuantidade() {
        let produtoId = this.dataset.produto;
        let acao = this.dataset.acao; // Pega "mais" ou "menos" do botão clicado

        for (let i = 0; i < listaCarrinho.length; i++) {
            if (listaCarrinho[i].id == produtoId) {
                if (acao === "mais") {
                    listaCarrinho[i].quantidade += 1;
                } else if (acao === "menos") {
                    // Impede que a quantidade fique zero ou negativa
                    if (listaCarrinho[i].quantidade > 1) {
                        listaCarrinho[i].quantidade -= 1;
                    }
                }
                break; // Achou o produto, pode parar o laço
            }
        }

        localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
        atualizarContador();
        abrirCarrinho(); // Reconstrói o HTML para refletir o novo cálculo
    }

    function atualizarContador() {
        let contador = document.querySelector("#contadorCarrinho");
        let totalItens = listaCarrinho.reduce((acc, item) => acc + (item.quantidade || 1), 0);
        if (contador) contador.innerHTML = totalItens;
    }

    function abrirCarrinho() {
        let modalCorpo = document.getElementById("modalCarrinhoCorpo");
        let textoValorTotal = document.querySelector(".offcanvas-footer h3");

        if(listaCarrinho.length > 0) {
            let htmlCorpo = "";
            let valorTotal = 0;

            for(let i = 0; i < listaCarrinho.length; i++) {
                let item = listaCarrinho[i];
                let precoNumerico = typeof item.preco === 'string' ? parseFloat(item.preco.replace(',', '.')) : item.preco;
                
                valorTotal += (item.quantidade * precoNumerico);

                htmlCorpo += `
                <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <img src="${item.imagem}" style="width: 60px; height: 60px; object-fit: cover;" class="me-3 rounded border" alt="${item.nome}">
                    
                    <div class="flex-grow-1">
                        <h6 class="product-name mb-1">${item.nome}</h6>
                        
                        <div class="d-flex align-items-center mb-1">
                            <button data-produto="${item.id}" data-acao="menos" class="btn btn-sm btn-outline-secondary btn-qtd px-2 py-0" style="line-height: 1;">-</button>
                            <span class="mx-2 fw-bold" style="font-size: 0.85rem;">${item.quantidade}</span>
                            <button data-produto="${item.id}" data-acao="mais" class="btn btn-sm btn-outline-secondary btn-qtd px-2 py-0" style="line-height: 1;">+</button>
                        </div>
                        
                        <small class="text-muted d-block">
                            R$ ${(precoNumerico * item.quantidade).toFixed(2).replace('.', ',')}
                        </small>
                    </div>

                    <button data-produto="${item.id}" class="btn btn-sm btn-outline-danger excluirCarrinho" aria-label="Remover item">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>`;
            }

            modalCorpo.innerHTML = htmlCorpo;
            if (textoValorTotal) textoValorTotal.innerHTML = `Valor total: R$ ${valorTotal.toFixed(2).replace('.', ',')}`;

            // Liga o evento de clique aos botões de Excluir
            let btnsExcluir = document.querySelectorAll(".excluirCarrinho");
            for(let i = 0; i < btnsExcluir.length; i++) {
                btnsExcluir[i].addEventListener("click", excluirProdutoCarrinho);
            }

            // NOVA LIGAÇÃO: Liga o evento de clique aos botões de Mais/Menos (+ e -)
            let btnsQtd = document.querySelectorAll(".btn-qtd");
            for(let i = 0; i < btnsQtd.length; i++) {
                btnsQtd[i].addEventListener("click", alterarQuantidade);
            }
        }
        else {
            modalCorpo.innerHTML = "<p class='text-muted'>Seus produtos aparecerão aqui...</p>";
            if (textoValorTotal) textoValorTotal.innerHTML = "Valor total: R$ 0,00";
        }
    }

    function adicionarAoCarrinho(event) {
        event.preventDefault();
        let card = this.closest('.product-card');
        
        let nome = card.dataset.name;
        let preco = parseFloat(card.dataset.price);
        let imagem = card.querySelector('img').src;
        let produtoId = card.dataset.id;

        if(produtoId) {
            let achou = false;
            for(let i = 0; i < listaCarrinho.length; i++) {
                if(produtoId == listaCarrinho[i].id) {
                    listaCarrinho[i].quantidade += 1;
                    achou = true;
                }
            }

            if(achou == false) {
                listaCarrinho.push({
                    id: produtoId,
                    nome: nome,
                    preco: preco,
                    imagem: imagem,
                    quantidade: 1
                });
            }

            localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
            atualizarContador();

            Swal.fire({
                title: 'Sucesso!',
                text: `${nome} foi adicionado ao carrinho.`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        }
        else {
            alert("ID do produto não encontrado no HTML!");
        }
    }
});