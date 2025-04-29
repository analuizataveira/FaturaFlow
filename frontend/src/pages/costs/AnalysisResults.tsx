import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface AnalysisResultsProps {
  transactions: Transaction[];
  onClose: () => void;
}

export default function AnalysisResults({ transactions, onClose }: AnalysisResultsProps) {
  // Função para gerar a análise de gastos
  const generateSpendingAnalysis = (transactions: Transaction[]): string => {
    // Calcular totais por categoria
    const categories = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Calcular total geral
    const total = Object.values(categories).reduce((sum, amount) => sum + amount, 0);
    
    // Encontrar categoria com maior gasto
    const highestCategory = Object.entries(categories).reduce((max, [category, amount]) => 
      amount > max.amount ? { category, amount } : max, 
      { category: '', amount: 0 }
    );
    
    // Gerar texto de análise
    return `Análise dos seus gastos:

📅 Período: ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
💰 Total gasto: R$ ${total.toFixed(2)}

📊 Distribuição por categoria:
${Object.entries(categories).map(([cat, val]) => `- ${cat}: R$ ${val.toFixed(2)} (${((val/total)*100).toFixed(1)}%)`).join('\n')}

🔝 Maior gasto: ${highestCategory.category} (R$ ${highestCategory.amount.toFixed(2)})

💡 Recomendações:
1️⃣ Considere reduzir gastos em ${highestCategory.category}
2️⃣ Revise pequenas despesas que somam grandes valores
3️⃣ Compare com meses anteriores para identificar padrões"`;

  };

  // Gerar a análise
  const analysisText = generateSpendingAnalysis(transactions);

  // Agrupar transações por categoria para o gráfico
  const categories = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = 0;
    }
    acc[transaction.category] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  // Preparar dados para o gráfico
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
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose} 
            className="btn btn-primary"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}