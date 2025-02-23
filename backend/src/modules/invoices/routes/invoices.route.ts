import { FastifyInstance, FastifyPluginOptions } from "fastify";
import invoicesController from "../controllers/invoices.controller";
export const invoiceRoutes = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) => {
  fastify.get("/", invoicesController.parseInvoices);
  done();
};
