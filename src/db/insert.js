import { query } from './db.js';

export async function inserirProduto(nome, tamanho, cor) {
  const queryText = `
    INSERT INTO produtos (nome_produto, tamanho_produto, cor_produto)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [nome, tamanho, cor];

  try {
    const result = await query(queryText, values);
    console.log('Produto inserido:', result.rows[0]);
  } catch (error) {
    console.error('Erro ao inserir produto:', error);
  }
}

// Exemplo de uso da função de inserção
inserirProduto('Produto Exemplo', 'Grande', 'Azul');