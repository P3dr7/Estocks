import { inserirEtapa, atualizaStatusEtapaDB } from "../db/insert.js";
import { recuperaEtapasDB, getEtapaById, getEtapaMaterialByProdutoId, getEtapaMaterialByIDEtapa, recuperaEstoqueById } from "../db/consult.js";
import { excluirEtapaDB, dateAtual} from "./verifica.js";
import { atualizaQuantidadeMaterial } from "./Estoque.js";

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
        console.log("Requisição recebida para buscar as etapas do produto:", produtoId);
        const etapas = await getEtapaMaterialByProdutoId(produtoId);
        console.log("etapas", etapas)

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
        // console.log("Requisição recebida para atualizar status da etapa:", { id_etapa, status });
        
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
                // console.log("Material:", material);
                // console.log("Finalizando:", material.fk_material_id_material);
                await atualizaStatusEtapaDB({ id_material: material.fk_material_id_material, status });
                // console.log("Material finalizado:", material.fk_material_id_material);
            }

            // Atualiza o status da etapa para "Finalizada" (2)
            await atualizaStatusEtapaDB({ id_etapa, status });
            console.log("Etapa atualizada para Finalizada:", id_etapa);

            return reply.code(200).send({ success: true, message: 'Etapa Finalizada com Sucesso' });
        }

        // Se a etapa está com status 0 (pendente) e o novo status é 1, ela será iniciada
        // console.log("Etapa atual:", etapaAtual.status);
        // console.log("Novo status:", status);
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

        if(etapaAtual.status === 1 && status === 0){
            console.log("Reiniciando etapa:", id_etapa);

            // Buscar todos os materiais relacionados à etapa
            const materiaisDaEtapa = await getEtapaMaterialByIDEtapa(id_etapa);
            if (materiaisDaEtapa.length === 0) {
                console.log("Nenhum material encontrado para esta etapa:", id_etapa);
                return reply.code(404).send({ success: false, error: 'Nenhum material encontrado para esta etapa' });
            }

            // Atualiza o status da etapa para "Pendente" (0)
            await atualizaStatusEtapaDB({ id_etapa, status });
            
            console.log("Etapa atualizada para Pendente:", id_etapa);

            return reply.code(200).send({ success: true, message: 'Etapa Reiniciada com todos os materiais atualizados' });
        }

        if (etapaAtual.status == 2 && status == 4) {
            console.log("Enviando Produto para estoque", id_etapa);
        
            const data = dateAtual();
        
            const materiaisDaEtapa = await getEtapaMaterialByIDEtapa(id_etapa);
            for (const material of materiaisDaEtapa) {
                await atualizaStatusEtapaDB({ id_material: material.fk_material_id_material, status, data });
            }
        
            // Atualiza o status da etapa para "Finalizada" (status 4) com a data de conclusão
            await atualizaStatusEtapaDB({ id_etapa, status, data });
            console.log("Etapa atualizada para Finalizada:", id_etapa);
        
            return reply.code(200).send({ success: true, message: 'Etapa Finalizada com Sucesso' });
        }

        if (etapaAtual.status == 4 && status == 0) {
            console.log("Produto Voltou", id_etapa);
            
            // Buscar todos os materiais relacionados à etapa
            const materiaisDaEtapa = await getEtapaMaterialByIDEtapa(id_etapa);
            for (const material of materiaisDaEtapa) {
                // console.log("Material:", material);
                // console.log("Estocando:", material.fk_material_id_material);
                await atualizaStatusEtapaDB({ id_material: material.fk_material_id_material, status });
               
            }

            await atualizaStatusEtapaDB({ id_etapa, status });
            // console.log("Etapa atualizada para Finalizada:", id_etapa);

            return reply.code(200).send({ success: true, message: 'Etapa Finalizada com Sucesso' });
        }


    } catch (error) { 
        console.error('Erro ao atualizar o status da etapa:', error);
        return reply.code(500).send({ success: false, error: 'Erro ao atualizar o status da etapa' });
    }
}

export async function recuperaEtapa2(request, reply){
    const etapaId = request.params.id;

    try {
        // console.log("Requisição recebida para buscar as etapas do produto:", etapaId);
        const etapas = await getEtapaById(etapaId);
        // console.log("etapas", etapas)

        reply.send(etapas[0]);
    } catch (error) {
        console.error('Erro ao buscar as etapas:', error);
        reply.status(500).send({ error: 'Erro ao buscar as etapas' });
    }
}

export async function atualizaEtapa(request, reply){
    const dados = request.body;
    // console.log("dados", dados);
    try {
        // console.log("Requisição recebida para atualizar a etapa:", dados);
        const etapa = await getEtapaById(dados.id_etapa);
        // console.log(etapa)
        if (!etapa) {
            reply.send({ error: "Etapa não encontrada" });
            reply.status(404);
        }

       const etapa_material = await getEtapaMaterialByIDEtapa(dados.id_etapa)
    //    console.log('etapa_material', etapa_material)
       const material = await recuperaEstoqueById(etapa_material[0].fk_material_id_material)
    //    console.log('material', material)
    // console.log(dados)
    // console.log('dados', dados.quantidade_material_x)
       const quatidadeAtualizada = etapa_material[0].quantidade_gasta - dados.quantidade_material_x
       const  idMaterial = etapa_material[0].fk_material_id_material
       const quantidadeMaterial = Math.abs(quatidadeAtualizada)

       const atualizadaQuantidade = atualizaQuantidadeMaterial({ idMaterial, quantidadeMaterial })
       if(atualizadaQuantidade){
        console.log('Quantidade atualizada com sucesso')
        reply.send({ success: "Etapa atualizada com sucesso" });
       }
    } catch (error) {
        reply.send({ error: "Erro ao atualizar a etapa" });
        console.error("Erro ao atualizar a etapa:", error);
    }
}