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

  try {    
    const idProduto = await verificaProdutoExiste(nomeProduto);
    if(!idProduto){
      throw new Error('Produto não encontrado');
    }
    const queryText = `
      INSERT INTO lotes (id_produto, preco_produto, quantidade_produto, nome_produto, n)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [idProduto, precoProduto, quantidadeProduto, nomeProduto, NLote];
    const result = await pool.query(queryText, values);

  } catch (error) {
    console.error('Erro ao inserir produto:', error);
  }
}