import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AnalysisResultsProps {
  onClose: () => void;
  analytics?: Array<{ category: string; total: number }>;
  suggestion?: string;
  totalValue?: number;
}

export default function AnalysisResults({ onClose, analytics, suggestion, totalValue }: AnalysisResultsProps) {

  const generateSpendingAnalysis = (backendAnalytics?: Array<{ category: string; total: number }>, backendTotal?: number): string => {
    if (!backendAnalytics || backendAnalytics.length === 0) {
      return 'Nenhum dado de análise disponível.';
    }

    // Usar o valor total do backend se disponível, senão calcular
    const total = backendTotal ?? backendAnalytics.reduce((sum, item) => sum + item.total, 0);
    
    const highestCategory = backendAnalytics.reduce((max, item) => 
      item.total > max.total ? item : max, 
      { category: '', total: 0 }
    );
    
    return `Análise dos seus gastos:

💰 Total gasto: R$ ${total.toFixed(2)}

📊 Distribuição por categoria:
${backendAnalytics.map(item => `- ${item.category}: R$ ${item.total.toFixed(2)} (${((item.total/total)*100).toFixed(1)}%)`).join('\n')}

🔝 Maior gasto: ${highestCategory.category} (R$ ${highestCategory.total.toFixed(2)})`;
  };

  const analysisText = generateSpendingAnalysis(analytics, totalValue);

  // Usar analytics do backend - dados já processados pelo backend
  const categories: Record<string, number> = analytics && analytics.length > 0 
    ? analytics.reduce((acc: Record<string, number>, item: { category: string; total: number }) => {
        acc[item.category] = item.total;
        return acc;
      }, {} as Record<string, number>)
    : {};

  const chartData = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#8AC24A',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#8AC24A',
        ],
      },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Análise dos Seus Gastos</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Distribuição por Categoria</h3>
            <div className="h-64">
              <Pie data={chartData} />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Análise Financeira</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-line">{analysisText}</p>
            </div>
            
            {suggestion && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2 text-blue-600">💡 Sugestão Inteligente</h4>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <p className="text-blue-800 font-medium">{suggestion}</p>
                </div>
              </div>
            )}
            
          </div>
        </div>
        

      </div>
    </div>
  );
} 