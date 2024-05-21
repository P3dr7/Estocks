import { pool } from "../db/Connection.js";
import { verificaEmail } from "./verifica.js";
export async function verificaLogado(request, reply) {
	const dadosRecebidos = request.body;
	console.log("Dados recebidos do cliente:", dadosRecebidos);

	const { email, senha } = dadosRecebidos;

	const queryText = `
    SELECT * FROM usuarios
    WHERE email = $1 AND senha = $2
    `;
	const values = [email, senha];
	try {
		const result = await pool.query(queryText, values);
		if (result.rows.length > 0) {
			const idUser = result.rows[0].usuario_id;
			await pool.query(
				"UPDATE usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE usuario_id = $1",
				[idUser]
			);

			return { auth: true };
		} else {
			return { auth: false };
		}
	} catch (error) {
		if (
			error instanceof TypeError &&
			error.message.includes("circular structure")
		) {
			console.error("Erro de serialização ao verificar login:", error);
			return { auth: false, error: "Erro de serialização" };
		} else {
			console.error("Erro ao verificar login:", error);
			return { auth: false, error: "Erro desconhecido" };
		}
	}
}
