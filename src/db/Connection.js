import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();
let pool;

export async function initializeDatabase() {
    if (!pool) {
        try {
            pool = new Pool({
              host: process.env.DB_HOST,
              user: process.env.DB_USER,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
              port: process.env.DB_PORT,
            });

            const client = await pool.connect();
            const res = await client.query('SELECT * FROM usuarios');
            console.log(res.rows);
            client.release();
        } catch (err) {
            console.error("Erro ao estabelecer a conexão ou executar a consulta:", err.message);
        }
    }
}

initializeDatabase();

export { pool };
