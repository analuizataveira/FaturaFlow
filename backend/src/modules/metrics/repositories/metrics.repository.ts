import { MetricModel } from '../models/metric.model';
import { Metric } from '../models/metric.type';

const create = async (
  metricData: Omit<Metric, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Metric> => {
  const metric = new MetricModel(metricData);
  const savedMetric = await metric.save();
  return {
    ...savedMetric.toObject(),
    id: savedMetric._id.toString(),
  };
};

const findById = async (id: string): Promise<Metric | null> => {
  const metric = await MetricModel.findById(id);
  if (!metric) return null;

  return {
    ...metric.toObject(),
    id: metric._id.toString(),
  };
};

const findByUserId = async (userId: string): Promise<Metric[]> => {
  const metrics = await MetricModel.find({ userId }).sort({ createdAt: -1 });
  return metrics.map((metric) => ({
    ...metric.toObject(),
    id: metric._id.toString(),
  }));
};

const findByAnalysisId = async (analysisId: string): Promise<Metric | null> => {
  const metric = await MetricModel.findOne({ analysisId });
  if (!metric) return null;

  return {
    ...metric.toObject(),
    id: metric._id.toString(),
  };
};

const updateTransactionCategory = async (
  analysisId: string,
  transactionIndex: number,
  categorizedByUser: string,
): Promise<Metric | null> => {
  const updateField = 'transactions.' + transactionIndex + '.categorizedByUser';
  const existsField = 'transactions.' + transactionIndex;

  const metric = await MetricModel.findOneAndUpdate(
    {
      analysisId,
      [existsField]: { $exists: true },
    },
    {
      $set: {
        [updateField]: categorizedByUser,
      },
    },
    { new: true },
  );

  if (!metric) return null;
  await metric.save();

  console.log('metric after update', metric['transactions'][transactionIndex]);
  return {
    ...metric.toObject(),
    id: metric._id.toString(),
  };
};

const remove = async (id: string): Promise<boolean> => {
  const result = await MetricModel.findByIdAndDelete(id);
  return !!result;
};

const removeByUserId = async (userId: string): Promise<boolean> => {
  const result = await MetricModel.deleteMany({ userId });
  return result.deletedCount > 0;
};

const removeByAnalysisId = async (analysisId: string): Promise<boolean> => {
  const result = await MetricModel.findOneAndDelete({ analysisId });
  return !!result;
};

const removeTransactionFromMetric = async (
  analysisId: string,
  transactionIndex: number,
): Promise<Metric | null> => {
  const metric = await MetricModel.findOne({ analysisId });
  if (!metric) return null;

  if (metric.transactions && transactionIndex < metric.transactions.length) {
    metric.transactions.splice(transactionIndex, 1);

    metric.totalTransactions = metric.transactions.length;

    metric.totalValue = metric.transactions.reduce((sum, t) => sum + t.value, 0);

    await metric.save();
  }

  return {
    ...metric.toObject(),
    id: metric._id.toString(),
  };
};

export default {
  create,
  findById,
  findByUserId,
  findByAnalysisId,
  updateTransactionCategory,
  remove,
  removeByUserId,
  removeByAnalysisId,
  removeTransactionFromMetric,
};
