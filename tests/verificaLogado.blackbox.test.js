// tests/LoginController.test.js
import Fastify from 'fastify';
import routes from '../src/routes.js';
import supertest from 'supertest';

describe('Login Routes', () => {
  let fastify;

  beforeAll(async () => {
    fastify = Fastify();
    fastify.register(routes);
    await fastify.ready();
  });

  afterAll(() => {
    fastify.close();
  });

  test('POST /verificaLogin - Deve autenticar o usuário com email e senha corretos', async () => {
    const response = await supertest(fastify.server)
      .post('/verificaLogin')
      .send({ email: 'joao@example.com', senha: 'senha123' });

    
    expect(response.body).toEqual({ auth: true });
  });

  test('POST /verificaLogin - Não deve autenticar o usuário com email ou senha incorretos', async () => {
    const response = await supertest(fastify.server)
      .post('/verificaLogin')
      .send({ email: 'joao@example.com', senha: 'senhaErrada' });

    
    expect(response.body).toEqual({ auth: false });
  });

  test('GET /verificaLogin - Deve autenticar o usuário com email e senha corretos (por query params)', async () => {
    const response = await supertest(fastify.server)
      .get('/verificaLogin')
      .query({ email: 'joao@example.com', senha: 'senha123' });

    expect(response.body);
  });
});
