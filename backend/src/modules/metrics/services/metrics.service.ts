import { NotFoundError } from '../../../shared/handlers/error-handler';
import { Metric } from '../models/metric.type';
import metricsRepository from '../repositories/metrics.repository';

const findById = async (id: string): Promise<Metric> => {
  const metric = await metricsRepository.findById(id);

  if (!metric) {
    throw new NotFoundError('Metric not found');
  }

  return metric;
};

const findByUserId = async (userId: string): Promise<Metric[]> => {
  const metrics = await metricsRepository.findByUserId(userId);
  return metrics;
};

const findByAnalysisId = async (analysisId: string): Promise<Metric> => {
  const metric = await metricsRepository.findByAnalysisId(analysisId);

  if (!metric) {
    throw new NotFoundError('Metric not found for this analysis');
  }

  return metric;
};

const deleteMetric = async (id: string): Promise<{ message: string }> => {
  const deleted = await metricsRepository.remove(id);

  if (!deleted) {
    throw new NotFoundError('Metric not found');
  }

  return { message: 'Metric successfully deleted' };
};

const deleteByUserId = async (userId: string): Promise<{ message: string }> => {
  const deleted = await metricsRepository.removeByUserId(userId);

  if (!deleted) {
    throw new NotFoundError('Metrics not found');
  }

  return { message: 'Metrics successfully deleted' };
};

// Funções de análise agregada
const getAggregatedMetrics = async (userId: string) => {
  const metrics = await metricsRepository.findByUserId(userId);

  if (metrics.length === 0) {
    return null;
  }

  const totalAnalyses = metrics.length;
  const totalTransactionsProcessed = metrics.reduce((sum, m) => sum + m.totalTransactions, 0);
  const totalValueProcessed = metrics.reduce((sum, m) => sum + m.totalValue, 0);

  // Métricas de performance agregadas
  const avgProcessingTime =
    metrics.reduce((sum, m) => sum + m.performance.totalProcessingTimeMs, 0) / totalAnalyses;
  const avgOpenaiTime =
    metrics.reduce((sum, m) => sum + m.performance.openaiTimeMs, 0) / totalAnalyses;
  const avgTokensUsed = metrics.reduce((sum, m) => sum + m.usage.totalTokens, 0) / totalAnalyses;

  // Estatísticas de categorização
  const totalCategorizationComparisons = metrics.reduce((sum, m) => {
    return sum + m.transactions.filter((t) => t.categorizedByUser !== undefined).length;
  }, 0);

  const categorizationAccuracy =
    totalCategorizationComparisons > 0
      ? metrics.reduce((sum, m) => {
          const matches = m.transactions.filter(
            (t) => t.categorizedByUser && t.categorizedByAI === t.categorizedByUser,
          ).length;
          return sum + matches;
        }, 0) / totalCategorizationComparisons
      : null;

  // Modelos mais usados
  const modelUsage = metrics.reduce((acc: Record<string, number>, m) => {
    acc[m.model] = (acc[m.model] || 0) + 1;
    return acc;
  }, {});

  return {
    totalAnalyses,
    totalTransactionsProcessed,
    totalValueProcessed,
    performance: {
      avgProcessingTimeMs: Math.round(avgProcessingTime),
      avgOpenaiTimeMs: Math.round(avgOpenaiTime),
      avgTokensUsed: Math.round(avgTokensUsed),
    },
    categorization: {
      totalComparisons: totalCategorizationComparisons,
      accuracyPercent: categorizationAccuracy
        ? Math.round(categorizationAccuracy * 100 * 100) / 100
        : null,
    },
    modelUsage,
    metrics, // Retornar todas as métricas também
  };
};

// Comparação entre categorização da IA vs Usuário
const getCategorizationComparison = async (analysisId: string) => {
  const metric = await metricsRepository.findByAnalysisId(analysisId);

  if (!metric) {
    throw new NotFoundError('Metric not found for this analysis');
  }

  const comparisons = metric.transactions
    .filter((t) => t.categorizedByUser !== undefined)
    .map((t) => ({
      description: t.description,
      aiCategory: t.categorizedByAI,
      userCategory: t.categorizedByUser,
      match: t.categorizedByAI === t.categorizedByUser,
    }));

  const matches = comparisons.filter((c) => c.match).length;
  const accuracy = comparisons.length > 0 ? (matches / comparisons.length) * 100 : 0;

  return {
    analysisId,
    totalComparisons: comparisons.length,
    matches,
    mismatches: comparisons.length - matches,
    accuracyPercent: Math.round(accuracy * 100) / 100,
    comparisons,
  };
};

export default {
  findById,
  findByUserId,
  findByAnalysisId,
  deleteMetric,
  deleteByUserId,
  getAggregatedMetrics,
  getCategorizationComparison,
};
