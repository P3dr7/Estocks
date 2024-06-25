import { pool } from '../db/Connection.js';

export async function setupDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      usuario_id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      senha VARCHAR(255) NOT NULL,
      nome VARCHAR(255) NOT NULL, 
      ultimo_login TIMESTAMP
    );
  `);
}
