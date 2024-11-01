import { pool } from "../db/Connection.js";

export async function verificaEmail(email) {
	try {
		const resultEmail = await pool.query(
			"SELECT usuario_id FROM usuarios WHERE email = ?",
			[email]
		);
		const emailExists =
			resultEmail && resultEmail.length > 0 && resultEmail[0].length > 0;
		if (emailExists) {
			return resultEmail[0][0].usuario_id;
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
			"SELECT * FROM lote_produto ORDER BY id_lote_produto DESC LIMIT 1"
		);

		const NLote = resultLote.rows.length > 0;
		if (NLote) {
			const NLoteVelho = resultLote.rows[0].id_lote_produto;
			console.log(NLoteVelho);
			const NLote = parseInt(NLoteVelho, 10) + 1;
			console.log(NLote);
			return NLote;
		} else {
			return 1;
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

export async function recuperaLoteProdutos() {
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
				l.data_criacao,
				e.nome_etapa,
				em.status
			FROM 
				produtos p
			JOIN 
				lote_produto l ON p.id_produto = l.id_produto
			LEFT JOIN 
				produto_etapa ep ON p.id_produto = ep.fk_produto_id_produto
			LEFT JOIN 
				etapa e ON ep.fk_etapa_id_etapa = e.id_etapa
			LEFT JOIN 
				etapa_material em ON e.id_etapa = em.fk_etapa_id_etapa
			ORDER BY 
				p.nome_produto, l.quantidade_produto;
			`
		);
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

// Arrumar
export async function recuperaLoteDB(id) {
	try {
		console.log("id dentro do recuperaLote", id)
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
			[id] // Passa o valor do id como parâmetro
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

export function obterTimestampBrasilia() {
	const dataAtual = new Date();
	const offsetBrasilia = -3 * 60; // Offset de Brasília em minutos (UTC-3)
	const timestampBrasilia = new Date(
		dataAtual.getTime() + offsetBrasilia * 60000
	)
		.toISOString()
		.slice(0, 19)
		.replace("T", " ");
	return timestampBrasilia;
}
export function dateAtual(){
const dataAtual = new Date();

// Formatar a data para YYYY-MM-DD
const ano = dataAtual.getFullYear();
const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Mês começa de 0, então adicionamos 1
const dia = String(dataAtual.getDate()).padStart(2, '0');

const dataFormatada = `${ano}-${mes}-${dia}`;
return dataFormatada;}

export function formatarTimestamp(timestampISO) {
	// Converte o timestamp para um objeto Date
	const data = new Date(timestampISO);

	// Ajusta o fuso horário para Brasília (UTC-3)
	const offsetBrasilia = -3; // Horas
	data.setHours(data.getHours() + offsetBrasilia);

	// Formata a hora
	const horas = String(data.getHours()).padStart(2, "0");
	const minutos = String(data.getMinutes()).padStart(2, "0");
	const segundos = String(data.getSeconds()).padStart(2, "0");

	// Formata a data
	const ano = data.getFullYear();
	const mes = String(data.getMonth() + 1).padStart(2, "0"); // Meses são indexados de 0 a 11
	const dia = String(data.getDate()).padStart(2, "0");

	// Monta o timestamp formatado
	const timestampFormatado = `${horas}:${minutos}:${segundos} ${ano}-${mes}-${dia}`;

	return timestampFormatado;
}

export function moneyToFloat(moneyValue) {
    // Remove o símbolo da moeda e a vírgula dos centavos da string
    const numericValue = moneyValue.replace('R$', '').replace(',', '.');

    // Converte a string numérica para um número de ponto flutuante (float)
    const floatValue = parseFloat(numericValue);

    return floatValue;
}

export async function excluirProdutoDB(idLote){
	try {
		const result = await pool.query(
			"DELETE FROM lote_produto WHERE id_lote_produto = $1",
			[idLote]
		);

		return result.rowCount > 0;
	} catch (error) {
		console.error("Erro ao excluir produto:", error);
		throw error;
	}
}

export async function excluirProdutoEstoqueDB(idEstoque){
	try {
		const result = await pool.query(
			"DELETE FROM estoque_material WHERE id_material = $1",
			[idEstoque]
		);

		return result.rowCount > 0;
	} catch (error) {
		console.error("Erro ao excluir produto:", error);
		throw error;
	}
}

export async function excluirEtapaDB(idEtapa){
	try {
		await excluirEtapaProdutoDB(idEtapa);
		const result = await pool.query(
			"DELETE FROM etapa WHERE id_etapa = $1",
			[idEtapa]
		);
		return result.rowCount > 0;
	} catch (error) {
		console.error("Erro ao excluir produto:", error);
		throw error;
	}
}

async function excluirEtapaProdutoDB(idEtapa){
	try {
		const result = await pool.query(
			"DELETE FROM produto_etapa WHERE fk_etapa_id_etapa = $1",
			[idEtapa]
		);

		return result.rowCount > 0;
	} catch (error) {
		console.error("Erro ao excluir produto:", error);
		throw error;
	}
}	