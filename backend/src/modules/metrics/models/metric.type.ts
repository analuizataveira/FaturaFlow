export type MetricTransaction = {
  date: string;
  description: string;
  value: number;
  categorizedByAI: string;
  categorizedByUser?: string;
  payment: string;
};

export type MetricAnalytics = {
  category: string;
  total: number;
};

export type MetricPerformance = {
  totalProcessingTimeMs: number;
  totalProcessingTimeSeconds: number;
  openaiTimeMs: number;
  openaiTimeSeconds: number;
  promptTimeMs: number;
  promptLength: number;
  textLength: number;
  avgTimePerTransaction: number;
  transactionsPerSecond: number;
  openaiEfficiencyPercent: number;
};

export type MetricUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

export type Metric = {
  id: string;
  userId: string;
  analysisId: string; // ID da análise na collection de invoices
  invoiceName: string;

  // Dados da análise
  totalValue: number;
  totalTransactions: number;
  transactions: MetricTransaction[];
  analytics: MetricAnalytics[];
  suggestion: string;

  // Métricas do ChatGPT
  model: string;
  maxTokens: number;
  temperature: number;
  usage: MetricUsage;
  performance: MetricPerformance;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
};
