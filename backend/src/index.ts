import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { invoiceRoutes } from "./modules/invoices/routes/invoices.route";
import { usersRoutes } from "./modules/users/routes/users.route";
import { mongoConnect, mongoDisconnect } from "./database/mongoose-connect";
import fastifyCors from "@fastify/cors"; // Importe o plugin CORS

const server: FastifyInstance = Fastify({ logger: true });

mongoConnect();

// Configuração do CORS (adicione antes de registrar as rotas)
server.register(fastifyCors, {
  origin: "http://localhost:5173", // Permite apenas requisições do seu frontend
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  credentials: true, // Se estiver usando cookies/tokens
});

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          pong: {
            type: "string",
          },
        },
      },
    },
  },
};

server.register(invoiceRoutes, { prefix: "/api/invoices" });
server.register(usersRoutes, { prefix: "/api/users" });

server.get("/ping", opts, async (request, reply) => {
  return { pong: "it worked!" };
});

const start = async () => {
  try {
    await server.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0",
    });
    console.log(
      `Server running on http://localhost:${process.env.PORT || 3000}`
    );
  } catch (err) {
    await mongoDisconnect();
    server.log.error(err);
    process.exit(1);
  }
};

start();