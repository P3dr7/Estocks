import { pool } from "../db/Connection.js";
import { verificaEmail } from "./verifica.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export async function verificaLogado(request, reply) {
	const { email, senha } = request.body;
  
	const queryText = `
	  SELECT * FROM usuarios
	  WHERE email = $1 AND senha = $2
	`;
	const values = [email, senha];
  
	try {
	  const result = await pool.query(queryText, values);
	  if (result.rows.length > 0) {
		const user = result.rows[0];
  
		// Atualizar o último login
		await pool.query(
		  `UPDATE usuarios
		  SET ultimo_login = (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') AT TIME ZONE 'America/Sao_Paulo'
		  WHERE usuario_id = $1;`,
		  [user.usuario_id]
		);
  
		// Gerar o token JWT
		const token = jwt.sign(
		  { id: user.usuario_id, email: user.email },
		  SECRET_KEY,
		  { expiresIn: '1h' }
		);
  
		// Configurar o cookie com o token
		reply.setCookie("token", token, {
			maxAge: 3600, // 1 hora
		}).send({ auth: true, token: token });
		console.log("Cookies configurados:", reply.getHeader("set-cookie"));
		console.log("Cookie enviado:", token);
	  } else {
		return reply.send({ auth: false });
	  }
	} catch (error) {
	  console.error("Erro ao verificar login:", error);
	  return reply.code(500).send({ auth: false, error: "Erro interno" });
	}
  }

  export async function validarToken(request, reply) {
	try {
		// Extrai o token do cookie
		const token = request.cookies.token;
		
		// Verifica se o token está presente
		if (!token) {
		  return reply.status(401).send({ valid: false, message: 'Token não encontrado' });
		}
	  
		// Verifica e decodifica o token
		const decoded = jwt.verify(token, SECRET_KEY);
	  
		// Retorna o token decodificado, confirmando a validade
		return reply.send({ valid: true, decoded });
	  } catch (error) {
		if (error.name === 'TokenExpiredError') {
		  // Erro específico para token expirado
		  return reply.status(401).send({ valid: false, message: 'Token expirado' });
		}
		// Tratamento genérico para outros erros de validação
		return reply.status(401).send({ valid: false, message: 'Token inválido' });
	  }
	  
  }
  
export default validarToken;

export async function logout (request, reply){
	try {
	  // Limpa o cookie contendo o token
	  reply.clearCookie('token', {
		path: '/', // Certifique-se de usar o mesmo `path` usado na criação do cookie
	  });
	  return reply.send({ message: 'Logout realizado com sucesso' });
	} catch (error) {
	  return reply.status(500).send({ message: 'Erro ao realizar logout' });
	}
  }