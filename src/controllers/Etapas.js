import { inserirEtapa, atualizaStatusEtapaDB } from "../db/insert.js";
import { recuperaEtapasDB, getEtapaByName } from "../db/consult.js";
import { excluirEtapaDB} from "./verifica.js";

// import { atualizaStatusEtapaDB } from "../db/insert.js";


export async function adicionarEtapa (request, reply) {

    const dados = request.body;
    // console.log("dados adicionar etapa", dados);

    const inserido = await inserirEtapa(dados);
    reply.send(inserido).status(200);

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

export async function atualizaStatusEtapa(request, reply) {   
    const dados = request.body;
    const { nome_etapa, status } = dados;
    // console.log("dados",dados)
    try {
        const etapa = await getEtapaByName(nome_etapa);
        // console.log("etapa: ",etapa);

        if (!etapa) {
            return reply.code(404).send({ success: false, error: 'Etapa não encontrada' });
        }

        const id_etapa = etapa[0].id_etapa;
        const etapaMaterial = await getEtapaMaterialByIDEtapa(id_etapa); // Certifique-se de usar `await` aqui, caso `getEtapaMaterialByIDEtapa` seja uma função assíncrona
        if (!etapaMaterial) {
            return reply.code(404).send({ success: false, error: 'Material da etapa não encontrado' });
        }

        if (status == 1) {
            // console.log(id_etapa, status)
            await atualizaStatusEtapaDB({ id_etapa, status });
            return reply.code(200).send({ success: true, message: 'Etapa Em Andamento' });
        } else if (status == 2) {
            // console.log(id_etapa, status)
            await atualizaStatusEtapaDB({ id_etapa, status });
            return reply.code(200).send({ success: true, message: 'Etapa Finalizada com Sucesso' });
        }

    } catch (error) { 
        console.error('Erro ao atualizar o status da etapa:', error);
        return reply.code(500).send({ success: false, error: 'Erro ao atualizar o status da etapa' });
    }
}

