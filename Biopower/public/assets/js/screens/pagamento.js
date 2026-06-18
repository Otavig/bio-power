document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("resumoPedidoCorpo");
    const total = document.getElementById("totalValor");
    const btnPagar = document.getElementById("btnValor");
    const dadosSalvos = localStorage.getItem("carrinho");

    if (dadosSalvos) {
        const listaItens = JSON.parse(dadosSalvos);
        
        if (listaItens.length > 0) {
            let htmlAcumulado = "";
            let valorTotalPedido = 0;

            for (let i = 0; i < listaItens.length; i++) {
                let item = listaItens[i];
                let precoNumerico = typeof item.preco === 'string' ? parseFloat(item.preco.replace(',', '.')) : item.preco;
                
                valorTotalPedido += (item.quantidade * precoNumerico);

                htmlAcumulado += `
                <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <img src="${item.imagem}" style="width: 60px; height: 60px; object-fit: cover;" class="me-3 rounded border" alt="${item.nome}">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 text-dark" style="font-size: 0.9rem;">${item.nome}</h6>
                        <small class="text-muted">
                            R$ ${precoNumerico.toFixed(2).replace('.', ',')} x ${item.quantidade}
                        </small>
                    </div>
                    <div class="text-end fw-bold">
                        R$ ${(precoNumerico * item.quantidade).toFixed(2).replace('.', ',')}
                    </div>
                </div>`;
            }

            container.innerHTML = htmlAcumulado;
            
            const totalFormatado = valorTotalPedido.toFixed(2).replace('.', ',');
            
            if (total) {
                total.innerHTML = `R$ <span>${totalFormatado}</span>`;
            }
            if (btnPagar) {
                btnPagar.innerText = `R$ ${totalFormatado}`;
            }

        } else {
            container.innerHTML = "<p style='color: var(--bs-secondary); font-size: 0.9rem;'>O resumo do pedido está vazio.</p>";
        }
    } else {
        container.innerHTML = "<p style='color: var(--bs-secondary); font-size: 0.9rem;'>O resumo do pedido está vazio.</p>";
    }
});