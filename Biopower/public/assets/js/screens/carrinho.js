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
    offcanvasElement.addEventListener("show.bs.offcanvas", abrirCarrinho);

    document.querySelector(".offcanvas-footer .btn-primary").addEventListener("click", gravarPedido);

    function gravarPedido() {
        if(listaCarrinho.length > 0) {
            fetch("/pedido/gravar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(listaCarrinho)
            })
            .then(function(resposta) {
                return resposta.json();
            })
            .then(function(corpo) {
                if(corpo.ok) {
                    Swal.fire('Sucesso!', corpo.msg || 'Pedido realizado com sucesso!', 'success');
                    localStorage.removeItem("carrinho");
                    listaCarrinho = [];
                    atualizarContador();
                    abrirCarrinho();
                } else {
                    Swal.fire('Atenção', corpo.msg || 'Erro ao processar pedido.', 'warning');
                }
            })
            .catch(erro => console.error("Erro ao gravar:", erro));
        }
        else {
            Swal.fire('Vazio!', 'Nenhum produto adicionado ao carrinho!', 'info');
        }
    }

    function excluirProdutoCarrinho() {
        let produtoIdExcluir = this.dataset.produto;
        listaCarrinho = listaCarrinho.filter(x => x.id != produtoIdExcluir);

        localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
        atualizarContador();
        abrirCarrinho();
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
                        <h6 class="mb-0 text-dark" style="font-size: 0.9rem;">${item.nome}</h6>
                        <small class="text-muted">
                            R$ ${precoNumerico.toFixed(2).replace('.', ',')} x ${item.quantidade}
                        </small>
                    </div>
                    <button data-produto="${item.id}" class="btn btn-sm btn-outline-danger excluirCarrinho" aria-label="Remover item">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>`;
            }

            modalCorpo.innerHTML = htmlCorpo;
            textoValorTotal.innerHTML = `Valor total: R$ ${valorTotal.toFixed(2).replace('.', ',')}`;

            let btnsExcluir = document.querySelectorAll(".excluirCarrinho");
            for(let i = 0; i < btnsExcluir.length; i++) {
                btnsExcluir[i].addEventListener("click", excluirProdutoCarrinho);
            }
        }
        else {
            modalCorpo.innerHTML = "<p>Seus produtos aparecerão aqui...</p>";
            textoValorTotal.innerHTML = "Valor total: R$ 0,00";
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