import { useState } from 'react';
import NavBar from "../../components/Navbar";
import Modal from "../../components/Modal";
import { Transaction } from '../../models/Transaction';
import AnalysisResults from './AnalysisResults';
import CostsList from './CostsList';

export default function CostsForm() {
  const [showHelpModal, setShowHelpModal] = useState(() => {
    const hasSeenHelp = localStorage.getItem('hasSeenCostsHelp');
    return hasSeenHelp !== 'true';
  });
  
  const handleDeleteTransaction = (index: number) => {
    setTransactionsList(prev => prev.filter((_, i) => i !== index));
  };

  const [transaction, setTransaction] = useState<Transaction>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    category: 'Alimentação',
    paymentMethod: 'Crédito'
  });

  const [transactionsList, setTransactionsList] = useState<Transaction[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransactionsList([...transactionsList, transaction]);
    setTransaction({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: 0,
      category: 'Alimentação',
      paymentMethod: 'Crédito'
    });
  };

  const handleCloseHelp = () => {
    setShowHelpModal(false);
    localStorage.setItem('hasSeenCostsHelp', 'true');
  };

  const handleSaveAll = async () => {
    if (transactionsList.length === 0) return;
    
    setIsSaving(true);
    
    try {
      // Simulação de chamada API para salvar
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowAnalysis(true);
    } catch (error) {
      console.error("Erro ao salvar transações:", error);
      alert("Ocorreu um erro ao salvar as transações. Por favor, tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <NavBar page="" />
      
      {/* Modal de Análise */}
      {showAnalysis && (
        <AnalysisResults 
          transactions={transactionsList}
          onClose={() => setShowAnalysis(false)}
        />
      )}
      
      {/* Modal de Ajuda */}
      <Modal
        modalId="help-modal"
        isClose={!showHelpModal}
        onCloseClick={handleCloseHelp}
        width="w-full max-w-3xl"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700">Como usar a página de inserção manual</h2>
          
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-800">1. Adicionar Transações</h3>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                <li>Preencha <strong>todos os campos</strong> do formulário à esquerda</li>
                <li>Selecione a <strong>categoria adequada</strong> para cada gasto</li>
                <li>Clique em <strong>"Adicionar Transação"</strong> para salvar</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">2. Visualização</h3>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                <li>Todas as transações aparecerão na <strong>tabela à direita</strong></li>
                <li>Você pode ver os <strong>detalhes completos</strong> de cada transação</li>
                <li>As transações ficam salvas <strong>temporariamente</strong> até você sair da página</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">3. Salvar Tudo</h3>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                <li>Quando terminar, clique em <strong>"Salvar Todas as Transações"</strong></li>
                <li>Isso enviará todos os dados para o <strong>sistema permanentemente</strong></li>
                <li>Você receberá uma <strong>análise detalhada</strong> com gráficos e recomendações</li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Inserção Manual de Custos</h1>
          <button 
            className="btn btn-ghost text-indigo-600 hover:bg-indigo-50"
            onClick={() => setShowHelpModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ajuda
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de Inserção */}
          <div className="card bg-base-100 shadow-xl border border-gray-100">
            <div className="card-body">
              <h2 className="card-title text-gray-700">Nova movimentação financeira</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Data</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={transaction.date}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Descrição</span>
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={transaction.description}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="Onde foi realizado o gasto"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Valor (R$)</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={transaction.amount || ''}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Categoria</span>
                  </label>
                  <select
                    name="category"
                    value={transaction.category}
                    onChange={handleInputChange}
                    className="select select-bordered"
                    required
                  >
                    <option value="Alimentação">Alimentação</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Moradia">Moradia</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Educação">Educação</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Forma de Pagamento</span>
                  </label>
                  <select
                    name="paymentMethod"
                    value={transaction.paymentMethod}
                    onChange={handleInputChange}
                    className="select select-bordered"
                    required
                  >
                    <option value="Crédito">Cartão de Crédito</option>
                    <option value="Débito">Cartão de Débito</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="PIX">PIX</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                
                <div className="form-control mt-8">
                  <button type="submit" className="btn btn-primary w-full">
                    Adicionar Transação
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Lista de Transações */}
          <CostsList 
            transactions={transactionsList}
            isSaving={isSaving}
            onSave={handleSaveAll}
            onDelete={handleDeleteTransaction}
          />
        </div>
        </div>
      </div>
  );
}