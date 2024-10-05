import { verificaLogado } from "./controllers/Login.js";
import { juncaoProdutoLote, recuperaLotesProdutos, recuperaLote, excluirProduto, recuperaProdutobyID } from "./controllers/Produtos.js";
import { recuperaLoteTeste1 } from "./controllers/Altera.js";
import { adicionarEtapa, recuperaEtapaDB, excluirEtapa } from "./controllers/Etapas.js";
import { getEstoque, postEstoque, getEstoqueById, excluirProdutoEstoque } from "./controllers/Estoque.js";

export default function (fastify, options, done) {
	// POST
	fastify.post("/verificaLogin", verificaLogado);
	fastify.post("/inserirProduto", juncaoProdutoLote);
	fastify.post('/adicionaEtapa', adicionarEtapa)
	// fastify.post('/atualizaProduto', AtualizaDadosProduto);
	fastify.post('/estoque', postEstoque);
	
	// GET
	fastify.get("/verificaLogin", verificaLogado);
	fastify.get("/recuperaLotesProdutos", recuperaLotesProdutos);
	fastify.get("/recuperaLote/:id", recuperaLote);
	fastify.get("/editaProduto/:id", recuperaLoteTeste1);
	fastify.get('/produto/:id', recuperaProdutobyID);
	fastify.get('/recuperaEtapas/:id', recuperaEtapaDB);
	fastify.get('/estoque', getEstoque);
	fastify.get('/estoque/:id', getEstoqueById);
	// PUT

	//DELETE
	fastify.delete("/excluirProduto/:id", excluirProduto);
	fastify.delete('/excluirProdutoEstoque/:id', excluirProdutoEstoque);
	fastify.delete('/excluirEtapa/:id', excluirEtapa);
	done();
}
