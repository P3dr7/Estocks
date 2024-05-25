import { pool } from "../db/Connection.js";

export async function verificaEmail(email){
    try {
        const resultEmail = await pool.query(
            "SELECT usuario_id FROM usuarios WHERE email = ?",
            [email]
        ); 
        const emailExists = resultEmail && resultEmail.length > 0 && resultEmail[0].length > 0;
        if(emailExists){
            return resultEmail[0][0].usuario_id
        }
    } catch (error) {
        console.error("Erro ao verificar o email:", error);
        throw error;
    }
}

export async function verificaProdutoExiste(nome_produto) {
    try {
        const resultProduto = await pool.query(
            "SELECT id_produto FROM produtos WHERE nome_produto = $1",
            [nome_produto]
        );

        const produtoExists = resultProduto.rows.length > 0;
        if (produtoExists) {
            // console.log("Produto encontrado:", resultProduto.rows[0].id_produto);
            return resultProduto.rows[0].id_produto;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Erro ao verificar o produto:", error);
        throw error;
    }
}

export async function recuperaNLote() {
    try {
        const resultLote = await pool.query(
            "SELECT * FROM lote_produto ORDER BY n_lote DESC LIMIT 1"
        );

        const NLote = resultLote.rows.length > 0;
        if (NLote) {
            return resultLote.rows[0].n_lote;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Erro ao verificar o produto:", error);
        throw error;
    }
}

// export async function recuperaProdutos(){
//     try {
//         const resultProdutos = await pool.query(
//             "SELECT * FROM produtos"
//         );

//         const Produtos = resultProdutos.rows.length > 0;
//         if (Produtos) {
//             return Produtos.rows;
//         } else {
//             return null;
//         }
//     } catch (error) {
//         console.error("Erro ao verificar o produto:", error);
//         throw error;
//     }
// }

// export async function recuperaLote(){
//     try {
//         const resultLote = await pool.query(
//             "SELECT * FROM lote_produto"
//         );
//         const Lote = resultLoteProduto.rows.length > 0;
//         if (Lote) {
//             return Lote.rows;
//         } else {
//             return null;
//         }
//     } catch (error) {
//         console.error("Erro ao verificar o produto:", error);
//         throw error;
//     }
// }

export async function recuperaLoteProdutos(){
    try {
        const resultLoteProduto = await pool.query(
            "SELECT p.id_produto, p.nome_produto, p.tamanho_produto, p.cor_produto, l.id_lote_produto, l.preco_produto, l.quantidade_produto, l.nome_produto AS nome_produto_lote, l.n_lote FROM Produtos p JOIN Lote_Produto l ON p.id_produto = l.id_produto ORDER BY p.nome_produto, l.quantidade_produto");
        const LoteProduto = resultLoteProduto.rows.length > 0;
        // console.log(LoteProduto)
        if (LoteProduto) {
            return resultLoteProduto.rows;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Erro ao verificar o produto:", error);
        throw error;
    }
}