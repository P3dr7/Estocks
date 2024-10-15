import { recuperaEstoque, recuperaEstoqueById, getMaterialById } from "../db/consult.js";
import { inserirEstoque, atualizaQuantidadeMaterialDB } from "../db/insert.js";
import { excluirProdutoEstoqueDB } from "./verifica.js";

export async function getEstoque(request, reply) {
    try {
        const estoque = await recuperaEstoque();
        reply.send(estoque);
        
    } catch (error) {   
        reply.send({ error: "Erro ao buscar o estoque" });
        console.error("Erro ao buscar o estoque:", error);
    }
};

export async function getEstoqueById(request, reply) {
    try{
        const { id } = request.params;
        const estoque = await recuperaEstoqueById(id);
        reply.send(estoque);
    }catch (error) {

    }
}

export async function postEstoque(request, reply) {
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

        await inserirEstoque({ idMaterial: materialid, nomeMaterial, quantidadeMaterial });
        reply.send({ success: "Material cadastrado com sucesso" });



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

export async function atualizaMaterial(dados) {
    
}

export async function atualizaQuantidadeMaterial(dados) {
    const { idMaterial, quantidadeMaterial } = dados;
    // console.log("dados material", dados)
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
