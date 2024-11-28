import fastify from "fastify";
import routes from "./routes.js";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";

const server = fastify({ logger: true });

// Registrar o plugin de cookies
server.register(fastifyCookie, {
//   secret: 'sua-chave-de-encriptacao', // Opcional: para assinar cookies
  parseOptions: {}, // Configurações adicionais de cookies, se necessário
});

// Registrar rotas
server.register(routes);

// Registrar o plugin de CORS
server.register(cors, {
	origin: (origin, callback) => {
	  // Permitir apenas o domínio que você deseja
	  const allowedOrigins = ['http://127.0.0.1:5500'];
	  if (allowedOrigins.includes(origin) || !origin) {
		// 'null' é permitido para requisições sem origem, como de scripts locais
		callback(null, true);
	  } else {
		callback(new Error("Not allowed by CORS"));
	  }
	},
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true
  });

// Iniciar o servidor
const start = async () => {
  try {
    await server.listen({ port: 3333 });
    server.log.info(`Servidor rodando na porta ${server.server.address().port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
