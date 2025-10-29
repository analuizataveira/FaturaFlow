import mongoose, { Schema } from 'mongoose';
import { Metric } from './metric.type';

const metricSchema = new Schema<Metric>(
  {
    userId: { type: String, required: true, index: true },
    analysisId: { type: String, required: true, index: true },
    invoiceName: { type: String, required: true },

    // Dados da análise
    totalValue: { type: Number, required: true },
    totalTransactions: { type: Number, required: true },
    transactions: [
      {
        date: { type: String, required: true },
        description: { type: String, required: true },
        value: { type: Number, required: true },
        categorizedByAI: { type: String, required: true },
        categorizedByUser: { type: String },
        payment: { type: String, required: true },
      },
    ],
    analytics: [
      {
        category: { type: String, required: true },
        total: { type: Number, required: true },
      },
    ],
    suggestion: { type: String, required: true },

    // Métricas do ChatGPT
    model: { type: String, required: true },
    maxTokens: { type: Number, required: true },
    temperature: { type: Number, required: true },
    usage: {
      promptTokens: { type: Number, required: true },
      completionTokens: { type: Number, required: true },
      totalTokens: { type: Number, required: true },
    },
    performance: {
      totalProcessingTimeMs: { type: Number, required: true },
      totalProcessingTimeSeconds: { type: Number, required: true },
      openaiTimeMs: { type: Number, required: true },
      openaiTimeSeconds: { type: Number, required: true },
      promptTimeMs: { type: Number, required: true },
      promptLength: { type: Number, required: true },
      textLength: { type: Number, required: true },
      avgTimePerTransaction: { type: Number, required: true },
      transactionsPerSecond: { type: Number, required: true },
      openaiEfficiencyPercent: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const MetricModel = mongoose.model<Metric>('Metric', metricSchema);
