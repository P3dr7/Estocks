import { inserirEtapa } from "../db/insert.js";
import { recuperaEtapasDB } from "../db/consult.js";
import { excluirEtapaDB} from "./verifica.js";

export async function adicionarEtapa (request, reply) {

    const dados = request.body;
    console.log(dados)
    const inserido = await inserirEtapa(dados)
    console.log("inseridos", inserido)
    reply.send(inserido).status(500)

}

export async function recuperaEtapaDB(request, reply) {
    const produtoId = request.params.id;

    try {
        const etapas = await recuperaEtapasDB(produtoId);
        // console.log("etapas", etapas)
        reply.send(etapas);
    } catch (error) {
        console.error('Erro ao buscar as etapas:', error);
        reply.status(500).send({ error: 'Erro ao buscar as etapas' });
    }
    
}



export async function excluirEtapa(request, reply){
	const { id } = request.params;
    try {
        // console.log("ID:", id);
        const etapa = await recuperaEtapasDB(id);
        if (!etapa) {
            reply.send({ error: "Etapa não encontrado" });
            return;
        }
        await excluirEtapaDB(id);
        reply.send({ success: "Produto excluído com sucesso" });
    } catch (error) {
        reply.send({ error: "Erro ao excluir o produto" });
        console.error("Erro ao excluir o produto:", error);
    }
}