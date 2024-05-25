import { inserirLote, inserirProduto } from "../db/insert.js";
import { recuperaNLote, verificaProdutoExiste, recuperaLoteProdutos } from "./verifica.js";

export async function juncaoProdutoLote(request, reply) {
	const { tamanho, cor, precoProduto, quantidadeProduto, nomeProduto } = request.body;

	// Verificação se todos os campos necessários estão presentes
	if (!nomeProduto || !tamanho || !cor || !precoProduto || !quantidadeProduto) {
		reply.status(400).send({ error: "Dados incompletos ou inválidos" });
		return;
	}

	try {
		// Verifica se o produto já existe
		const produtoExistente = await verificaProdutoExiste(nomeProduto);
		let produto;

		// Se o produto não existir, insere um novo produto
		if (!produtoExistente) {
			produto = await inserirProduto(nomeProduto, tamanho, cor);
			produto = produto.id_produto;
			// console.log("Produto inserido:", produto)
		} else {
			produto = { id: produtoExistente }; 
			// console.log("Produto existente:", produto)
		}

		// Recupera o último número de lote e incrementa
		const NLoteVelho = await recuperaNLote();
		const NLote = parseInt(NLoteVelho, 10) + 1;

		// Insere um novo lote
		const lote = await inserirLote(
			produto.id,
			precoProduto,
			quantidadeProduto,
			nomeProduto,
			NLote
		);

		// Verifica se o lote foi inserido com sucesso
		if (!lote) {
			reply.send({ produto: false });
		} else {
			reply.send({ produto: true });
		}
	} catch (error) {
		console.error("Erro ao inserir produto:", error);
		reply.status(500).send({ error: "Erro ao processar a solicitação" });
	}
}

export async function recuperaLotesProdutos(){
	try {
		const loteProdutos = await recuperaLoteProdutos();
		// console.log(loteProdutos)
		if (!loteProdutos) {
			return { lote: false };
		} else {
			return { produtos: loteProdutos };
		}
	} catch (error) {
		console.error("Erro ao verificar o produto:", error);
		throw error;
	}
}