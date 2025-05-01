import { FastifyReply, FastifyRequest } from 'fastify';
import { mongooseIdDTO } from '../../../shared/dtos/mongo-id.dto';
import invoicesService from '../services/invoices.service';
import { createInvoiceDTO } from '../dtos/create.dto';
import { validateCsvDTO } from '../dtos/upload-csv.dto';

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

  await invoicesService.deleteInvoice(id);

  return reply.status(204).send();
};

const deleteAll = async (request: FastifyRequest, reply: FastifyReply) => {
  const { params } = request;
  const id = mongooseIdDTO(params);

  await invoicesService.deleteByUserId(id);

  return reply.status(204).send();
};

const uploadCsv = async (
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply,
) => {
  const { params } = request;
  const userId = mongooseIdDTO(params);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  if (!request.isMultipart()) {
    return reply.status(400).send({ error: 'The request must be multipart/form-data' });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: 'No file provided' });
    }

    const validation = validateCsvDTO(data);
    if (!validation.isValid) {
      return reply.status(400).send({ error: validation.message });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const buffer = await data.toBuffer();
    const result = await invoicesService.uploadCsv(buffer, userId);

    return reply.status(200).send(result);
  } catch (err) {
    return reply.status(400).send({
      error: 'Error processing the file',
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export default {
  create,
  findAll,
  findOne,
  update,
  deleteInvoice,
  deleteAll,
  uploadCsv,
};
