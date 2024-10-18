import { inserirEtapa, atualizaStatusEtapaDB } from "../db/insert.js";
import { recuperaEtapasDB, getEtapaById, getEtapaMaterialByProdutoId, getEtapaMaterialByIDEtapa } from "../db/consult.js";
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
        const etapas = await getEtapaMaterialByProdutoId(produtoId);
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
    try {
        const { id_etapa, status } = request.body;
        console.log("Requisição recebida para atualizar status da etapa:", { id_etapa, status });
        
        // Buscar a etapa pelo ID
        const etapa = await getEtapaById(id_etapa);

        if (!etapa || etapa.length === 0) {
            console.log("Etapa não encontrada:", id_etapa);
            return reply.code(404).send({ success: false, error: 'Etapa não encontrada' });
        }

        // Pegando a primeira etapa no caso de uma lista
        const etapaAtual = etapa[0]; 

        // Se a etapa já estiver concluída (status 2), não pode ser reiniciada
        if (etapaAtual.status === 2 && status === 1) {
            console.log("A etapa já foi concluída e não pode ser reiniciada:", id_etapa);
            return reply.code(400).send({ success: false, message: 'A etapa já foi concluída e não pode ser reiniciada.' });
        }

        // console.log("Etapa atual:", etapaAtual.status);
        // console.log("Novo status:", status);
        // Se a etapa está em andamento (status 1) e o novo status é 2, ela pode ser finalizada
        if (etapaAtual.status == 1 && status == 2) {
            console.log("Finalizando a etapa que está em andamento:", id_etapa);
            
            // Buscar todos os materiais relacionados à etapa
            const materiaisDaEtapa = await getEtapaMaterialByIDEtapa(id_etapa);
            for (const material of materiaisDaEtapa) {
                console.log("Material:", material);
                console.log("Finalizando:", material.id_material);
                await atualizaStatusEtapaDB({ id_material: material.id_material, status });
                console.log("Material finalizado:", material.id_material);
            }

            // Atualiza o status da etapa para "Finalizada" (2)
            await atualizaStatusEtapaDB({ id_etapa, status });
            console.log("Etapa atualizada para Finalizada:", id_etapa);

            return reply.code(200).send({ success: true, message: 'Etapa Finalizada com Sucesso' });
        }

        // Se a etapa está com status 0 (pendente) e o novo status é 1, ela será iniciada
        if (etapaAtual.status === 0 && status === 1) {
            console.log("Iniciando etapa:", id_etapa);

            // Buscar todos os materiais relacionados à etapa
            const materiaisDaEtapa = await getEtapaMaterialByIDEtapa(id_etapa);
            if (materiaisDaEtapa.length === 0) {
                console.log("Nenhum material encontrado para esta etapa:", id_etapa);
                return reply.code(404).send({ success: false, error: 'Nenhum material encontrado para esta etapa' });
            }

            // Atualizar o status para todos os materiais relacionados
            for (const material of materiaisDaEtapa) {
                await atualizaStatusEtapaDB({ id_material: material.id_material, status });
                console.log("Status atualizado para o material:", material.id_material);
            }

            // Atualiza o status da etapa para "Em Andamento" (1)
            await atualizaStatusEtapaDB({ id_etapa, status });
            console.log("Etapa atualizada para Em Andamento:", id_etapa);

            return reply.code(200).send({ success: true, message: 'Etapa Em Andamento com todos os materiais atualizados' });
        }

    } catch (error) { 
        console.error('Erro ao atualizar o status da etapa:', error);
        return reply.code(500).send({ success: false, error: 'Erro ao atualizar o status da etapa' });
    }
}


