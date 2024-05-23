import { pool } from './Connection.js';
import { verificaProdutoExiste } from "../controllers/verifica.js";


export async function inserirProduto(nome, tamanho, cor) {
	const queryText = `
    INSERT INTO produtos (nome_produto, tamanho_produto, cor_produto)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

	const values = [nome, tamanho, cor];

	try {
		const result = await pool.query(queryText, values);
		if (!result) {
			return false;
		} else {
			return true;
		}
	} catch (error) {
		console.error("Erro ao inserir produto:", error);
	}
}

export async function inserirLote(
	precoProduto,
	quantidadeProduto,
	nomeProduto,
	NLote
) {
	// console.log('precoProduto:', precoProduto)
	// console.log('quantidadeProduto:', quantidadeProduto)
	// console.log('nomeProduto:', nomeProduto)
	// console.log('NLote:', NLote)

	try {
		const idProduto = await verificaProdutoExiste(nomeProduto);
		console.log("idProduto:", idProduto);
		if (!idProduto) {
			throw new Error("Produto não encontrado");
		}
		const queryText = `
      INSERT INTO lote_produto (id_produto, preco_produto, quantidade_produto, nome_produto, n_lote)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
		const values = [
			idProduto,
			precoProduto,
			quantidadeProduto,
			nomeProduto,
			NLote,
		];
		const result = await pool.query(queryText, values);

		if (!result) {
			return false;
		} else {
			return true;
		}
	} catch (error) {
		console.error("Erro ao inserir produto:", error);
	}
}