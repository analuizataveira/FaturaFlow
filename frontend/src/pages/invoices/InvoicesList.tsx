import { useEffect, useState } from 'react';
import { Invoice } from '../../models/Invoice';
import AnalysisResults from './AnalysisResults';
import { deleteInvoice, getInvoicesByUserId } from '../../services/InvoiceService';

type InvoicesListProps = {
  invoices?: Invoice[];
  refreshTrigger?: boolean;
  onInvoiceDelete?: (id: string) => void;
};

const InvoicesList = ({ refreshTrigger, onInvoiceDelete }: InvoicesListProps) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user] = useState(() => {
    const userData = localStorage.getItem('session');
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user?.id) {
        setError('Usuário não autenticado');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const invoicesData = await getInvoicesByUserId(user.id);
        setInvoices(invoicesData);
      } catch (err) {
        console.error('Erro ao buscar faturas:', err);
        setError('Erro ao carregar faturas');
        setInvoices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [user, refreshTrigger]);

  const handleDelete = async () => {
    if (!selectedInvoice?._id) {
      setError('Selecione uma fatura para excluir');
      return;
    }

    try {

      await deleteInvoice(selectedInvoice._id);

      // Atualização otimista
      setInvoices(prev => prev.filter(invoice => invoice._id !== selectedInvoice._id));
      setSelectedInvoice(null);
      setError(null);

      // Notifica o componente pai
      onInvoiceDelete?.(selectedInvoice._id);

    } catch (err) {
      console.error('Erro ao excluir fatura:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao excluir fatura. Tente novamente.'
      );

      // Recarrega a lista para garantir consistência
      try {
        const invoicesData = await getInvoicesByUserId(user.id);
        setInvoices(invoicesData);
      } catch (fetchError) {
        console.error('Erro ao recarregar faturas:', fetchError);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error my-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Suas Despesas</h2>
        {invoices.length > 0 && (
          <button
            onClick={() => setShowAnalysis(true)}
            className="btn btn-primary"
          >
            Gerar Análise
          </button>
        )}
      </div>

      {showAnalysis && (
        <AnalysisResults
          transactions={invoices}
          onClose={() => setShowAnalysis(false)}
        />
      )}

      {selectedInvoice && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-blue-800">Fatura Selecionada</h3>
              <p><span className="font-medium">Descrição:</span> {selectedInvoice.description}</p>
              <p><span className="font-medium">Valor:</span> R$ {selectedInvoice.value.toFixed(2)}</p>
              <p><span className="font-medium">Categoria:</span> {selectedInvoice.category}</p>
            </div>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-sm"
            >
              Excluir
            </button>
          </div>
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="text-center py-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="mt-4 text-gray-500">Nenhuma despesa registrada ainda</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Categoria</th>
                <th>Pagamento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice._id}
                  onClick={() => setSelectedInvoice(invoice)}
                  className={`cursor-pointer hover:bg-gray-50 ${selectedInvoice?._id === invoice._id ? 'bg-blue-50' : ''
                    }`}
                >
                  <td>{new Date(invoice.date).toLocaleDateString()}</td>
                  <td>{invoice.description}</td>
                  <td className="font-medium">
                    R$ {invoice.value.toFixed(2)}
                  </td>
                  <td>
                    <span className="badge badge-outline">
                      {invoice.category}
                    </span>
                  </td>
                  <td>{invoice.payment}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInvoice(invoice);
                      }}
                      className={`btn btn-ghost btn-xs ${selectedInvoice?._id === invoice._id
                          ? 'text-blue-600'
                          : 'text-gray-600'
                        }`}
                    >
                      Selecionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoicesList;