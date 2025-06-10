import { useEffect, useState } from 'react';
import { FiFilter, FiCalendar, FiDollarSign, FiPieChart, FiTrash2, FiEdit3, FiSave, FiX } from 'react-icons/fi';
import { Invoice } from '../models/Invoice';
import { getInvoicesByUserId, deleteInvoice, editInvoice } from '../services/InvoiceService';
import NavBar from '../components/Navbar';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SavedAnalysis {
  id: string;
  date: string;
  analysisText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartData: any;
  totalAmount: number;
}

export default function HistoryPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
    const [filters, setFilters] = useState({
        category: '',
        payment: '',
        startDate: '',
        endDate: ''
    });

    const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>(() => {
      const saved = localStorage.getItem('savedAnalyses');
      return saved ? JSON.parse(saved) : [];
    });

    const [user] = useState(() => {
        const userData = localStorage.getItem('session');
        return userData ? JSON.parse(userData) : null;
    });

    const calculateTotal = (invoices: Invoice[]): number => {
        return invoices.reduce((sum, invoice) => sum + invoice.value, 0);
    };

    useEffect(() => {
        const fetchInvoices = async () => {
            if (!user?.id) {
                setError('Usuário não autenticado');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const invoicesData = await getInvoicesByUserId(user.id);
                setInvoices(invoicesData);
                setTotalAmount(calculateTotal(invoicesData));
            } catch (err) {
                console.error('Erro ao buscar faturas:', err);
                setError('Erro ao carregar histórico');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvoices();
    }, [user]);

    const filteredInvoices = invoices.filter(invoice => {
        return (
            (filters.category === '' || invoice.category === filters.category) &&
            (filters.payment === '' || invoice.payment === filters.payment) &&
            (filters.startDate === '' || new Date(invoice.date) >= new Date(filters.startDate)) &&
            (filters.endDate === '' || new Date(invoice.date) <= new Date(filters.endDate))
        );
    });

    const uniqueCategories = [...new Set(invoices.map(invoice => invoice.category))];
    const uniquePayments = [...new Set(invoices.map(invoice => invoice.payment))];

    const deleteAnalysis = (id: string) => {
      const updatedAnalyses = savedAnalyses.filter(analysis => analysis.id !== id);
      setSavedAnalyses(updatedAnalyses);
      localStorage.setItem('savedAnalyses', JSON.stringify(updatedAnalyses));
    };

    // Função para deletar uma invoice
    const handleDeleteInvoice = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta despesa?')) {
            return;
        }

        try {
            await deleteInvoice(id);
            const updatedInvoices = invoices.filter(invoice => invoice._id !== id);
            setInvoices(updatedInvoices);
            setTotalAmount(calculateTotal(updatedInvoices));
        } catch (error) {
            console.error('Erro ao deletar fatura:', error);
            alert('Erro ao excluir despesa. Tente novamente.');
        }
    };

    // Função para iniciar edição
    const startEditing = (invoice: Invoice) => {
        setEditingId(invoice._id || '');
        setEditingInvoice({...invoice});
    };

    // Função para cancelar edição
    const cancelEditing = () => {
        setEditingId(null);
        setEditingInvoice(null);
    };

    // Função para salvar edição
    const saveEdit = async () => {
        if (!editingInvoice) return;

        try {
            await editInvoice(editingInvoice);
            const updatedInvoices = invoices.map(invoice => 
                invoice._id === editingInvoice._id ? editingInvoice : invoice
            );
            setInvoices(updatedInvoices);
            setTotalAmount(calculateTotal(updatedInvoices));
            setEditingId(null);
            setEditingInvoice(null);
        } catch (error) {
            console.error('Erro ao editar fatura:', error);
            alert('Erro ao salvar alterações. Tente novamente.');
        }
    };

    // Função para atualizar campos da invoice sendo editada
    const updateEditingInvoice = (field: string, value: string | number) => {
        if (!editingInvoice) return;
        
        setEditingInvoice({
            ...editingInvoice,
            [field]: field === 'value' ? parseFloat(value.toString()) || 0 : value
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error max-w-2xl mx-auto mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div>
            <NavBar/>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Histórico de Gastos</h1>
                        <p className="text-gray-600">Visualize e gerencie todas as suas despesas</p>
                    </div>

                    <div className="stats bg-base-100 shadow">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <FiDollarSign className="text-2xl" />
                            </div>
                            <div className="stat-title">Total Gasto</div>
                            <div className="stat-value text-primary">R$ {totalAmount.toFixed(2)}</div>
                            <div className="stat-desc">{filteredInvoices.length} {filteredInvoices.length === 1 ? 'transação' : 'transações'}</div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-base-200 p-6 rounded-lg mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <FiFilter className="text-lg" />
                        <h2 className="text-xl font-semibold">Filtros</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Categoria</span>
                            </label>
                            <select
                                className="select select-bordered"
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            >
                                <option value="">Todas</option>
                                {uniqueCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Pagamento</span>
                            </label>
                            <select
                                className="select select-bordered"
                                value={filters.payment}
                                onChange={(e) => setFilters({ ...filters, payment: e.target.value })}
                            >
                                <option value="">Todos</option>
                                {uniquePayments.map(payment => (
                                    <option key={payment} value={payment}>{payment}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Data Inicial</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Data Final</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabela com edição inline */}
                <div className="bg-base-100 rounded-lg shadow overflow-hidden mb-12">
                    <div className="overflow-x-auto">
                        <table className="table">
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
                                {filteredInvoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8">
                                            <div className="flex flex-col items-center justify-center">
                                                <FiPieChart className="text-4xl text-gray-400 mb-2" />
                                                <p className="text-gray-500">Nenhuma transação encontrada</p>
                                                {Object.values(filters).some(Boolean) && (
                                                    <button
                                                        className="btn btn-ghost btn-sm mt-2"
                                                        onClick={() => setFilters({
                                                            category: '',
                                                            payment: '',
                                                            startDate: '',
                                                            endDate: ''
                                                        })}
                                                    >
                                                        Limpar filtros
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInvoices.map((invoice) => (
                                        <tr key={invoice._id} className="hover">
                                            {/* Data */}
                                            <td>
                                                {editingId === invoice._id ? (
                                                    <input
                                                        type="date"
                                                        className="input input-sm input-bordered w-full"
                                                        value={editingInvoice?.date || ''}
                                                        onChange={(e) => updateEditingInvoice('date', e.target.value)}
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <FiCalendar className="text-gray-400" />
                                                        {new Date(invoice.date).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Descrição */}
                                            <td>
                                                {editingId === invoice._id ? (
                                                    <input
                                                        type="text"
                                                        className="input input-sm input-bordered w-full"
                                                        value={editingInvoice?.description || ''}
                                                        onChange={(e) => updateEditingInvoice('description', e.target.value)}
                                                    />
                                                ) : (
                                                    invoice.description
                                                )}
                                            </td>

                                            {/* Valor */}
                                            <td className="font-medium">
                                                {editingId === invoice._id ? (
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="input input-sm input-bordered w-full"
                                                        value={editingInvoice?.value || 0}
                                                        onChange={(e) => updateEditingInvoice('value', e.target.value)}
                                                    />
                                                ) : (
                                                    `R$ ${invoice.value.toFixed(2)}`
                                                )}
                                            </td>

                                            {/* Categoria */}
                                            <td>
                                                {editingId === invoice._id ? (
                                                    <select
                                                        className="select select-sm select-bordered w-full"
                                                        value={editingInvoice?.category || ''}
                                                        onChange={(e) => updateEditingInvoice('category', e.target.value)}
                                                    >
                                                        <option value="Alimentação">Alimentação</option>
                                                        <option value="Transporte">Transporte</option>
                                                        <option value="Serviços">Serviços</option>
                                                        <option value="Saúde">Saúde</option>
                                                        <option value="Lazer">Lazer</option>
                                                        <option value="Educação">Educação</option>
                                                        <option value="Vestuário">Vestuário</option>
                                                        <option value="Casa e Moradia">Casa e Moradia</option>
                                                        <option value="Bancos e Finanças">Bancos e Finanças</option>
                                                        <option value="Outros">Outros</option>
                                                    </select>
                                                ) : (
                                                    <span className="badge badge-outline">
                                                        {invoice.category}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Pagamento */}
                                            <td>
                                                {editingId === invoice._id ? (
                                                    <select
                                                        className="select select-sm select-bordered w-full"
                                                        value={editingInvoice?.payment || ''}
                                                        onChange={(e) => updateEditingInvoice('payment', e.target.value)}
                                                    >
                                                        <option value="Dinheiro">Dinheiro</option>
                                                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                                                        <option value="Cartão de Débito">Cartão de Débito</option>
                                                        <option value="Pix">Pix</option>
                                                    </select>
                                                ) : (
                                                    invoice.payment
                                                )}
                                            </td>

                                            {/* Ações */}
                                            <td>
                                                <div className="flex gap-2">
                                                    {editingId === invoice._id ? (
                                                        <>
                                                            <button
                                                                className="btn btn-circle btn-sm btn-success"
                                                                onClick={saveEdit}
                                                                title="Salvar"
                                                            >
                                                                <FiSave className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                className="btn btn-circle btn-sm btn-ghost"
                                                                onClick={cancelEditing}
                                                                title="Cancelar"
                                                            >
                                                                <FiX className="h-4 w-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="btn btn-circle btn-sm btn-ghost text-blue-600"
                                                                onClick={() => startEditing(invoice)}
                                                                title="Editar"
                                                            >
                                                                <FiEdit3 className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                className="btn btn-circle btn-sm btn-ghost text-red-600"
                                                                onClick={() => handleDeleteInvoice(invoice._id || '')}
                                                                title="Excluir"
                                                            >
                                                                <FiTrash2 className="h-4 w-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Histórico de Análises */}
                {savedAnalyses.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <FiPieChart className="text-primary" />
                      Histórico de Análises Salvas
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedAnalyses.map((analysis) => (
                        <div key={analysis.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                          <div className="card-body">
                            <div className="flex justify-between items-start">
                              <h3 className="card-title">
                                Análise de {new Date(analysis.date).toLocaleDateString('pt-BR')}
                              </h3>
                              <button 
                                onClick={() => deleteAnalysis(analysis.id)}
                                className="btn btn-circle btn-sm btn-ghost text-error"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                            
                            <p className="text-sm text-gray-500 mb-2">
                              Total: R$ {analysis.totalAmount.toFixed(2)}
                            </p>
                            
                            <div className="h-40 mb-4">
                              <Pie 
                                data={analysis.chartData} 
                                options={{ 
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      position: 'bottom'
                                    }
                                  }
                                }} 
                              />
                            </div>
                            
                            <div className="collapse collapse-arrow border border-base-300 rounded-box">
                              <input type="checkbox" />
                              <div className="collapse-title text-sm font-medium">
                                Ver detalhes da análise
                              </div>
                              <div className="collapse-content">
                                <div className="mt-2 p-3 bg-base-200 rounded-lg">
                                  <p className="whitespace-pre-line text-sm">
                                    {analysis.analysisText}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
        </div>
    );
}