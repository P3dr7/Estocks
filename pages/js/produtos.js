document.addEventListener('DOMContentLoaded', () => {
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
        const tabela = document.getElementById('produtoList');

        produtos.forEach(produto => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${produto.nome_produto}</td>
                <td>${produto.tamanho_produto}</td>
                <td>${produto.cor_produto}</td>
                <td>${produto.preco_produto}</td>
                <td>${produto.quantidade_produto}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarProduto(${produto.id_produto})">Editar</button>
                    <button class="btn btn-info btn-sm" onclick="etapasProduto(${produto.id_produto})">Etapas</button>
                    <button class="btn btn-info btn-sm" onclick="visualizarLote(${produto.id_produto})">Lote</button>
                </td>
            `;

            tabela.appendChild(row);
        });
    };

    preencherTabela();
});

// Função para adicionar um novo produto
const adicionarProduto = () => {
    window.location.href = 'adicionarProduto.html'; // Redireciona para a página de cadastro de produto
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
