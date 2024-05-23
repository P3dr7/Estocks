import { verificaLogado } from "./controllers/Login.js";
import { juncaoProdutoLote } from "./controllers/Produtos.js";
export default function (fastify, options, done) {
	// POST
	fastify.post("/verificaLogin", verificaLogado);
	fastify.post("/inserirProduto", juncaoProdutoLote);
	
	// GET
	fastify.get("/verificaLogin", verificaLogado);

	// PUT

	//DELETE

	done();
}
