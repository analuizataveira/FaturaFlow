export type ListOf<T> = {
  data: T[];
  totalCount: number;
};

export type Query = {
  skip: number;
  take: number;
  orderBy?: string;
  orderType?: 'asc' | 'desc';
  search?: string;
};
