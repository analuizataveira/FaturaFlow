import { MultipartFile } from '@fastify/multipart';

export const validateCsvDTO = (file: MultipartFile): { isValid: boolean; message?: string } => {
  if (!file) {
    return { isValid: false, message: 'No file provided' };
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (file.mimetype !== 'text/csv') {
    return { isValid: false, message: 'The file must be a CSV' };
  }

  return { isValid: true };
};

export type CsvInvoiceData = {
  date: string;
  title: string;
  amount: string;
};

export const parseCsvRowDTO = (row: CsvInvoiceData, userId: string) => {
  return {
    date: row.date,
    description: row.title,
    value: parseFloat(parseFloat(row.amount).toFixed(2)),
    category: 'Others',
    payment: 'card',
    userId: userId,
  };
};
