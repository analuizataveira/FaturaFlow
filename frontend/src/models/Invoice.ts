// models/Invoice.ts
export interface Invoice {
  _id?: string; 
  date: string;
  description: string;
  value: number; 
  category: string;
  payment: string;
  userId: string; 
}