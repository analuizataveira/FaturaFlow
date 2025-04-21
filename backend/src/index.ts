import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { invoiceRoutes } from "./modules/invoices/routes/invoices.route";
import { usersRoutes } from "./modules/users/routes/users.route";
import { mongoConnect, mongoDisconnect } from "./database/mongoose-connect";
import fastifyCors from "@fastify/cors";

const server: FastifyInstance = Fastify({ logger: true });

mongoConnect();

server.register(fastifyCors, {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
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

server.setErrorHandler((error, request, reply) => {
  server.log.error(error);

  if (error.statusCode) {
    reply.status(error.statusCode).send({
      status: "error",
      message: error.message,
      code: error.code || "SERVER_ERROR",
    });
    return;
  }

  reply.status(500).send({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
    code: "SERVER_ERROR",
  });
});

server.register(invoiceRoutes, { prefix: "/api/invoices" });
server.register(usersRoutes, { prefix: "/api/users" });
server.get("/ping", opts, async (request, reply) => {
  return { pong: "it worked!" };
});

const start = async () => {
  try {
    await server.listen({
      port: Number(process.env.PORT) || 3000,
      host: process.env.HOST || "localhost",
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
