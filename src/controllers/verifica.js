import { pool } from "../db/Connection.js";

export async function verificaEmail(email){
    try {
        const resultEmail = await connection.query(
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

export async function verificaProdutoExiste(nome_produto){
    try {
        const resultProduto = await connection.query(
            "SELECT id_produto FROM produtos WHERE nome_produto = ?",
            [email]
        ); 
        const produtoExists = resultProduto && resultProduto.length > 0 && resultProduto[0].length > 0;
        if(produtoExists){
            return resultProduto[0][0].id_produto
        }
    } catch (error) {
        console.error("Erro ao verificar o email:", error);
        throw error;
    }
}