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

export async function recuperaEstoque() {
    try {
        const { rows } = await pool.query('SELECT * FROM estoque_material ORDER BY Id_Material ASC');
        return(rows);
    } catch (error) {
        return({ error: 'Erro ao buscar os produtos em estoque' });
    }
};

export async function recuperaEstoqueById(Id_Material) {
    try {
        const { rows } = await pool.query('SELECT * FROM estoque_material WHERE Id_Material = $1', [Id_Material]);
        return(rows);
    } catch (error) {
        return({ error: 'Erro ao buscar os produtos em estoque' });
    }
}

export async function getMaterialByName(nome_material) {
    try {
        const { rows } = await pool.query('SELECT * FROM estoque_material WHERE nome_material = $1', [nome_material]);
        return(rows);
    } catch (error) {
        return({ error: 'Erro ao buscar os produtos em estoque' });
    }
}

export async function getMaterialById(id_material) {
    try {
        const { rows } = await pool.query('SELECT * FROM estoque_material WHERE id_material = $1', [id_material]);
        return(rows);
    } catch (error) {
        return({ error: 'Erro ao buscar os produtos em estoque' });
    }
}

export async function getEtapaByName(nome_etapa) {
    try {
        // console.log("nomeetapa",nome_etapa)
        const { rows } = await pool.query('SELECT * FROM etapa WHERE nome_etapa = $1', [nome_etapa]);
        // console.log(rows)
        return(rows);
    } catch (error) {
        return({ error: 'Erro ao buscar os produtos em estoque' });
    }
}

export async function getEtapaMaterialByIDEtapa(id_etapa){
    try {
        const { rows } = await pool.query('SELECT * FROM etapa_material WHERE fk_etapa_id_etapa = $1', [id_etapa]);
        return(rows);
    } catch (error) {
        return({ error: 'Erro ao buscar os produtos em estoque' });
    }
}

export async function getEtapaById(id_etapa) {
    try {
        const result = await pool.query(
            "SELECT * FROM etapa e JOIN etapa_material em ON em.fk_etapa_id_etapa = e.id_etapa WHERE id_etapa = $1",
            [id_etapa]
        );

        const etapa = result.rows.length > 0;
        if (etapa) {
            return result.rows;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar a etapa:', error);
        throw error;
    }
}

export async function getEtapaMaterialByProdutoId(){
    try {
        const { rows } = await pool.query('SELECT e.id_etapa, e.nome_etapa, e.tempo_necessario, em.id_material, em.nome_material, em.quantidade_material, etp.quantidade_gasta, etp.status FROM produto_etapa pe JOIN etapa e ON pe.fk_etapa_id_etapa = e.id_etapa JOIN etapa_material etp ON e.id_etapa = etp.fk_etapa_id_etapa JOIN estoque_material em ON etp.fk_material_id_material = em.id_material WHERE pe.fk_produto_id_produto = 5;  -- Substitua $1 pelo ID do produto`');
        return(rows);
    } catch (error) {
        return({ error: 'Erro ao buscar os produtos em estoque' });
    }
}