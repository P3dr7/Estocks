import { pool } from "../db/Connection.js";
import { verificaProdutoExiste } from "./verifica.js";

export async function inserirProduto(request, reply) {
const { nome, tamanho, cor } = request.body;
  const queryText = `
    INSERT INTO produtos (nome_produto, tamanho_produto, cor_produto)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [nome, tamanho, cor];

  try {
    const result = await pool.query(queryText, values);
    console.log('Produto inserido:', result.rows[0]);
  } catch (error) {
    console.error('Erro ao inserir produto:', error);
  }
}

export async function inserirLote(request, reply) {
  const { precoProduto, quantidadeProduto, nomeProduto, NLote } = request.body;
    // console.log('precoProduto:', precoProduto)
    // console.log('quantidadeProduto:', quantidadeProduto)
    // console.log('nomeProduto:', nomeProduto)
    // console.log('NLote:', NLote)

  try {    
    const idProduto = await verificaProdutoExiste(nomeProduto);
    console.log('idProduto:', idProduto)
    if(!idProduto){
      throw new Error('Produto não encontrado');
    }
    const queryText = `
      INSERT INTO lote_produto (id_produto, preco_produto, quantidade_produto, nome_produto, n_lote)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [idProduto, precoProduto, quantidadeProduto, nomeProduto, NLote];
    const result = await pool.query(queryText, values);

  } catch (error) {
    console.error('Erro ao inserir produto:', error);
  }
}