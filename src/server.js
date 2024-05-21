import fastify from "fastify";
import routes from "./routes.js";
import cors from "@fastify/cors";

const server = fastify({ logger: true });

// Registrar rotas
server.register(routes);

server.register(cors, {
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type"],
});

// Iniciar o servidor
const start = async () => {
	try {
		await server.listen({ port: 3333 });
		server.log.info(
			`Servidor rodando na porta ${server.server.address().port}`
		);
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};

start();
