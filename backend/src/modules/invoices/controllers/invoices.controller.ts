import { FastifyReply, FastifyRequest } from "fastify";
import { mongooseIdDTO } from "../../../shared/dtos/mongo-id.dto";
import invoicesService from "../services/invoices.service";
import { createInvoiceDTO } from "../dtos/create.dto";

const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const { body } = request;

  const invoiceData = createInvoiceDTO(body);

  const result = await invoicesService.create(invoiceData);

  return reply.status(201).send(result);
};

const findAll = async (request: FastifyRequest, reply: FastifyReply) => {
  const { params } = request;
  const id = mongooseIdDTO(params);

  const invoices = await invoicesService.findByUserId(id);

  return reply.send(invoices);
};

const findOne = async (request: FastifyRequest, reply: FastifyReply) => {
  const { params } = request;

  const id = mongooseIdDTO(params);
  const invoice = await invoicesService.findById(id);

  return reply.send(invoice);
};

const update = async (request: FastifyRequest, reply: FastifyReply) => {
  const { params, body } = request;

  const id = mongooseIdDTO(params);
  const invoiceData = createInvoiceDTO(body);

  const updatedInvoice = await invoicesService.update(id, invoiceData);

  return reply.send(updatedInvoice);
};

const deleteInvoice = async (request: FastifyRequest, reply: FastifyReply) => {
  const { params } = request;

  const id = mongooseIdDTO(params);

  await invoicesService.delete(id);

  return reply.status(204).send();
};

export default {
  create,
  findAll,
  findOne,
  update,
  delete: deleteInvoice,
};
