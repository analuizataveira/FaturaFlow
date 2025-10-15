import { FilterQuery } from 'mongoose';
import { Invoice } from '../models/invoice.type';
import { InvoiceModel } from '../models/invoice.model';
import mongoose from 'mongoose';

const create = async (invoice: Omit<Invoice, 'id'>): Promise<Invoice> => {
  const createdInvoice = await InvoiceModel.create(invoice);
  return {
    ...invoice,
    id: createdInvoice._id.toString(),
  };
};

const findById = async (id: string): Promise<Invoice | null> => {
  const invoice = await InvoiceModel.findById(id).lean();

  if (!invoice) {
    return null;
  }

  return {
    ...invoice,
    id: invoice._id.toString(),
  } as Invoice;
};

const findAll = async (filter: FilterQuery<Invoice> = {}): Promise<Invoice[]> => {
  const invoices = await InvoiceModel.find(filter).lean();

  return invoices.map((invoice) => ({
    ...invoice,
    id: invoice._id.toString(),
  })) as Invoice[];
};

const findByUserId = async (userId: string): Promise<Invoice[]> => {
  return findAll({ userId });
};

const update = async (id: string, data: Partial<Invoice>): Promise<Invoice | null> => {
  const updatedInvoice = await InvoiceModel.findByIdAndUpdate(id, data, {
    new: true,
  }).lean();

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

const removeAllByUserId = async (userId: string): Promise<boolean> => {
  const result = await InvoiceModel.deleteMany({ userId }).lean();
  return result.deletedCount > 0;
};

const updateInvoiceInArray = async (
  analysisId: string,
  invoiceIndex: number,
  updateData: {
    date?: string;
    description?: string;
    value?: number;
    category?: string;
  },
): Promise<Invoice | null> => {
  const updateQuery: Record<string, any> = {};

  Object.keys(updateData).forEach((key) => {
    updateQuery[`invoices.${invoiceIndex}.${key}`] = updateData[key as keyof typeof updateData];
  });

  const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
    analysisId,
    { $set: updateQuery },
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

const updateTransactionInAnalysis = async (
  analysisId: string,
  transactionId: string,
  updateData: {
    description: string;
    value: number;
    category: string;
  },
) => {
  console.log('📝 [InvoicesRepository] Atualizando transação:', {
    analysisId,
    transactionId,
    updateData,
    transactionIdType: typeof transactionId,
    transactionIdValue: transactionId
  });

  try {
    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
      analysisId,
      {
        $set: {
          'invoices.$[elem].description': updateData.description,
          'invoices.$[elem].value': updateData.value,
          'invoices.$[elem].category': updateData.category,
        },
      },
      {
        arrayFilters: [{ 'elem._id': new mongoose.Types.ObjectId(transactionId) }],
        new: true,
      },
    ).lean();

    if (!updatedInvoice) {
      console.error('❌ [InvoicesRepository] Análise não encontrada:', analysisId);
      return null;
    }

    // Recalcular o valor total baseado nas transações atualizadas
    const newTotalValue = updatedInvoice.invoices?.reduce((sum, invoice) => sum + invoice.value, 0) || 0;
    
    // Atualizar o valor total da análise
    const finalInvoice = await InvoiceModel.findByIdAndUpdate(
      analysisId,
      { value: newTotalValue },
      { new: true }
    ).lean();

    if (!finalInvoice) {
      console.error('❌ [InvoicesRepository] Erro ao atualizar valor total da análise:', analysisId);
      return null;
    }

    console.log('✅ [InvoicesRepository] Transação atualizada e valor total recalculado:', {
      newTotalValue,
      totalTransactions: updatedInvoice.invoices?.length || 0
    });

    return {
      ...finalInvoice,
      id: finalInvoice._id.toString(),
    } as Invoice;
  } catch (error) {
    console.error('❌ [InvoicesRepository] Erro ao atualizar transação:', {
      error: error instanceof Error ? error.message : error,
      analysisId,
      transactionId,
      updateData
    });
    throw error;
  }
};

const deleteTransactionFromAnalysis = async (
  analysisId: string,
  transactionId: string,
) => {
  console.log('🗑️ [InvoicesRepository] Excluindo transação:', {
    analysisId,
    transactionId
  });

  try {
    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
      analysisId,
      {
        $pull: {
          invoices: { _id: new mongoose.Types.ObjectId(transactionId) },
        },
      },
      { new: true },
    ).lean();

    if (!updatedInvoice) {
      console.error('❌ [InvoicesRepository] Análise não encontrada:', analysisId);
      return null;
    }

    // Recalcular o valor total baseado nas transações restantes
    const newTotalValue = updatedInvoice.invoices?.reduce((sum, invoice) => sum + invoice.value, 0) || 0;
    
    // Atualizar o valor total da análise
    const finalInvoice = await InvoiceModel.findByIdAndUpdate(
      analysisId,
      { value: newTotalValue },
      { new: true }
    ).lean();

    if (!finalInvoice) {
      console.error('❌ [InvoicesRepository] Erro ao atualizar valor total da análise:', analysisId);
      return null;
    }

    console.log('✅ [InvoicesRepository] Transação excluída e valor total recalculado:', {
      newTotalValue,
      remainingTransactions: updatedInvoice.invoices?.length || 0
    });

    return {
      ...finalInvoice,
      id: finalInvoice._id.toString(),
    } as Invoice;
  } catch (error) {
    console.error('❌ [InvoicesRepository] Erro ao excluir transação:', {
      error: error instanceof Error ? error.message : error,
      analysisId,
      transactionId
    });
    throw error;
  }
};

export default {
  create,
  findById,
  findAll,
  findByUserId,
  update,
  remove,
  removeAllByUserId,
  updateInvoiceInArray,
  updateTransactionInAnalysis,
  deleteTransactionFromAnalysis,
};
