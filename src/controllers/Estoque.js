import { recuperaEstoque, recuperaEstoqueById } from "../db/consult.js";
import { inserirEstoque } from "../db/insert.js";
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