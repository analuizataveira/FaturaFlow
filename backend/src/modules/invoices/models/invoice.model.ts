import mongoose, { Schema } from 'mongoose';
import { Invoice } from './invoice.type';

const invoiceSchema = new Schema<Invoice>(
  {
    date: { type: String, required: true },
    description: { type: String, required: true },
    value: { type: Number, required: true },
    category: { type: String, required: true },
    payment: { type: String, required: true },
    userId: { type: String, required: true },
    // Campos para análise (CSV/PDF)
    invoiceName: { type: String },
    invoices: [
      {
        date: { type: String, required: true },
        description: { type: String, required: true },
        value: { type: Number, required: true },
        category: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const InvoiceModel = mongoose.model<Invoice>('Invoice', invoiceSchema);
