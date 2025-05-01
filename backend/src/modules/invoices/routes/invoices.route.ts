import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import invoicesController from '../controllers/invoices.controller';

export const invoicesRoutes = (
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,

  done: () => void,
) => {
  fastify.post('/', invoicesController.create);
  fastify.post('/upload/csv/users/:id', invoicesController.uploadCsv);
  fastify.get('/:id', invoicesController.findOne);
  fastify.get('/users/:id', invoicesController.findAll);
  fastify.patch('/:id', invoicesController.update);
  fastify.delete('/:id', {}, invoicesController.deleteInvoice);
  fastify.delete('/users/:id', {}, invoicesController.deleteAll);

  done();
};
