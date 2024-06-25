import { pool } from '../db/Connection.js';

export async function seedDatabase() {
  await pool.query(`
    INSERT INTO usuarios (email, senha, nome) VALUES
    ('joao@example.com', 'senha123', 'João');
  `);
}
