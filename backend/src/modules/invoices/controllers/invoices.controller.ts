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

const getAnalysis = async (request: FastifyRequest, reply: FastifyReply) => {
  const { params } = request;

  const id = mongooseIdDTO(params);
  const analysis = await invoicesService.getAnalysis(id);

  return reply.send(analysis);
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

  if (!request.isMultipart()) {
    return reply.status(400).send({ error: 'The request must be multipart/form-data' });
  }

  try {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: 'No file provided' });
    }

    const validation = validateCsvDTO(data);
    if (!validation.isValid) {
      return reply.status(400).send({ error: validation.message });
    }

    const buffer = await data.toBuffer();
    const fileName = data.filename || 'CSV Upload';
    const result = await invoicesService.uploadCsv(buffer, userId, fileName);

    return reply.status(200).send(result);
  } catch (err) {
    return reply.status(400).send({
      error: 'Error processing the file',
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

const uploadPdf = async (
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply,
) => {
  const { params } = request;
  const userId = mongooseIdDTO(params);

  if (!request.isMultipart()) {
    return reply.status(400).send({ error: 'The request must be multipart/form-data' });
  }

  try {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: 'No file provided' });
    }

    const buffer = await data.toBuffer();
    const fileName = data.filename || 'PDF Upload';
    const result = await invoicesService.uploadPdf(buffer, userId, fileName);

    return reply.status(200).send(result);
  } catch (err) {
    return reply.status(400).send({
      error: 'Error processing the file',
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

const updateInvoiceInAnalysis = async (
  request: FastifyRequest<{
    Params: { analysisId: string; invoiceIndex: string };
    Body: {
      date?: string;
      description?: string;
      value?: number;
      category?: string;
    };
  }>,
  reply: FastifyReply,
) => {
  const { params, body } = request;
  const analysisId = mongooseIdDTO({ id: params.analysisId });
  const invoiceIndex = parseInt(params.invoiceIndex, 10);

  if (isNaN(invoiceIndex) || invoiceIndex < 0) {
    return reply.status(400).send({ error: 'Invalid invoice index' });
  }

  try {
    const updatedAnalysis = await invoicesService.updateInvoiceInAnalysis(
      analysisId,
      invoiceIndex,
      body,
    );

    return reply.send(updatedAnalysis);
  } catch (err) {
    return reply.status(400).send({
      error: 'Error updating invoice in analysis',
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

const updateTransactionInAnalysis = async (
  request: FastifyRequest<{
    Params: { analysisId: string; transactionId: string };
    Body: {
      description: string;
      value: number;
      category: string;
    };
  }>,
  reply: FastifyReply,
) => {
  console.log('📝 [InvoicesController] Atualizando transação:', {
    analysisId: request.params.analysisId,
    transactionId: request.params.transactionId,
    body: request.body,
    paramsType: typeof request.params,
    analysisIdType: typeof request.params.analysisId,
    transactionIdType: typeof request.params.transactionId
  });

  const { params, body } = request;
  const analysisId = mongooseIdDTO(params.analysisId);
  const transactionId = mongooseIdDTO(params.transactionId);

  console.log('✅ [InvoicesController] IDs validados:', {
    analysisId,
    transactionId,
    analysisIdType: typeof analysisId,
    transactionIdType: typeof transactionId
  });

  try {
    const result = await invoicesService.updateTransactionInAnalysis(
      analysisId,
      transactionId,
      body,
    );

    console.log('✅ [InvoicesController] Transação atualizada com sucesso:', result);
    return reply.status(200).send(result);
  } catch (err) {
    console.error('❌ [InvoicesController] Erro ao atualizar transação:', err);
    return reply.status(400).send({
      error: 'Error updating transaction in analysis',
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

const deleteTransactionFromAnalysis = async (
  request: FastifyRequest<{
    Params: { analysisId: string; transactionId: string };
  }>,
  reply: FastifyReply,
) => {
  console.log('🗑️ [InvoicesController] Excluindo transação:', {
    analysisId: request.params.analysisId,
    transactionId: request.params.transactionId,
    paramsType: typeof request.params,
    analysisIdType: typeof request.params.analysisId,
    transactionIdType: typeof request.params.transactionId
  });

  const { params } = request;
  const analysisId = mongooseIdDTO(params.analysisId);
  const transactionId = mongooseIdDTO(params.transactionId);

  console.log('✅ [InvoicesController] IDs validados para exclusão:', {
    analysisId,
    transactionId,
    analysisIdType: typeof analysisId,
    transactionIdType: typeof transactionId
  });

  try {
    const result = await invoicesService.deleteTransactionFromAnalysis(
      analysisId,
      transactionId,
    );

    console.log('✅ [InvoicesController] Transação excluída com sucesso:', result);
    return reply.status(200).send(result);
  } catch (err) {
    console.error('❌ [InvoicesController] Erro ao excluir transação:', err);
    return reply.status(400).send({
      error: 'Error deleting transaction from analysis',
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export default {
  create,
  findAll,
  findOne,
  getAnalysis,
  update,
  deleteInvoice,
  deleteAll,
  uploadCsv,
  uploadPdf,
  updateInvoiceInAnalysis,
  updateTransactionInAnalysis,
  deleteTransactionFromAnalysis,
};
