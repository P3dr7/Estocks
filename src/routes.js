import { verificaLogado } from "./controllers/Login.js";
import { juncaoProdutoLote, recuperaLotesProdutos, recuperaLote, excluirProduto, recuperaProdutobyID, editaProduto } from "./controllers/Produtos.js";
import { recuperaLoteTeste1 } from "./controllers/Altera.js";
import { adicionarEtapa, recuperaEtapaDB, excluirEtapa, atualizaStatusEtapa, recuperaEtapa2, atualizaEtapa } from "./controllers/Etapas.js";
import { getEstoque, postMaterial, getEstoqueById, excluirProdutoEstoque, voltaProduto,getMaterial, atualizaMaterial } from "./controllers/Estoque.js";

export default function (fastify, options, done) {
	// POST
	fastify.post("/verificaLogin", verificaLogado);
	fastify.post("/inserirProduto", juncaoProdutoLote);
	fastify.post('/adicionaEtapa', adicionarEtapa)
	// fastify.post('/atualizaProduto', AtualizaDadosProduto);
	fastify.post('/material', postMaterial);
	fastify.post('/voltaProduto', voltaProduto)

	// GET
	fastify.get("/verificaLogin", verificaLogado);
	fastify.get("/recuperaLotesProdutos", recuperaLotesProdutos);
	fastify.get("/recuperaLote/:id", recuperaLote);
	fastify.get("/editaProduto/:id", recuperaLoteTeste1);
	fastify.get('/produto/:id', recuperaProdutobyID);
	fastify.get('/recuperaEtapas/:id', recuperaEtapaDB);
	fastify.get('/estoque', getEstoque);
	fastify.get('/estoque/:id', getEstoqueById);
	fastify.get('/material', getMaterial);
	fastify.get('/recuperaEtapas2/:id', recuperaEtapa2);
	

	// PUT
	fastify.put("/atualizaStatusEtapa", atualizaStatusEtapa);
	fastify.put('/atualizaMaterial', atualizaMaterial);
	fastify.put('/atualizaProduto', editaProduto);
	fastify.put('/atualizaEtapa', atualizaEtapa)
	
	//DELETE
	fastify.delete("/excluirProduto/:id", excluirProduto);
	fastify.delete('/excluirProdutoEstoque/:id', excluirProdutoEstoque);
	fastify.delete('/excluirEtapa/:id', excluirEtapa);
	done();
}
