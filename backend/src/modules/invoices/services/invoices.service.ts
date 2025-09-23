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

  const result = invoices.reduce(
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
): Promise<{ success: boolean; imported: number; errors: number }> => {
  try {
    const records = parse(file, {
      columns: true,
      skip_empty_lines: true,
    }) as CsvInvoiceData[];

    let imported = 0;
    let errors = 0;

    for (const record of records) {
      try {
        const invoiceData = parseCsvRowDTO(record, userId);
        await invoicesRepository.create(invoiceData);
        imported++;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        errors++;
      }
    }

    return {
      success: true,
      imported,
      errors,
    };
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new Error('Error processing the CSV file: ' + error.message);
  }
};

const uploadPdf = async (
  file: Buffer,
  userId: string,
): Promise<{ success: boolean; imported: number; errors: number; summary?: any }> => {
  try {
    // Extrai o texto do PDF
    const pdfData = await pdf(file);
    const text = pdfData.text;

    // Envia o texto para o ChatGPT processar
    const chatGptResponse = await chatGptService.processNubankTransactions(text, userId);

    let imported = 0;
    let errors = 0;

    console.log('ChatGPT response:', chatGptResponse);
    // Salva as transações no banco de dados
    for (const invoiceData of chatGptResponse.transactions) {
      try {
        await invoicesRepository.create(invoiceData);
        imported++;
      } catch (error) {
        console.error('Error creating invoice:', error);
        errors++;
      }
    }

    return {
      success: true,
      imported,
      errors,
      summary: chatGptResponse.summary,
    };
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new Error('Error processing the PDF file: ' + error.message);
  }
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
};
