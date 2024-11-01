import { getProdutosFinalizado, recuperaEstoqueById, getMaterialById, recuperaEstoque, getEtapaMaterialByProdutoId } from "../db/consult.js";
import { inserirEstoque, atualizaQuantidadeMaterialDB, atualizaMaterialDB } from "../db/insert.js";
import { excluirProdutoEstoqueDB } from "./verifica.js";
import axios from 'axios';

export async function getEstoque(request, reply) {
    try {
        // console.log('tentou')
        const estoque = await getProdutosFinalizado();
        // console.log('passou')
        // console.log('estoqe', estoque)
        reply.send(estoque);
        
    } catch (error) {   
        reply.send({ error: "Erro ao buscar o estoque" });
        console.error("Erro ao buscar o estoque:", error);
    }
};

export async function getMaterial(request, reply){
    try {
        const material = await recuperaEstoque();
        reply.send(material);
    } catch (error) {
        reply.send({ error: "Erro ao buscar o material" });
        console.error("Erro ao buscar o material:", error);
    }
}

export async function getEstoqueById(request, reply) {
    try{
        const { id } = request.params;
        const estoque = await recuperaEstoqueById(id);
        reply.send(estoque);
    }catch (error) {

    }
}

export async function postMaterial(request, reply) {
    try {
        const { nomeMaterial, quantidadeMaterial  } = request.body;
        if (!nomeMaterial || !quantidadeMaterial) {
            reply.send({ error: "Dados inválidos" });
            return;
        }

        const estoque = await recuperaEstoque();
       
        const materialid = estoque.length + 1;

        const material = estoque.find((material) => material.nome_material === nomeMaterial)
        if (material) {
            reply.send({ error: "Material já cadastrado" });
            return;
        }
        // console.log("materialid", materialid)
        await inserirEstoque({ idMaterial: materialid, nomeMaterial, quantidadeMaterial });
        reply.send({ success: true, message: "Material adicionado com sucesso" });



    } catch (error) {   
        reply.send({ error: "Erro ao buscar o estoque" });
        console.error("Erro ao buscar o estoque:", error);
    }
}   

export async function excluirProdutoEstoque(request, reply){
	const { id } = request.params;
    try {
        // console.log("ID:", id);
        const produto = await recuperaEstoqueById(id);
        if (!produto) {
            reply.send({ error: "Produto não encontrado" });
            return;
        }
        await excluirProdutoEstoqueDB(id);
        reply.send({ success: "Produto excluído com sucesso" });
    } catch (error) {
        reply.send({ error: "Erro ao excluir o produto" });
        console.error("Erro ao excluir o produto:", error);
    }
}


export async function atualizaQuantidadeMaterial(dados) {
    const { idMaterial, quantidadeMaterial } = dados;
    console.log("dados material", dados)
    try {
        // Buscar o material pelo ID no banco de dados
        // console.log("idMaterial", idMaterial)

        const material = await getMaterialById(idMaterial);
        // console.log("material", material)
        if (!material || material.length === 0) {
            throw new Error(`Material com id ${idMaterial} não encontrado.`);
        }

        const materialAtual = material[0].quantidade_material;
        // console.log("material atual", materialAtual)

        // Calcular a nova quantidade após a subtração
        const quantidadeAtualizada = materialAtual - quantidadeMaterial;
        // console.log("quantidade atualizada", quantidadeAtualizada)

        if (quantidadeAtualizada < 0) {
            throw new Error(`Quantidade insuficiente no estoque para o material com id ${idMaterial}.`);
        }

        // Atualizar a quantidade do material no banco de dados
        const inserido = await atualizaQuantidadeMaterialDB({ idMaterial, quantidade: quantidadeAtualizada });
        // console.log("inserido", inserido)
        
        if (inserido.success) {
            return { success: true };
        } else {
            throw new Error(`Erro ao atualizar a quantidade do material com id ${idMaterial}.`);
        }
    } catch (error) {
        console.error('Erro ao atualizar a quantidade de material:', error.message);
        return { success: false, error: error.message };
    }
}

export async function getMaterialByEtapaId(id_etapa){
    try {
        
        const material = await getMaterialByEtapaIdDB();
        return material;
    } catch (error) {
        console.error('Erro ao buscar o material:', error);
        return { success: false, error: 'Erro ao buscar o material' };
    }
}

export async function voltaProduto(request, reply) {
    const dados = request.body;
    const idProduto = dados.id;
    console.log('dados', dados);
    console.log('id Produto', idProduto);

    try {
        // Obtenha todas as etapas associadas ao produto
        const etapasMaterial = await getEtapaMaterialByProdutoId(idProduto);

        if (!etapasMaterial || etapasMaterial.length === 0) {
            return reply.send({ error: 'Nenhuma etapa encontrada para este produto.' });
        }

        // Loop para cada etapa encontrada
        for (const etapa of etapasMaterial) {
            const idEtapa = etapa.id_etapa;
            console.log(`Atualizando etapa ${idEtapa} para o produto ${idProduto}`);

            try {
                // Envia a requisição para atualizar o status de cada etapa
                await axios.put('http://127.0.0.1:3333/atualizaStatusEtapa', {
                    id_etapa: idEtapa,
                    status: 0
                });
                console.log(`Status da etapa ${idEtapa} atualizado com sucesso`);
            } catch (error) {
                console.error(`Erro ao atualizar o status da etapa ${idEtapa}:`, error);
            }
        }

        reply.send({ success: true, message: 'Todas as etapas foram atualizadas', idProduto, etapasAtualizadas: etapasMaterial });
    } catch (error) {
        console.error('Erro ao buscar etapas do produto:', error);
        reply.send({ error: 'Erro ao buscar etapas do produto' });
    }
};

export async function atualizaMaterial(request, reply){
    const dados = request.body;
    const { id_material, nome_material ,quantidade_material } = dados;
    
    try{
        const material = await atualizaMaterialDB({ id_material, nome_material ,quantidade_material });
        if(material.success){
            reply.send({ success: true });
        }else{
            throw new Error(`Erro ao atualizar a quantidade do material com id ${id_material}.`);
        }
    }catch(error){
        console.error('Erro ao atualizar o material:', error);
        reply.send({ success: false, error: 'Erro ao atualizar o material' });
    }
}

