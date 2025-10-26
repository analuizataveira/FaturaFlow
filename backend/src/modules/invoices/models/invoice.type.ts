export type AnalyticsData = {
  category: string;
  total: number;
};

export type Invoice = {
  id: string;
  date: string;
  description: string;
  value: number;
  category: string;
  payment: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  invoiceName?: string;
  invoices?: Array<{
    date: string;
    description: string;
    value: number;
    category: string;
    userUpdated?: boolean;
  }>;
  userUpdated?: boolean;
  analytics?: AnalyticsData[];
  suggestion?: string;
};
