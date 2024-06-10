import { verificaLogado } from "./controllers/Login.js";
import { juncaoProdutoLote, recuperaLotesProdutos, recuperaLote, excluirProduto } from "./controllers/Produtos.js";
export default function (fastify, options, done) {
	// POST
	fastify.post("/verificaLogin", verificaLogado);
	fastify.post("/inserirProduto", juncaoProdutoLote);
	
	// GET
	fastify.get("/verificaLogin", verificaLogado);
	fastify.get("/recuperaLotesProdutos", recuperaLotesProdutos);
	fastify.get("/recuperaLote/:id", recuperaLote);
	// PUT

	//DELETE
	fastify.delete("/excluirProduto/:id", excluirProduto);
	done();
}
