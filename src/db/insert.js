import { pool } from './Connection.js';
import { verificaProdutoExiste } from "../controllers/verifica.js";
import { getMaterialByName } from './consult.js';
import { atualizaQuantidadeMaterial } from "../controllers/Estoque.js";

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

export async function inserirEtapa(dados) {
    const { nome_etapa, materiais, tempo_necessario, fk_produto_id_produto } = dados;

    try {
        // Inserindo os dados principais da etapa no banco de dados
        const inserido = await pool.query(
            `INSERT INTO Etapa (nome_etapa, tempo_necessario, fk_produto_id_produto)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [nome_etapa, tempo_necessario, fk_produto_id_produto]
        );
		
        if (inserido.rowCount !== 0) {
			const id_produto = fk_produto_id_produto;
			const id_etapa = inserido.rows[0].id_etapa;
		
			// Se materiais for um objeto, converte para array
			const materiaisArray = Array.isArray(materiais) ? materiais : converteMateriaisParaArray(materiais);
		
			// Verifica se o array tem materiais válidos
			if (materiaisArray.length > 0) {
				for (const material of materiaisArray) {
					// Desestruturando corretamente o objeto material
					const { material_id, quantidade } = material;  // Corrigido para 'quantidade'
		
					
					if (material_id && quantidade) {
						
						const id_material = material_id;
						// Inserir material na etapa
						await insereMaterialEtapa(id_material, id_etapa, quantidade);
		
						// Atualizar quantidade do material no estoque
						const materialAtt = await atualizaQuantidadeMaterial({
							idMaterial: material_id,  // Certifique-se de passar a chave correta aqui
							quantidadeMaterial: quantidade  // Corrigido para usar a variável 'quantidade'
						});
		
						if (!materialAtt.success) {
							console.log(`Erro ao atualizar o estoque para o material ${material_id}`);
							return { success: false, error: `Erro ao atualizar o estoque para o material ${material_id}` };
						}
					}
				}
			} else {
				console.log('Erro: Nenhum material válido encontrado.');
				return { success: false, error: 'Materiais inválidos' };
			}
		
			// Chamada para insereProdutoEtapa
			await insereProdutoEtapa(id_produto, id_etapa);
		}
		
		

        return { success: true };
    } catch (error) {
        console.error('Erro ao adicionar a etapa:', error);
        return { success: false, error: 'Erro ao adicionar a etapa' };
    }
}
  


export async function inserirEstoque (dados) {
	const {idMaterial,nomeMaterial, quantidadeMaterial} = dados
	// console.log('dados:', dados)
	try {
		await pool.query(` INSERT INTO estoque_material (id_material, nome_material, quantidade_material)
			VALUES ($1, $2, $3)`,
			[idMaterial, nomeMaterial, quantidadeMaterial]
		);
		return({ success: true });
	} catch (error) {
		console.error('Erro ao adicionar o material:', error);
		return({ success: false, error: 'Erro ao adicionar o material' });
	}
}

async function insereProdutoEtapa(id_produto, Id_etapa) {
	try {
		// console.log('id_produto:', id_produto)
		// console.log('Id_etapa:', Id_etapa)
		await pool.query(` INSERT INTO produto_etapa (fk_produto_id_produto, fk_etapa_id_etapa)
			VALUES ($1, $2)`,
			[id_produto, Id_etapa]
		);
		return({ success: true });
	} catch (error) {
		console.error('Erro ao adicionar o material:', error);
		return({ success: false, error: 'Erro ao adicionar o material' });
	}
}

async function insereMaterialEtapa(id_material, id_etapa, quantidade_gasta, status) {
	try {
		
		const status = 0;
		// console.log('id_material:', id_material)
		await pool.query(` INSERT INTO etapa_material (fk_material_id_material, fk_etapa_id_etapa, quantidade_gasta, status)
			VALUES ($1, $2, $3, $4)`,
			[id_material, id_etapa, quantidade_gasta, status]
		);
		return({ success: true });
	} catch (error) {
		console.error('Erro ao adicionar o material:', error);
		return({ success: false, error: 'Erro ao adicionar o material' });
	}
}

export async function atualizaStatusEtapaDB(dados){
	try{
		const { id_etapa, status } = dados;
		console.log(status)
		const dataConclusao = dados.data
		console.log('dados:', dados)
		if (status == 1) {
			await pool.query(`UPDATE etapa_material SET status = 1 WHERE fk_etapa_id_etapa = $1`, [id_etapa]);
			return({ success: true, message: 'Etapa Em Andamento' });
		} else if (status == 2) {
			await pool.query(`UPDATE etapa_material SET status = 2 WHERE fk_etapa_id_etapa = $1`, [id_etapa]);
			return({ success: true, message: 'Etapa Concluída' });
		} else if (status == 0) {
			await pool.query(`UPDATE etapa_material SET status = 0 WHERE fk_etapa_id_etapa = $1`, [id_etapa]);
			return({ success: true, message: 'Etapa Reiniciada' });
		} else if (status == 4) {
			await pool.query(`UPDATE etapa_material SET status = 4, data_conclusao = $2 WHERE fk_etapa_id_etapa = $1`, [id_etapa, dataConclusao]);
			return({ success: true, message: 'Etapa ACABADA' });
		}
		

	}catch(error){
		console.error('Erro ao atualizar o status da etapa:', error);
		return({ success: false, error: 'Erro ao atualizar o status da etapa' });
	}
}

export async function atualizaQuantidadeMaterialDB(dados){
	try{
		const { idMaterial, quantidade } = dados;


		await pool.query(`UPDATE estoque_material SET quantidade_material = $1 WHERE id_material = $2`, [quantidade, idMaterial]);
		return({ success: true });
	}catch(error){
		console.error('Erro ao atualizar a quantidade do material:', error);
		return({ success: false, error: 'Erro ao atualizar a quantidade do material' });
	}
}

export async function atualizaMaterialDB(dados) {
	try {
		const {id_material, nome_material, quantidade_material} = dados;
		
		await pool.query(` UPDATE estoque_material SET quantidade_material = $1, nome_material = $2  WHERE id_material = $3`, [quantidade_material, nome_material, id_material]);
		return({ success: true });
	} catch (error) {
		console.error('Erro ao adicionar o material:', error);
		return({ success: false, error: 'Erro ao adicionar o material' });
	}
}

export async function atualizaProduto(id_produto, nome_produto, tamanho_produto, cor_produto) {
    // Exemplo usando SQL direto (se você estiver usando uma biblioteca para SQL)
    const query = `
        UPDATE produtos 
        SET nome_produto = $1, tamanho_produto = $2, cor_produto = $3
        WHERE id_produto = $4
        RETURNING *;
    `;
    const values = [nome_produto, tamanho_produto, cor_produto, id_produto];
    const result = await pool.query(query, values); // 'db.query' deve ser a função de execução SQL

    return result.rowCount > 0; // Retorna true se a atualização foi bem-sucedida
}

export async function atualizaLote(id_produto, preco_produto, quantidade_produto, n_lote) {
    const query = `
        UPDATE lote_produto 
        SET preco_produto = $1, quantidade_produto = $2, n_lote = $3
        WHERE id_produto = $4
        RETURNING *;
    `;
    const values = [preco_produto, quantidade_produto, n_lote, id_produto];
    const result = await pool.query(query, values);

    return result.rowCount > 0;
}