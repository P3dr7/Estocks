import { verificaLogado } from "./controllers/Login.js";
import { juncaoProdutoLote, recuperaLotesProdutos, recuperaLote, excluirProduto, recuperaProdutobyID } from "./controllers/Produtos.js";
import { recuperaLoteTeste1 } from "./controllers/Altera.js";
import { adicionarEtapa, recuperaEtapaDB } from "./controllers/Etapas.js";
export default function (fastify, options, done) {
	// POST
	fastify.post("/verificaLogin", verificaLogado);
	fastify.post("/inserirProduto", juncaoProdutoLote);
	fastify.post('/adicionaEtapa', adicionarEtapa)
	// fastify.post('/atualizaProduto', AtualizaDadosProduto);
	
	// GET
	fastify.get("/verificaLogin", verificaLogado);
	fastify.get("/recuperaLotesProdutos", recuperaLotesProdutos);
	fastify.get("/recuperaLote/:id", recuperaLote);
	fastify.get("/editaProduto/:id", recuperaLoteTeste1);
	fastify.get('/produto/:id', recuperaProdutobyID);
	fastify.get('/recuperaEtapas/:id', recuperaEtapaDB);
	
	// PUT

	//DELETE
	fastify.delete("/excluirProduto/:id", excluirProduto);
	done();
}
