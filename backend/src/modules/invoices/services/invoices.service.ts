import { NotFoundError } from '../../../shared/handlers/error-handler';
import { Invoice } from '../models/invoice.type';
import invoicesRepository from '../repositories/invoices.repository';
import { CsvInvoiceData, parseCsvRowDTO } from '../dtos/upload-csv.dto';
import chatGptService from '../../../shared/services/chatgpt.service';
import { parse } from 'csv-parse/sync';
import pdf from 'pdf-parse';

const create = async (invoiceData: Omit<Invoice, 'id'>): Promise<Invoice> => {
  return await invoicesRepository.create(invoiceData);
};

const findById = async (id: string): Promise<Invoice> => {
  const invoice = await invoicesRepository.findById(id);

  if (!invoice) {
    throw new NotFoundError('Invoice not found');
  }

  return invoice;
};

const findByUserId = async (
  userId: string,
): Promise<{
  totalAmount: number;
  categories: Record<string, { totalAmount: number; details: Invoice[] }>;
}> => {
  const invoices = await invoicesRepository.findByUserId(userId);

  // Filter out analysis documents (CSV and PDF analyses)
  const regularInvoices = invoices.filter((invoice) => !invoice.invoiceName || !invoice.invoices);

  const result = regularInvoices.reduce(
    (acc, invoice) => {
      acc.totalAmount = parseFloat((acc.totalAmount + invoice.value).toFixed(2));
      if (!acc.categories[invoice.category]) {
        acc.categories[invoice.category] = {
          totalAmount: 0,
          details: [],
        };
      }
      acc.categories[invoice.category].totalAmount = parseFloat(
        (acc.categories[invoice.category].totalAmount + invoice.value).toFixed(2),
      );
      acc.categories[invoice.category].details.push(invoice);
      return acc;
    },
    {
      totalAmount: 0,
      categories: {} as Record<string, { totalAmount: number; details: Invoice[] }>,
    },
  );

  return result;
};

const update = async (id: string, data: Omit<Invoice, 'id'>): Promise<Invoice> => {
  const updatedInvoice = await invoicesRepository.update(id, data);

  if (!updatedInvoice) {
    throw new NotFoundError('Invoice not found');
  }

  return updatedInvoice;
};

const deleteInvoice = async (id: string): Promise<{ message: string }> => {
  const deleted = await invoicesRepository.remove(id);

  if (!deleted) {
    throw new NotFoundError('Invoice not found');
  }

  return { message: 'Invoice successfully deleted' };
};

const deleteByUserId = async (userId: string): Promise<{ message: string }> => {
  const deleted = await invoicesRepository.removeAllByUserId(userId);

  if (!deleted) {
    throw new NotFoundError('Invoices not found');
  }

  return { message: 'Invoices successfully deleted' };
};

const uploadCsv = async (
  file: Buffer,
  userId: string,
  invoiceName?: string,
): Promise<{ success: boolean; imported: number; errors: number; analysisId: string }> => {
  try {
    const records = parse(file, {
      columns: true,
      skip_empty_lines: true,
    }) as CsvInvoiceData[];

    let imported = 0;
    let errors = 0;
    const processedInvoices: Array<{
      date: string;
      description: string;
      value: number;
      category: string;
    }> = [];

    for (const record of records) {
      try {
        const invoiceData = parseCsvRowDTO(record, userId);
        processedInvoices.push({
          date: invoiceData.date,
          description: invoiceData.description,
          value: invoiceData.value,
          category: invoiceData.category,
        });
        imported++;
      } catch {
        errors++;
      }
    }

    // Criar documento de análise
    const analysisDocument: Omit<Invoice, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      description: `Análise CSV: ${invoiceName || 'Upload CSV'}`,
      value: processedInvoices.reduce((sum, inv) => sum + inv.value, 0),
      category: 'Análise CSV',
      payment: 'Cartão de Crédito',
      userId,
      invoiceName: invoiceName || `CSV Upload ${new Date().toISOString().split('T')[0]}`,
      invoices: processedInvoices,
    };

    const savedAnalysis = await invoicesRepository.create(analysisDocument);

    return {
      success: true,
      imported,
      errors,
      analysisId: savedAnalysis.id,
    };
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new Error('Error processing the CSV file: ' + error.message);
  }
};

const uploadPdf = async (
  file: Buffer,
  userId: string,
  invoiceName?: string,
): Promise<{
  success: boolean;
  imported: number;
  errors: number;
  summary?: any;
  analysisId: string;
}> => {
  try {
    // Extrai o texto do PDF
    const pdfData = await pdf(file);
    const text = pdfData.text;

    // Envia o texto para o ChatGPT processar
    const chatGptResponse = await chatGptService.processNubankTransactions(text, userId);

    let imported = 0;
    let errors = 0;
    const processedInvoices: Array<{
      date: string;
      description: string;
      value: number;
      category: string;
    }> = [];

    // Processa as transações
    for (const invoiceData of chatGptResponse.transactions) {
      try {
        processedInvoices.push({
          date: invoiceData.date,
          description: invoiceData.description,
          value: invoiceData.value,
          category: invoiceData.category,
        });
        imported++;
      } catch (error) {
        console.error('Error processing invoice:', error);
        errors++;
      }
    }

    // Criar documento de análise
    const analysisDocument: Omit<Invoice, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      description: `Análise PDF: ${invoiceName || 'Upload PDF'}`,
      value: processedInvoices.reduce((sum, inv) => sum + inv.value, 0),
      category: 'Análise PDF',
      payment: 'Cartão de Crédito',
      userId,
      invoiceName: invoiceName || `PDF Upload ${new Date().toISOString().split('T')[0]}`,
      invoices: processedInvoices,
    };

    const savedAnalysis = await invoicesRepository.create(analysisDocument);

    return {
      success: true,
      imported,
      errors,
      summary: chatGptResponse.summary,
      analysisId: savedAnalysis.id,
    };
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new Error('Error processing the PDF file: ' + error.message);
  }
};

// Métodos para análises (CSV e PDF)
const getAnalyses = async (userId: string): Promise<Invoice[]> => {
  const invoices = await invoicesRepository.findByUserId(userId);
  return invoices.filter((invoice) => invoice.invoiceName && invoice.invoices);
};

const getCsvAnalyses = async (userId: string): Promise<Invoice[]> => {
  const analyses = await getAnalyses(userId);
  return analyses.filter((analysis) => analysis.category === 'Análise CSV');
};

const getPdfAnalyses = async (userId: string): Promise<Invoice[]> => {
  const analyses = await getAnalyses(userId);
  return analyses.filter((analysis) => analysis.category === 'Análise PDF');
};

const getAnalysis = async (id: string): Promise<Invoice> => {
  const analysis = await invoicesRepository.findById(id);

  if (!analysis) {
    throw new NotFoundError('Análise não encontrada');
  }

  if (!analysis.invoiceName || !analysis.invoices) {
    throw new NotFoundError('Documento não é uma análise');
  }

  return analysis;
};

const updateInvoiceInAnalysis = async (
  analysisId: string,
  invoiceIndex: number,
  updateData: {
    date?: string;
    description?: string;
    value?: number;
    category?: string;
  },
): Promise<Invoice> => {
  const analysis = await getAnalysis(analysisId);

  if (!analysis.invoices || invoiceIndex >= analysis.invoices.length) {
    throw new NotFoundError('Índice de invoice inválido');
  }

  const updatedAnalysis = await invoicesRepository.updateInvoiceInArray(
    analysisId,
    invoiceIndex,
    updateData,
  );

  if (!updatedAnalysis) {
    throw new NotFoundError('Erro ao atualizar invoice na análise');
  }

  return updatedAnalysis;
};

export default {
  create,
  findById,
  findByUserId,
  update,
  deleteInvoice,
  deleteByUserId,
  uploadCsv,
  uploadPdf,
  // Analysis methods
  getAnalyses,
  getCsvAnalyses,
  getPdfAnalyses,
  getAnalysis,
  updateInvoiceInAnalysis,
};
