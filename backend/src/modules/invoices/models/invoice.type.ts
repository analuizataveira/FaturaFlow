export type Invoice = {
  id: string;
  date: string;
  description: string;
  value: number;
  category: string;
  payment: string;
  userId: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
