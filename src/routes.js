import { verificaLogado } from "./controllers/Login.js";
import { inserirProduto } from "./controllers/Produtos.js";
import { inserirLote } from "./controllers/Produtos.js";

export default function (fastify, options, done) {
	// POST
	fastify.post("/verificaLogin", verificaLogado);
	fastify.post("/inserirProduto", inserirProduto);
	fastify.post("/inserirLote", inserirLote);
	// GET
	fastify.get("/verificaLogin", verificaLogado);

	// PUT

	//DELETE

	done();
}
