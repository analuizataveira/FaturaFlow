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
  analyses: {
    CSV: Invoice[];
    PDF: Invoice[];
  };
}> => {
  const invoices = await invoicesRepository.findByUserId(userId);

  // Separar transações regulares das análises
  const regularInvoices = invoices.filter((invoice) => !invoice.invoiceName || !invoice.invoices);
  const analysisInvoices = invoices.filter((invoice) => invoice.invoiceName && invoice.invoices);

  // Processar transações regulares
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

  // Separar análises por tipo
  const csvAnalyses = analysisInvoices.filter((analysis) => analysis.category === 'Análise CSV');
  const pdfAnalyses = analysisInvoices.filter((analysis) => analysis.category === 'Análise PDF');

  return {
    ...result,
    analyses: {
      CSV: csvAnalyses,
      PDF: pdfAnalyses,
    },
  };
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

    const categoryTotals: Record<string, number> = {};
    for (const invoice of processedInvoices) {
      if (!categoryTotals[invoice.category]) {
        categoryTotals[invoice.category] = 0;
      }
      categoryTotals[invoice.category] += invoice.value;
    }

    const analytics = Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total: parseFloat(total.toFixed(2)),
    }));

    const totalValue = processedInvoices.reduce((sum, inv) => sum + inv.value, 0);
    const topCategory = analytics.reduce((max, current) =>
      current.total > max.total ? current : max,
    );

    const suggestion = `Analisando seus gastos de R$ ${totalValue.toFixed(2)}, vejo que a categoria "${topCategory.category}" representa a maior parte dos seus gastos (R$ ${topCategory.total.toFixed(2)}). Considere revisar se há oportunidades de economia nesta categoria ou se os valores estão dentro do esperado para seu orçamento mensal.`;

    const analysisDocument: Omit<Invoice, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      description: `Análise CSV: ${invoiceName || 'Upload CSV'}`,
      value: processedInvoices.reduce((sum, inv) => sum + inv.value, 0),
      category: 'Análise CSV',
      payment: 'Cartão de Crédito',
      userId,
      invoiceName: invoiceName || `CSV Upload ${new Date().toISOString().split('T')[0]}`,
      invoices: processedInvoices,
      analytics,
      suggestion,
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
    const referenceInvoices = await invoicesRepository.findUserUpdatedInvoices(userId);

    console.log('[PDF Analysis] Reference invoices found:', {
      count: referenceInvoices.length,
      referencesWithTransactions: referenceInvoices.filter(
        (inv) => inv.invoices && inv.invoices.some((i) => i.userUpdated),
      ).length,
    });

    // Extrai o texto do PDF
    const pdfData = await pdf(file);
    const text = pdfData.text;

    const chatGptResponse = await chatGptService.processNubankTransactions(
      text,
      userId,
      referenceInvoices,
    );

    console.log('[PDF Analysis] ChatGPT suggestion:', {
      suggestion: chatGptResponse.suggestion,
      analytics: chatGptResponse.analytics,
      totalTransactions: chatGptResponse.transactions.length,
    });

    let imported = 0;
    let errors = 0;
    const processedInvoices: Array<{
      date: string;
      description: string;
      value: number;
      category: string;
    }> = [];

    // Processa as transações (igual ao CSV - não salva individualmente)
    for (const invoiceData of chatGptResponse.transactions) {
      try {
        // Adicionar à lista de transações processadas para a análise
        processedInvoices.push({
          date: invoiceData.date,
          description: invoiceData.description,
          value: invoiceData.value,
          category: invoiceData.category,
        });

        imported++;
      } catch (error) {
        console.error('Erro ao processar invoice:', error);
        errors++;
      }
    }

    const totalValue = processedInvoices.reduce((sum, inv) => sum + inv.value, 0);

    const analysisDocument: Omit<Invoice, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      description: `Análise PDF: ${invoiceName || 'Upload PDF'}`,
      value: totalValue,
      category: 'Análise PDF',
      payment: 'Cartão de Crédito',
      userId,
      invoiceName: invoiceName || `PDF Upload ${new Date().toISOString().split('T')[0]}`,
      invoices: processedInvoices,
      analytics: chatGptResponse.analytics,
      suggestion: chatGptResponse.suggestion,
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

const updateTransactionInAnalysis = async (
  analysisId: string,
  transactionId: string,
  updateData: {
    description: string;
    value: number;
    category: string;
  },
) => {
  const updatedAnalysis = await invoicesRepository.updateTransactionInAnalysis(
    analysisId,
    transactionId,
    updateData,
  );

  if (!updatedAnalysis) {
    throw new NotFoundError('Erro ao atualizar transação na análise');
  }

  return updatedAnalysis;
};

const deleteTransactionFromAnalysis = async (analysisId: string, transactionId: string) => {
  const updatedAnalysis = await invoicesRepository.deleteTransactionFromAnalysis(
    analysisId,
    transactionId,
  );

  if (!updatedAnalysis) {
    throw new NotFoundError('Erro ao excluir transação da análise');
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
  updateTransactionInAnalysis,
  deleteTransactionFromAnalysis,
};
