import { inserirLote, inserirProduto, atualizaProduto, atualizaLote } from "../db/insert.js";
import { recuperaNLote, verificaProdutoExiste, recuperaLoteProdutos, obterTimestampBrasilia, recuperaLoteDB, formatarTimestamp, moneyToFloat, excluirProdutoDB} from "./verifica.js";
import { recuperaProduto } from "../db/consult.js";

export async function juncaoProdutoLote(request, reply) {
	const { tamanho, cor, precoProduto, quantidadeProduto, nomeProduto } = request.body;
	console.log(precoProduto)
	// Verificação se todos os campos necessários estão presentes
	if (!nomeProduto || !tamanho || !cor || !precoProduto || !quantidadeProduto) {
		reply.status(400).send({ error: "Dados incompletos ou inválidos" });
		return;
	}

	try {
		// Verifica se o produto já existe
		const produtoExistente = await verificaProdutoExiste(nomeProduto);
		let produto;

		// Se o produto não existir, insere um novo produto
		if (!produtoExistente) {
			produto = await inserirProduto(nomeProduto, tamanho, cor);
			produto = {id : produto };
			// console.log("Produto inserido:", produto)
		} else {
			produto = { id: produtoExistente }; 
			console.log("Produto existente:", produto)
		}

		// Recupera o último número de lote e incrementa
		const NLote = await recuperaNLote();
		// console.log("Número do lote:", NLote);
	
		const timeStamp = obterTimestampBrasilia();

		// Insere um novo lote
		const lote = await inserirLote(
			produto.id,
			precoProduto,
			quantidadeProduto,
			nomeProduto,
			NLote,
			timeStamp
		);

		// Verifica se o lote foi inserido com sucesso
		if (!lote) {
			reply.send({ produto: false });
		} else {
			reply.send({ produto: true });
		}
	} catch (error) {
		console.error("Erro ao inserir produto:", error);
		reply.status(500).send({ error: "Erro ao processar a solicitação" });
	}
}

export async function recuperaLotesProdutos() {
    try {
        const loteProdutos = await recuperaLoteProdutos();
        
        if (!loteProdutos) {
            return { lote: false };
        } else {
            // Processa os produtos para retornar apenas a etapa com status 1
            const produtos = loteProdutos.reduce((acc, produto) => {
                const { id_produto, nome_produto, tamanho_produto, cor_produto, id_lote_produto, preco_produto, quantidade_produto, nome_produto_lote, n_lote, data_criacao, nome_etapa, status } = produto;
                
                // Verifica se o produto já foi adicionado ao acumulador
                if (!acc[id_produto]) {
                    acc[id_produto] = {
                        id_produto,
                        nome_produto,
                        tamanho_produto,
                        cor_produto,
                        id_lote_produto,
                        preco_produto,
                        quantidade_produto,
                        nome_produto_lote,
                        n_lote,
                        data_criacao,
                        etapa_atual: null, // Define como null por padrão
                    };
                }
                
                // Se o status for 1, define a etapa atual
                if (status === 1) {
                    acc[id_produto].etapa_atual = nome_etapa;
                }
                if (status === 4){
					acc[id_produto].etapa_atual = "Finalizado";
				}
                return acc;
            }, {});

            // Converte o acumulador para um array
            return { produtos: Object.values(produtos) };
        }
    } catch (error) {
        console.error("Erro ao verificar o produto:", error);
        throw error;
    }
}


//Criar funcao pra recuperar lote
export async function recuperaLote(request, reply){
	const id = request.params.id;
    // console.log(id);

	try {
		const lote = await recuperaLoteDB(id);
		console.log(lote)
		if (!lote) {
			reply.send({ lote: false });
		} else {
			const horarioCorreto = formatarTimestamp(lote[0].data_criacao);


			const preco = moneyToFloat(lote[0].preco_produto)

			const valorLote = preco * parseInt(lote[0].quantidade_produto, 10);

			const lotePronto = {
				id_lote: lote[0].id_lote_produto,
				data_fabricacao: horarioCorreto,
				preco_produto: preco,
				valorLote,
				quantidade: lote[0].quantidade_produto,
			};
			reply.send({ lotePronto });
			console.log(lotePronto);
		}
	} catch (error) {
		console.error("Erro ao verificar o produto:", error);
		reply.status(500).send({ error: "Erro ao processar a solicitação" });
	}
}

export async function excluirProduto(request, reply){
	const idLote = request.params.id;
	// console.log(idLote);
	try {
		const loteExcluido = await excluirProdutoDB(idLote);
		if (!loteExcluido) {
			reply.send({ lote: false });
		} else {
			reply.send({ lote: true });
		}
	} catch (error) {
		console.error("Erro ao excluir o produto:", error);
		reply.status(500).send({ error: "Erro ao processar a solicitação" });
	}
}

export async function recuperaProdutobyID(request, reply) {
	const { id } = request.params;

	const dadosProduto = await recuperaProduto(id)
	// console.log(dadosProduto)
	reply.send(dadosProduto)
}

export async function editaProduto(request, reply) {
    const dados = request.body;
    const { id_produto, nome_produto, tamanho_produto, cor_produto, preco_produto, quantidade_produto, n_lote } = dados;

    try {
        // Atualizar o produto
        const produtoAtualizado = await atualizaProduto(id_produto, nome_produto, tamanho_produto, cor_produto);

        // Atualizar o lote
        const loteAtualizado = await atualizaLote(id_produto, preco_produto, quantidade_produto, n_lote);

        if (!produtoAtualizado || !loteAtualizado) {
            reply.status(404).send({ sucesso: false, mensagem: "Produto ou lote não encontrado" });
        } else {
            reply.send({ ok: true, mensagem: "Produto e lote atualizados com sucesso" });
        }

    } catch (error) {
        console.error("Erro ao atualizar o produto e lote:", error);
        reply.status(500).send({ erro: "Erro ao processar a solicitação" });
    }
}