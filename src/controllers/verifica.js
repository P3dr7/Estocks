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