document.addEventListener("DOMContentLoaded", () => {
    // Função que obtém dados dos produtos da API
    const obterProdutos = async () => {
        try {
            const response = await fetch("http://127.0.0.1:3333/recuperaLotesProdutos", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.produtos; // Retorna a lista de produtos
        } catch (error) {
            console.error("Erro ao obter produtos da API:", error);
            return [];
        }
    };

    // Função que preenche a tabela de produtos
    const preencherTabela = async () => {
        const produtos = await obterProdutos();
        const tabela = document.getElementById("produtoList");

        produtos.forEach((produto) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${produto.nome_produto}</td>
                <td>${produto.tamanho_produto}</td>
                <td>${produto.cor_produto}</td>
                <td>${produto.preco_produto}</td>
                <td>${produto.quantidade_produto}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarProduto(${produto.id_produto})">Editar</button>
                    <button class="btn btn-info btn-sm" onclick="etapasProduto(${produto.id_produto})">Etapas</button>
                    <button class="btn btn-info btn-sm" data-bs-toggle="collapse" data-bs-target="#collapse${produto.id_produto}" aria-expanded="false" aria-controls="collapse${produto.id_produto}" onclick="visualizarLote(${produto.id_lote_produto}, ${produto.id_produto})">Lote</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirProduto(${produto.id_lote_produto})">Excluir</button>
                </td>
            `;

            const collapseRow = document.createElement("tr");
            collapseRow.innerHTML = `
                <td colspan="6" class="p-0">
                    <div class="collapse" id="collapse${produto.id_produto}">
                        <div class="card card-body">
                            Carregando...
                        </div>
                    </div>
                </td>
            `;

            tabela.appendChild(row);
            tabela.appendChild(collapseRow);
        });
    };

    preencherTabela();
});

// Função para adicionar um novo produto
const adicionarProduto = () => {
    window.location.href = "adicionarProduto.html"; // Redireciona para a página de cadastro de produto
};

// Função para editar um produto existente
const editarProduto = (id) => {
    // Redireciona para a página de edição de produto com o ID do produto
    window.location.href = `editar-produto.html?id=${id}`;
};

// Função para ver as etapas de um produto
const etapasProduto = (id) => {
    // Redireciona para a página de etapas do produto com o ID do produto
    window.location.href = `etapas-produto.html?id=${id}`;
};

// Função para visualizar o lote do produto
const visualizarLote = async (idLote, idProduto) => {
    try {
        const response = await fetch(`http://127.0.0.1:3333/recuperaLote/${idLote}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const lote = data.lotePronto;

        const collapseElement = document.querySelector(`#collapse${idProduto} .card-body`);
        if (!collapseElement) {
            console.error(`Elemento collapse#${idProduto} não encontrado.`);
            return;
        }

        collapseElement.innerHTML = `
            <p><strong>ID do Lote:</strong> ${lote.id_lote}</p>
            <p><strong>Data de Fabricação:</strong> ${lote.data_fabricacao}</p>
            <p><strong>Valor do Lote:</strong> ${lote.valorLote}</p>
            <p><strong>Quantidade:</strong> ${lote.quantidade}</p>
        `;

        // Alterna o colapso ao clicar no botão
        const collapseElementContainer = document.querySelector(`#collapse${idProduto}`);
        const collapseInstance = bootstrap.Collapse.getOrCreateInstance(collapseElementContainer);
        collapseInstance.toggle();
    } catch (error) {
        console.error("Erro ao obter lote do produto:", error);
        const collapseElement = document.querySelector(`#collapse${idProduto} .card-body`);
        if (collapseElement) {
            collapseElement.innerHTML = "<p>Erro ao carregar dados do lote.</p>";
        }
    }
};

// Função para excluir um produto
const excluirProduto = async (id) => {
    try {
        const response = await fetch(`http://127.0.0.1:3333/excluirProduto/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Se o retorno incluir "lote": true, recarregar a página
        if (data.lote === true) {
            window.location.reload();
        } else {
            // Recarregar a tabela de produtos após exclusão
            const tabela = document.getElementById("produtoList");
            tabela.innerHTML = "";
            preencherTabela();
        }
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
    }
};
