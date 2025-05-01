import { NotFoundError } from "../../../shared/handlers/error-handler";
import { Invoice } from "../models/invoice.type";
import invoicesRepository from "../repositories/invoices.repository";

const create = async (invoiceData: Omit<Invoice, "id">): Promise<Invoice> => {
  return await invoicesRepository.create(invoiceData);
};

const findById = async (id: string): Promise<Invoice> => {
  const invoice = await invoicesRepository.findById(id);

  if (!invoice) {
    throw new NotFoundError("Fatura não encontrada");
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
      acc.totalAmount += invoice.value;
      if (!acc.categories[invoice.category]) {
        acc.categories[invoice.category] = {
          totalAmount: 0,
          details: [],
        };
      }
      acc.categories[invoice.category].totalAmount += invoice.value;
      acc.categories[invoice.category].details.push(invoice);
      return acc;
    },
    {
      totalAmount: 0,
      categories: {} as Record<
        string,
        { totalAmount: number; details: Invoice[] }
      >,
    },
  );

  return result;
};

const update = async (
  id: string,
  data: Omit<Invoice, "id">,
): Promise<Invoice> => {
  const updatedInvoice = await invoicesRepository.update(id, data);

  if (!updatedInvoice) {
    throw new NotFoundError("Fatura não encontrada");
  }

  return updatedInvoice;
};

const deleteInvoice = async (id: string): Promise<{ message: string }> => {
  const deleted = await invoicesRepository.remove(id);

  if (!deleted) {
    throw new NotFoundError("Fatura não encontrada");
  }

  return { message: "Fatura deletada com sucesso" };
};

// Deletar tuo pelo userid
const deleteByUserId = async (userId: string): Promise<{ message: string }> => {
  const deleted = await invoicesRepository.removeAllByUserId(userId);

  if (!deleted) {
    throw new NotFoundError("Faturas não encontradas");
  }

  return { message: "Faturas deletadas com sucesso" };
};

export default {
  create,
  findById,
  findByUserId,
  update,
  deleteInvoice,
  deleteByUserId,
};
