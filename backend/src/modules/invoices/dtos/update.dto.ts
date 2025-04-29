import { z } from "zod";

const createSchema = z.object({
  date: z.string().min(1, "Date is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  value: z.number().positive("Value must be a positive number").optional(),
  category: z.string().min(1, "Category is required").optional(),
  payment: z.string().min(1, "Payment method is required").optional(),
  userId: z.string().min(1, "UserId is required"),
});

export function createInvoiceDTO(invoice: unknown) {
  const parsedInvoice = createSchema.parse(invoice);

  return parsedInvoice;
}
