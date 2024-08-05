import { pool } from "../db/Connection.js";

// Função recuperaLoteDB e recuperaLote
async function recuperaLoteTeste(id) {
    try {
        const resultLoteProduto = await pool.query(
            `SELECT 
                p.id_produto, 
                p.nome_produto, 
                p.tamanho_produto, 
                p.cor_produto, 
                l.id_lote_produto, 
                l.preco_produto, 
                l.quantidade_produto, 
                l.nome_produto AS nome_produto_lote, 
                l.n_lote,
                l.data_criacao
            FROM 
                produtos p 
            JOIN 
                lote_produto l 
            ON 
                p.id_produto = l.id_produto 
            WHERE 
                l.id_lote_produto = $1 
            ORDER BY 
                p.nome_produto, l.quantidade_produto`,
            [id]
        );

        if (resultLoteProduto.rows.length > 0) {
            return resultLoteProduto.rows;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Erro ao verificar o produto:", error);
        throw error;
    }
}

export async function recuperaLoteTeste1(request, reply) {
    const id = request.params.id;

    try {
        const lote = await recuperaLoteTeste(id);
        if (!lote) {
            reply.send({ lote: false });
        } else {
            const horarioCorreto = new Date(lote[0].data_criacao).toLocaleString();
            const preco = parseFloat(lote[0].preco_produto.replace('R$', '').replace(',', '.'));
            const valorLote = preco * parseInt(lote[0].quantidade_produto, 10);

            const lotePronto = {
                id_lote: lote[0].id_lote_produto,
                nome_produto: lote[0].nome_produto,
                tamanho_produto: lote[0].tamanho_produto,
                cor_produto: lote[0].cor_produto,
                preco_produto: lote[0].preco_produto,
                quantidade_produto: lote[0].quantidade_produto,
                n_lote: lote[0].n_lote,
                data_fabricacao: horarioCorreto,
                valorLote
            };
            reply.send({ lotePronto });
        }
    } catch (error) {
        console.error("Erro ao verificar o produto:", error);
        reply.status(500).send({ error: "Erro ao processar a solicitação" });
    }
}



