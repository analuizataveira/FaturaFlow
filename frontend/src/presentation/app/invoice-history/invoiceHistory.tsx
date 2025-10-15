import { repository } from '@/data/repositories';
import { Invoice } from '@/domain/interfaces/Invoice';
import { Button } from '@/presentation/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { AlertCircle, Calendar, DollarSign, Eye, FilePieChart, FileText, Filter, Loader2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalAmount, setTotalAmount] = useState(0);
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


    useEffect(() => {
        const fetchInvoices = async () => {
            if (!user?.id) {
                setError('Usuário não autenticado');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const data = await repository.invoice.getInvoicesByUserIdWithStructure(user.id);
                
                // Combinar transações regulares e análises para o histórico
                const allInvoices = [...data.regularInvoices, ...data.analysisInvoices];
                
                console.log('🔍 [InvoiceHistory] Dados carregados:', {
                    regularInvoices: data.regularInvoices.length,
                    analysisInvoices: data.analysisInvoices.length,
                    totalAmount: data.totalAmount,
                    allInvoices: allInvoices.length
                });
                
                setInvoices(allInvoices);
                
                // Calcular valor total dinamicamente baseado nas transações atuais
                const calculatedTotal = allInvoices.reduce((sum, invoice) => {
                    // Para análises (PDF/CSV), somar as transações internas
                    if (invoice.invoices && invoice.invoices.length > 0) {
                        return sum + invoice.invoices.reduce((invoiceSum, inv) => invoiceSum + inv.value, 0);
                    }
                    // Para transações regulares, somar o valor direto
                    return sum + invoice.value;
                }, 0);
                
                setTotalAmount(calculatedTotal);
            } catch (err) {
                console.error('Erro ao buscar faturas:', err);
                setError('Erro ao carregar histórico');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvoices();
    }, [user]);

    // Separar análises de PDF das faturas regulares
    const pdfAnalyses = invoices.filter(invoice => 
        invoice.invoiceName && 
        (invoice.category === 'Análise PDF' || invoice.category === 'Análise CSV')
    );
    const regularInvoices = invoices.filter(invoice => !invoice.invoiceName);

    const filteredInvoices = regularInvoices.filter(invoice => {
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

    const handleViewAnalysisDetails = (analysisId: string) => {
        navigate(`/analysis-details/${analysisId}`);
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
                            {(() => {
                                // Calcular total de transações incluindo análises
                                const regularTransactions = filteredInvoices.length;
                                const analysisTransactions = pdfAnalyses.reduce((sum, analysis) => 
                                    sum + (analysis.invoices?.length || 0), 0
                                );
                                const totalTransactions = regularTransactions + analysisTransactions;
                                
                                return `${totalTransactions} ${totalTransactions === 1 ? 'transação' : 'transações'}`;
                            })()}
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

            {/* Faturas Individuais */}
            {filteredInvoices.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Faturas Individuais</CardTitle>
                        <CardDescription>Despesas registradas individualmente</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {filteredInvoices.map((invoice) => (
                                <Card key={invoice._id} className="hover:shadow-md transition-all">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-border bg-background text-foreground gap-1">
                                                        {invoice.category}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(invoice.date).toLocaleDateString("pt-BR", {
                                                            timeZone: "UTC",
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <p className="font-medium flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                                            {invoice.description}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                            {invoice.payment}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-primary">R$ {invoice.value.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Análises de PDF e CSV */}
            {pdfAnalyses.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Análises de Documentos
                        </CardTitle>
                        <CardDescription>Análises de documentos PDF e CSV processados</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pdfAnalyses.map((analysis) => (
                                <Card 
                                    key={analysis._id} 
                                    className="hover:shadow-lg transition-all cursor-pointer hover:border-primary"
                                    onClick={() => analysis._id && handleViewAnalysisDetails(analysis._id)}
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            {analysis.invoiceName || `Análise de ${analysis.category === 'Análise PDF' ? 'PDF' : 'CSV'}`}
                                        </CardTitle>
                                        <CardDescription>
                                            <div className="flex items-center gap-2">
                                                <span>{new Date(analysis.date).toLocaleDateString('pt-BR')}</span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                                    {analysis.category === 'Análise PDF' ? 'PDF' : 'CSV'}
                                                </span>
                                            </div>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">Valor Total:</span>
                                                <span className="text-lg font-bold text-primary">
                                                    R$ {(analysis.invoices?.reduce((sum, invoice) => sum + invoice.value, 0) || 0).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">Transações:</span>
                                                <span>{analysis.invoices?.length || 0}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 pt-4 border-t">
                                            <Button 
                                                variant="outline" 
                                                className="w-full gap-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    analysis._id && handleViewAnalysisDetails(analysis._id);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                                Ver Detalhes
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

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