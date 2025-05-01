import { FilterQuery } from "mongoose";
import { Invoice } from "../models/invoice.type";
import { InvoiceModel } from "../models/invoice.model";

const create = async (invoice: Omit<Invoice, "id">): Promise<Invoice> => {
  const createdInvoice = await InvoiceModel.create(invoice);
  return {
    ...invoice,
    id: createdInvoice._id.toString(),
  };
};

const findById = async (id: string): Promise<Invoice | null> => {
  const invoice = await InvoiceModel.findOne({
    _id: id,
    isDeleted: false,
  }).lean();

  if (!invoice) {
    return null;
  }

  return {
    ...invoice,
    id: invoice._id.toString(),
  } as Invoice;
};

const findAll = async (
  filter: FilterQuery<Invoice> = {},
): Promise<Invoice[]> => {
  const invoices = await InvoiceModel.find({
    ...filter,
    isDeleted: false,
  }).lean();

  return invoices.map((invoice) => ({
    ...invoice,
    id: invoice._id.toString(),
  })) as Invoice[];
};

const findByUserId = async (userId: string): Promise<Invoice[]> => {
  return findAll({ userId });
};

const update = async (
  id: string,
  data: Partial<Invoice>,
): Promise<Invoice | null> => {
  const updatedInvoice = await InvoiceModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    { new: true },
  ).lean();

  if (!updatedInvoice) {
    return null;
  }

  return {
    ...updatedInvoice,
    id: updatedInvoice._id.toString(),
  } as Invoice;
};

const remove = async (id: string): Promise<boolean> => {
  const result = await InvoiceModel.deleteOne({ _id: id }).lean();
  return result.deletedCount === 1;
};

// Função para deletar todos os invoices de um usuário
const removeAllByUserId = async (userId: string): Promise<boolean> => {
  const result = await InvoiceModel.deleteMany({ userId }).lean();
  return result.deletedCount > 0;
};

export default {
  create,
  findById,
  findAll,
  findByUserId,
  update,
  remove,
  removeAllByUserId,
};
