document.addEventListener("DOMContentLoaded", function() {

    let listaCarrinho = [];

    let carrinho = localStorage.getItem("carrinho");

    if(carrinho) {
        listaCarrinho = JSON.parse(carrinho);
    }

    atualizarContador();
    calcularValorTotal();

    //lê todos os botões da tela
    let btns = document.querySelectorAll(".addCarrinho");

    for(let i = 0; i < btns.length; i++) {
        //percorre a lista de botões de adiciona o evento de click para chamar a nossa função
        btns[i].addEventListener("click", adicionarAoCarrinho);
    }


    document.addEventListener("show.bs.modal", abrirCarrinho);

    document.querySelector("#btnConfirmar").addEventListener("click", gravarPedido);

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
                //apenas para observarmos a resposta do backend
                console.log(corpo);
                alert(corpo.msg);
                //se deu certo, reseta o carrinho
                if(corpo.ok) {
                    localStorage.clear("carrinho");
                    listaCarrinho = [];
                    abrirCarrinho();
                    atualizarContador();
                    calcularValorTotal();
                }
            })
        }
        else {
            alert("Nenhum produto adicionado ao carrinho!");
        }
    }

    function excluirProdutoCarrinho() {
        let produtoIdExcluir = this.dataset.produto;
        //utiliza a expressão do filter para filtrar os produtos e gerar uma nova lista
        listaCarrinho = listaCarrinho.filter(x => x.id != produtoIdExcluir);

        //reescreve a lista filtrada no localStorage
        localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
        atualizarContador();
        calcularValorTotal();
        abrirCarrinho();
    }

    function calcularValorTotal() {

        let valorTotal = 0;

        //percorre a lista fazendo a somatória
        for(let i =0; i<listaCarrinho.length; i++) {
            valorTotal += listaCarrinho[i].quantidade * listaCarrinho[i].preco;
        }

        document.querySelector("#valorTotalPedido").innerHTML = "Valor total do pedido: R$ " + valorTotal.toFixed(2);
    }

    function atualizarContador() {
        let contador = document.querySelector("#contadorCarrinho");
        contador.innerHTML = listaCarrinho.length;
    }

    function abrirCarrinho() {
        //quando o carrinho for aberto vamos montar o html para exibir os produtos que estão no localStorage
        if(listaCarrinho.length > 0) {
            //montar o html;
            //parte estática
            let html = `<table class="table">
                            <thead>
                                <tr>
                                    <th>Imagem</th>
                                    <th>Nome</th>
                                    <th>Valor Unitário</th>
                                    <th>Quantidade</th>
                                    <th>Valor Total</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {corpo}
                            </tbody>
                        </table>`;

            //gerar o corpo da tabela
            let corpo = "";
            for(let i = 0; i<listaCarrinho.length; i++) {
                corpo += `<tr>
                            <td><img width="50" src="${listaCarrinho[i].imagem}" /></td>
                            <td>${listaCarrinho[i].nome}</td>
                            <td>${listaCarrinho[i].preco}</td>
                            <td>${listaCarrinho[i].quantidade}</td>
                            <td>${listaCarrinho[i].quantidade * listaCarrinho[i].preco}</td>
                            <td><button data-produto="${listaCarrinho[i].id}" class="btn btn-danger excluirCarrinho"><i class="fas fa-trash"></i></button></td>
                        </tr>`;
            }

            //insere o corpo na variavel html
            html = html.replace("{corpo}", corpo);
            //inserir o html completo na arvore DOM
            document.getElementById("modalCarrinhoCorpo").innerHTML = html;

            //inicializa os botões de exclusão do carrinho
            let btnsExcluirCarrinho = document.querySelectorAll(".excluirCarrinho");

            for(let i =0; i<btnsExcluirCarrinho.length;i++) {
                btnsExcluirCarrinho[i].addEventListener("click",excluirProdutoCarrinho)
            }
        }
        else {
            //exibir mensagem de carrinho vazio!
            document.getElementById("modalCarrinhoCorpo").innerHTML = "Carrinho vazio!";
        }
    }

    function adicionarAoCarrinho() {
        //lê o data attribute;
        let produtoId = this.dataset.produto;
        let that = this;
        if(produtoId) {
            //verifica se o produto já existe no carrinho;
            let achou = false;
            for(let i = 0; i<listaCarrinho.length; i++) {
                if(produtoId == listaCarrinho[i].id) {
                    listaCarrinho[i].quantidade += 1;
                    achou = true;
                }
            }
            //faz uma chamada para o backend, trazendo todos os dados do produto.
            let p = null;
            if(achou == false) {
                p = fetch("/produto/obter/" + produtoId)
                .then(function(response) {
                    return response.json();
                })
                .then(function(corpo) {
                    //inicializa o produto com quantidade 1
                    corpo.produto.quantidade = 1;
                    listaCarrinho.push(corpo.produto);
                })
            }
            //espera o array de promessas finalizar [p]
            //finalizou, executa função de callback
            Promise.all([p])
            .then(function() {
                //sei que todas as promessas no array acima foram finalizadas.
                localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
                that.innerHTML = "<i class='fas fa-check'></i> Adicionado!";
                //espera 5s para voltar ao normal
                setTimeout(function() {
                    that.innerHTML = "<i class='bi-cart-fill me-1'></i> Adicionar ao carrinho"
                }, 3000);

                atualizarContador();
                calcularValorTotal();
            })

        }
        else {
            alert("ID do produto não encontrado!");
        }
    }
})