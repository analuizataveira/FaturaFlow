interface CategoryDetails {
  totalAmount: number;
  details: Invoice[];
}

export interface InvoicesResponse {
  totalAmount: number;
  categories: Record<string, CategoryDetails>;
}

export interface CsvUploadResponse {
  message: string;
  invoicesCreated: number;
}

export interface Invoice {
  _id?: string; 
  date: string;
  description: string;
  value: number; 
  category: string;
  payment: string;
  userId: string; 
}