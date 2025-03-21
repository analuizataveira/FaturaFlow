import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { invoiceRoutes } from "./modules/invoices/routes/invoices.route";
import { usersRoutes } from "./modules/users/routes/users.route";

const server: FastifyInstance = Fastify({ logger: true });

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
    await server.listen({ port: 3000 });

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
