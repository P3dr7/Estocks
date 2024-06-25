import { pool } from '../../db/Connection.js';
import { verificaLogado } from '../Login.js';

jest.mock('../../db/Connection.js', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('verificaLogado - Testes de Integração', () => {
  it('deve autenticar o usuário com email e senha corretos', async () => {
    const request = {
      body: {
        email: 'joao@example.com',
        senha: 'senha123',
      },
    };
    const reply = {};

    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, email: 'joao@example.com', senha: 'senha123' }] });

    const response = await verificaLogado(request, reply);

    expect(response).toEqual({ auth: true });
  });

  it('não deve autenticar o usuário com email ou senha incorretos', async () => {
    const request = {
      body: {
        email: 'joao@example.com',
        senha: 'senhaErrada',
      },
    };
    const reply = {};

    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await verificaLogado(request, reply);

    expect(response).toEqual({ auth: false });
  });

  it('deve retornar erro de serialização quando houver erro de serialização circular', async () => {
    const request = {
      body: {
        email: 'joao@example.com',
        senha: 'senha123',
      },
    };
    const reply = {};

    // Mock a serialização circular de algum modo
    const error = new TypeError('circular structure');
    pool.query.mockRejectedValueOnce(error);

    const response = await verificaLogado(request, reply);

    expect(response).toEqual({ auth: false, error: 'Erro de serialização' });
  });

  it('deve retornar erro desconhecido para outros tipos de erros', async () => {
    const request = {
      body: {
        email: 'joao@example.com',
        senha: 'senha123',
      },
    };
    const reply = {};

    // Mock um erro desconhecido
    const error = new Error('Erro desconhecido');
    pool.query.mockRejectedValueOnce(error);

    const response = await verificaLogado(request, reply);

    expect(response).toEqual({ auth: false, error: 'Erro desconhecido' });
  });
});
