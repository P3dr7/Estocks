import { pool } from './Connection.js';

export async function recuperaProduto(id){
    try {
        const result = await pool.query('SELECT nome_produto, cor_produto FROM Produtos WHERE id_produto = $1', [id]);
        if (result.rows.length > 0) {
            return(result.rows[0]);
        } else {
            return({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao buscar o produto:', error);
        return({ error: 'Erro ao buscar o produto' });
    }
};

export async function recuperaEtapasDB(produtoId) {
    try {
        const result = await pool.query(
            `SELECT * FROM Etapa WHERE fk_Produto_Id_Produto = $1`,
            [produtoId]
        );

        return result.rows;
    } catch (error) {
        console.error('Erro ao buscar etapas:', error);
        throw error;
    }
}