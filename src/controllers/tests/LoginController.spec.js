import { jest } from '@jest/globals';
import { pool } from '../../db/Connection.js';
import { verificaLogado } from '../Login.js'; 

// console.log(verificaLogado); 

jest.mock('../../db/Connection.js', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('verificaLogado', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve autenticar o usuário com email e senha corretos', async () => {
    const request = {
      body: {
        email: 'joao@example.com',
        senha: 'senha123',
      }
    };
    const reply = {};

    pool.query.mockResolvedValueOnce({
      rows: [{ usuario_id: 1 }],
    });

    const response = await verificaLogado(request, reply);

    expect(response).toEqual({ auth: true });
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['joao@example.com', 'senha123']);
  });

  it('não deve autenticar o usuário com email ou senha incorretos', async () => {
    const request = {
      body: {
        email: 'joao@example.com',
        senha: 'senhaErrada',
      },
    };
    const reply = {};

    pool.query.mockResolvedValueOnce({
      rows: [],
    });

    const response = await verificaLogado(request, reply);

    expect(response).toEqual({ auth: false });
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['joao@example.com', 'senhaErrada']);
  });

  it('deve retornar erro de serialização quando houver erro de serialização circular', async () => {
    const request = {
      body: {
        email: 'joao@example.com',
        senha: 'senha123',
      },
    };
    const reply = {};

    const error = new TypeError('circular structure');
    pool.query.mockRejectedValueOnce(error);

    const response = await verificaLogado(request, reply);

    expect(response).toEqual({ auth: false, error: 'Erro de serialização' });
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['joao@example.com', 'senha123']);
  });

  it('deve retornar erro desconhecido para outros tipos de erros', async () => {
    const request = {
      body: {
        email: 'joao@example.com',
        senha: 'senha123',
      },
    };
    const reply = {};

    const error = new Error('Erro desconhecido');
    pool.query.mockRejectedValueOnce(error);

    const response = await verificaLogado(request, reply);

    expect(response).toEqual({ auth: false, error: 'Erro desconhecido' });
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['joao@example.com', 'senha123']);
  });
});
