import { inserirEtapa } from "../db/insert.js";
import { recuperaEtapasDB } from "../db/consult.js";

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
        reply.send(etapas);
    } catch (error) {
        console.error('Erro ao buscar as etapas:', error);
        reply.status(500).send({ error: 'Erro ao buscar as etapas' });
    }
    
}