import { pool } from './Connection.js';
import { verificaProdutoExiste } from "../controllers/verifica.js";


export async function inserirProduto(nome, tamanho, cor) {
    const queryText = `
        INSERT INTO produtos (nome_produto, tamanho_produto, cor_produto)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const values = [nome, tamanho, cor];

    try {
        const result = await pool.query(queryText, values);
        // console.log(result);
        if (!result || result.rowCount === 0) {
            return false;
        } else {
			// console.log(result.rows[0].id_produto)
            return result.rows[0].id_produto;
        }
    } catch (error) {
        console.error("Erro ao inserir produto:", error);
        throw error; 
    }
}

export async function inserirLote(
  idProduto,
	precoProduto,
	quantidadeProduto,
	nomeProduto,
	NLote,
	timeStamp
) {
	// console.log('precoProduto:', precoProduto)
	// console.log('quantidadeProduto:', quantidadeProduto)
	// console.log('nomeProduto:', nomeProduto)
	// console.log('NLote:', NLote)

	try {
		if (!idProduto) {
			throw new Error("Produto não encontrado");
		}
		const queryText = `
      INSERT INTO lote_produto (id_produto, preco_produto, quantidade_produto, nome_produto, n_lote, data_criacao)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
		const values = [
			idProduto,
			precoProduto,
			quantidadeProduto,
			nomeProduto,
			NLote,
			timeStamp,
		];
		const result = await pool.query(queryText, values);

		if (!result) {
			return false;
		} else {
			return true;
		}
	} catch (error) {
		console.error("Erro ao inserir produto:", error);
	}
}

export async function inserirEtapa (dados) {
	const {nome_etapa, material_x, quantidade_material_x, tempo_necessario, fk_produto_id_produto} = dados
	
	try {
        await pool.query(`
            INSERT INTO Etapa (Nome_Etapa, Material_x, Quantidade_Material_x, Tempo_Necessario, fk_Produto_Id_Produto)
            VALUES ($1, $2, $3, $4, $5)`,
            [nome_etapa, material_x, quantidade_material_x, tempo_necessario, fk_produto_id_produto]
        );
        return({ success: true });
    } catch (error) {
        console.error('Erro ao adicionar a etapa:', error);
        return({ success: false, error: 'Erro ao adicionar a etapa' });
    }
}

// {
// 	fk_produto_id_produto: '5',
// 	nome_etapa: 'teste',
// 	material_x: 'madeira',
// 	quantidade_material_x: '12',
// 	tempo_necessario: '12:12'
//   }