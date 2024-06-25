import { setupDatabase } from './src/migrations/setupDatabase.js';
import { seedDatabase } from './src/seeders/seedDatabase.js';
import { pool } from './src/db/Connection.js';

beforeAll(async () => {
  await setupDatabase();
});

beforeEach(async () => {
  await pool.query('TRUNCATE TABLE usuarios RESTART IDENTITY');
  await seedDatabase();
});

afterAll(async () => {
  await pool.query('DROP TABLE IF EXISTS usuarios');
  await pool.end();
});
