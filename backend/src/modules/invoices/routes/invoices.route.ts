import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import invoicesController from '../controllers/invoices.controller';

export const invoicesRoutes = (
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,

  done: () => void,
) => {
  fastify.post('/', invoicesController.create);
  fastify.post('/upload/csv/users/:id', invoicesController.uploadCsv);
  fastify.post('/upload/pdf/users/:id', invoicesController.uploadPdf);
  fastify.get('/:id', invoicesController.findOne);
  fastify.get('/analysis/:id', invoicesController.getAnalysis);
  fastify.get('/users/:id', invoicesController.findAll);
  fastify.patch('/:id', invoicesController.update);
  fastify.delete('/:id', {}, invoicesController.deleteInvoice);
  fastify.delete('/users/:id', {}, invoicesController.deleteAll);
  
  // Analysis transaction routes
  fastify.patch('/analysis/:analysisId/transaction/:transactionId', invoicesController.updateTransactionInAnalysis);
  fastify.delete('/analysis/:analysisId/transaction/:transactionId', invoicesController.deleteTransactionFromAnalysis);

  done();
};
