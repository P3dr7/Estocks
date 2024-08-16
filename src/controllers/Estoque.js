import { recuperaEstoque } from "../db/consult.js";
import { inserirEstoque } from "../db/insert.js";

export async function getEstoque(request, reply) {
    try {
        const estoque = await recuperaEstoque();
        reply.send(estoque);
        
    } catch (error) {   
        reply.send({ error: "Erro ao buscar o estoque" });
        console.error("Erro ao buscar o estoque:", error);
    }
};

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