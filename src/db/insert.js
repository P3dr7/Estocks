import { pool } from './Connection.js';
import { verificaProdutoExiste } from "../controllers/verifica.js";
import { getMaterialByName } from './consult.js';


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
	const { nome_etapa, material, tempo_necessario, fk_produto_id_produto } = dados;
  
	try {
	  // Inserindo os dados principais da etapa no banco de dados
	  const inserido = await pool.query(
		`INSERT INTO Etapa (nome_Etapa, Tempo_Necessario, fk_produto_id_produto)
		 VALUES ($1, $2, $3)
		 RETURNING *`,
		[nome_etapa, tempo_necessario, fk_produto_id_produto]
	  );
  
	  if (inserido.rowCount !== 0) {
		// Pegando o id_etapa inserido
		const id_produto = fk_produto_id_produto;
		const id_etapa = inserido.rows[0].id_etapa;
  
		// Referência ao material que foi enviado no objeto
		const keys = Object.keys(material);
		// console.log("keys: ", keys);
  
		// Substituir forEach por um loop for...of para lidar com await
		for (const key of keys) {
		  if (key.startsWith('material')) {
			const numero = key.replace('material', ''); // Extrair o número do material (ex: 1, 2, 3)
			const materialNome = material[key]; // Obter o valor do material
			const quantidade = material[`quantidade${numero}`]; // Buscar a quantidade correspondente
  
			// Verificar se o materialX tem o quantidadeX correspondente
			if (materialNome && quantidade) {
			  console.log("infos: ", materialNome, quantidade);
			  // Aqui você chama a função insereMaterialEtapa com await
			  await insereMaterialEtapa(materialNome, id_etapa, quantidade);
			} else {
			  console.log(`Erro: Material ou quantidade não encontrados para ${key}`);
			}
		  }
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
	const {idMaterial,nomeMaterial, quantidadeMaterial, fkEtapa} = dados
	console.log('dados:', dados)
	try {
		await pool.query(` INSERT INTO estoque_material (id_material, nome_material, quantidade_material, fk_etapa_id_etapa)
			VALUES ($1, $2, $3, $4)`,
			[idMaterial, nomeMaterial, quantidadeMaterial, fkEtapa]
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

async function insereMaterialEtapa(nome_material, id_etapa, quantidade_gasta, status) {
	try {
		const material = await getMaterialByName(nome_material);
		if (!material) {
			return({ success: false, error: 'Material não encontrado' });
		}	
		
		const id_material = material[0].id_material;
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
		if (status == 1) {
			await pool.query(`UPDATE etapa_material SET status = 1 WHERE fk_etapa_id_etapa = $1`, [id_etapa]);
			return({ success: true, message: 'Etapa Em Andamento' });
		} else if (status == 2) {
			await pool.query(`UPDATE etapa_material SET status = 2 WHERE fk_etapa_id_etapa = $1`, [id_etapa]);
			return({ success: true, message: 'Etapa Concluída' });
		}
	}catch(error){
		console.error('Erro ao atualizar o status da etapa:', error);
		return({ success: false, error: 'Erro ao atualizar o status da etapa' });
	}
}