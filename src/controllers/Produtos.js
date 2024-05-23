import { inserirLote, inserirProduto } from "../db/insert.js";

export async function juncaoProdutoLote(request, reply) {
	const { tamanho, cor, precoProduto, quantidadeProduto, nomeProduto, NLote } =
		request.body;
	console.log(request.body)
	if (!nomeProduto) {
		reply.code(400);
		return "Nome do produto é obrigatório";
	}
	try {
		const produto = await inserirProduto(nomeProduto, tamanho, cor);
		// console.log(produto)
		if (produto) {
			const lote = await inserirLote(
				precoProduto,
				quantidadeProduto,
				nomeProduto,
				NLote
			);
			if (!lote) {
				return { produto: false};
			} else {
        return { produto: true}
      }
		}
	} catch (error) {
		console.error("Erro ao inserir produto:", error);
	}
}
