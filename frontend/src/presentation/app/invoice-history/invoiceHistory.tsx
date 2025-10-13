import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Invoice } from '@/domain/interfaces/Invoice';
import { repository } from '@/data/repositories';
import { Calendar, DollarSign, Edit3, FilePieChart, Filter, PieChart, Save, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components';

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
                const invoicesData = await repository.invoice.getInvoicesByUserId(user.id);
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

    const uniqueCategories = invoices
        .map(invoice => invoice.category)
        .filter((value, index, self) => self.indexOf(value) === index);

    const uniquePayments = invoices
        .map(invoice => invoice.payment)
        .filter((value, index, self) => self.indexOf(value) === index);

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
            await repository.invoice.deleteInvoice(id);
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
            await repository.invoice.editInvoice(editingInvoice);
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
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Carregando histórico de despesas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="border-destructive bg-destructive/5">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-destructive" />
                                <span className="text-destructive font-medium">{error}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Histórico de Gastos</h1>
                    <p className="text-muted-foreground mt-1">Visualize e gerencie todas as suas despesas</p>
                </div>
                
                {/* Stats Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">R$ {totalAmount.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            {filteredInvoices.length} {filteredInvoices.length === 1 ? 'transação' : 'transações'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtros
                    </CardTitle>
                    <CardDescription>Filtre suas despesas por categoria, pagamento e período</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Categoria</label>
                            <select
                                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            >
                                <option value="">Todas</option>
                                {uniqueCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Pagamento</label>
                            <select
                                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                value={filters.payment}
                                onChange={(e) => setFilters({ ...filters, payment: e.target.value })}
                            >
                                <option value="">Todos</option>
                                {uniquePayments.map(payment => (
                                    <option key={payment} value={payment}>{payment}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Data Inicial</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Data Final</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                    
                    {Object.values(filters).some(Boolean) && (
                        <div className="mt-4 flex justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setFilters({
                                    category: '',
                                    payment: '',
                                    startDate: '',
                                    endDate: ''
                                })}
                            >
                                Limpar filtros
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tabela de Despesas */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Despesas</CardTitle>
                    <CardDescription>Gerencie suas despesas com edição inline</CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredInvoices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="rounded-full bg-muted p-6 mb-4">
                                <PieChart className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Nenhuma transação encontrada</h3>
                            <p className="text-muted-foreground text-center max-w-md">
                                {Object.values(filters).some(Boolean) 
                                    ? "Nenhuma despesa corresponde aos filtros aplicados."
                                    : "Nenhuma despesa foi registrada ainda."
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Data</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Descrição</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Valor</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Categoria</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Pagamento</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInvoices.map((invoice) => (
                                        <tr key={invoice._id} className="border-b hover:bg-muted/50 transition-colors">
                                            {/* Data */}
                                            <td className="py-4 px-4">
                                                {editingId === invoice._id ? (
                                                    <input
                                                        type="date"
                                                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                                        value={editingInvoice?.date || ''}
                                                        onChange={(e) => updateEditingInvoice('date', e.target.value)}
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        {new Date(invoice.date).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Descrição */}
                                            <td className="py-4 px-4">
                                                {editingId === invoice._id ? (
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                                        value={editingInvoice?.description || ''}
                                                        onChange={(e) => updateEditingInvoice('description', e.target.value)}
                                                    />
                                                ) : (
                                                    <span className="font-medium">{invoice.description}</span>
                                                )}
                                            </td>

                                            {/* Valor */}
                                            <td className="py-4 px-4 font-medium">
                                                {editingId === invoice._id ? (
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                                        value={editingInvoice?.value || 0}
                                                        onChange={(e) => updateEditingInvoice('value', e.target.value)}
                                                    />
                                                ) : (
                                                    <span className="text-primary font-bold">R$ {invoice.value.toFixed(2)}</span>
                                                )}
                                            </td>

                                            {/* Categoria */}
                                            <td className="py-4 px-4">
                                                {editingId === invoice._id ? (
                                                    <select
                                                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
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
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-border bg-background text-foreground">
                                                        {invoice.category}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Pagamento */}
                                            <td className="py-4 px-4">
                                                {editingId === invoice._id ? (
                                                    <select
                                                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                                        value={editingInvoice?.payment || ''}
                                                        onChange={(e) => updateEditingInvoice('payment', e.target.value)}
                                                    >
                                                        <option value="Dinheiro">Dinheiro</option>
                                                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                                                        <option value="Cartão de Débito">Cartão de Débito</option>
                                                        <option value="Pix">Pix</option>
                                                    </select>
                                                ) : (
                                                    <span>{invoice.payment}</span>
                                                )}
                                            </td>

                                            {/* Ações */}
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2">
                                                    {editingId === invoice._id ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={saveEdit}
                                                                className="gap-2"
                                                            >
                                                                <Save className="h-4 w-4" />
                                                                Salvar
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={cancelEditing}
                                                                className="gap-2"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                Cancelar
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => startEditing(invoice)}
                                                                className="gap-2"
                                                            >
                                                                <Edit3 className="h-4 w-4" />
                                                                Editar
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDeleteInvoice(invoice._id || '')}
                                                                className="gap-2"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                Excluir
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Histórico de Análises */}
            {savedAnalyses.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FilePieChart className="h-5 w-5" />
                            Histórico de Análises Salvas
                        </CardTitle>
                        <CardDescription>Análises anteriores salvas para consulta</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedAnalyses.map((analysis) => (
                                <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">
                                                Análise de {new Date(analysis.date).toLocaleDateString('pt-BR')}
                                            </CardTitle>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => deleteAnalysis(analysis.id)}
                                                className="gap-2"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <CardDescription>
                                            Total: R$ {analysis.totalAmount.toFixed(2)}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
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
                                        
                                        <details className="group">
                                            <summary className="cursor-pointer text-sm font-medium hover:text-primary transition-colors">
                                                Ver detalhes da análise
                                            </summary>
                                            <div className="mt-4 p-4 bg-muted rounded-lg">
                                                <p className="whitespace-pre-line text-sm">
                                                    {analysis.analysisText}
                                                </p>
                                            </div>
                                        </details>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
