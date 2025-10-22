import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { invoicesRoutes } from './modules/invoices/routes/invoices.route';
import { usersRoutes } from './modules/users/routes/users.route';
import { mongoConnect, mongoDisconnect } from './database/mongoose-connect';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
const server: FastifyInstance = Fastify({
  logger: true,
  requestTimeout: 120000, // 2 minutos
  keepAliveTimeout: 120000, // 2 minutos
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
mongoConnect();

server.register(fastifyCors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
});

server.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  attachFieldsToBody: false,
  sharedSchemaId: 'MultipartFileType',
});

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string',
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
      status: 'error',
      message: error.message,
      code: error.code || 'SERVER_ERROR',
    });
    return;
  }

  reply.status(500).send({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    code: 'SERVER_ERROR',
  });
});

server.register(invoicesRoutes, { prefix: '/api/invoices' });
server.register(usersRoutes, { prefix: '/api/users' });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
server.get('/ping', opts, async (request, reply) => {
  return { pong: 'it worked!' };
});

const start = async () => {
  try {
    await server.listen({
      port: Number(process.env.PORT) || 3000,
      host: process.env.HOST || 'localhost',
    });
  } catch (err) {
    await mongoDisconnect();
    server.log.error(err);
    process.exit(1);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
start();
