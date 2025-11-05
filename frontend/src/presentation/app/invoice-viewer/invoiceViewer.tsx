import { InvoiceRepository } from '@/data/repositories/invoice';
import { Invoice } from '@/domain/interfaces/Invoice';
import { Button } from '@/presentation/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { AlertCircle, Calendar, CreditCard, DollarSign, Edit, FileSearch, FileText, Loader2, Receipt, Tag, Trash2, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import AnalysisResults from './components/analysis-results';



ChartJS.register(ArcElement, Tooltip, Legend);

export default function InvoiceViewer() {
  const [analyses, setAnalyses] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Invoice>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<{analytics: any[], suggestion: string, totalValue: number} | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Invoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);



  const [user] = useState(() => {
    const userData = localStorage.getItem('session');
    return userData ? JSON.parse(userData) : null;
  });
  const invoiceRepository = new InvoiceRepository();

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
        const data = await invoiceRepository.getInvoicesByUserIdWithStructure(user.id);
        
        setAnalyses(data.analysisInvoices);
      } catch (err) {
        console.error('Erro ao buscar faturas:', err);
        setError('Erro ao carregar faturas');
        setAnalyses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  const handleDelete = async () => {
    if (!selectedInvoice?._id) {
      setError('Selecione uma fatura para excluir');
      return;
    }

    try {
      setIsSubmitting(true);
      await invoiceRepository.deleteInvoice(selectedInvoice._id);

      setSelectedInvoice(null);
      setEditingInvoice(null);
      setError(null);
    } catch (err) {
      console.error('Erro ao excluir fatura:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao excluir fatura. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editingInvoice?._id) {
      setError('Selecione uma fatura para editar');
      return;
    }

    try {
      setIsSubmitting(true);
      const formattedDate = editFormData.date
        ? new Date(editFormData.date).toISOString().split('T')[0]
        : editingInvoice.date;

      const updatedInvoice = {
        ...editingInvoice,
        ...editFormData,
        date: formattedDate,
        value: editFormData.value || editingInvoice.value
      };

      await invoiceRepository.editInvoice(updatedInvoice);



      setEditingInvoice(null);
      setSelectedInvoice(updatedInvoice);
      setEditFormData({});
      setError(null);
    } catch (err) {
      console.error('Erro ao editar fatura:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao editar fatura. Verifique os dados e tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };



  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando suas despesas...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suas Faturas</h1>
          <p className="text-muted-foreground mt-1">Gerencie e acompanhe todas as suas faturas</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2">
        <FileSearch className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Faturas Processadas ({analyses.length})</h2>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-destructive font-medium">{error}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}




      {/* Selected Invoice Details */}
      {selectedInvoice && (
        <Card className="border-primary shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Despesa Selecionada
            </CardTitle>
            <CardDescription>Detalhes e opções de edição</CardDescription>
          </CardHeader>
          <CardContent>
            {editingInvoice?._id === selectedInvoice._id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data</label>
                  <input
                    type="date"
                    value={editFormData.date || selectedInvoice.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.value || selectedInvoice.value}
                    onChange={(e) => setEditFormData({ ...editFormData, value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <input
                    type="text"
                    value={editFormData.description || selectedInvoice.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <select
                    value={editFormData.category || selectedInvoice.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Alimentação">Alimentação</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Educação">Educação</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Serviços">Serviços</option>
                    <option value="Vestuário">Vestuário</option>
                    <option value="Moradia">Moradia</option>
                    <option value="Bancos e Finanças">Bancos e Finanças</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pagamento</label>
                  <select
                    value={editFormData.payment || selectedInvoice.payment}
                    onChange={(e) => setEditFormData({ ...editFormData, payment: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Pix">Pix</option>
                    <option value="Transferência">Transferência</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Data:</span>
                    <span>{new Date(selectedInvoice.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Descrição:</span>
                    <span>{selectedInvoice.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Valor:</span>
                    <span className="text-lg font-bold text-primary">R$ {selectedInvoice.value.toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Categoria:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {selectedInvoice.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Pagamento:</span>
                    <span>{selectedInvoice.payment}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-2 mt-6 pt-4 border-t">
              {editingInvoice?._id === selectedInvoice._id ? (
                <>
                  <Button
                    onClick={handleEdit}
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit className="h-4 w-4" />}
                    Salvar Alterações
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingInvoice(null);
                      setEditFormData({});
                    }}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setEditingInvoice(selectedInvoice);
                      setEditFormData({
                        date: selectedInvoice.date,
                        description: selectedInvoice.description,
                        value: selectedInvoice.value,
                        category: selectedInvoice.category,
                        payment: selectedInvoice.payment
                      });
                    }}
                    variant="outline"
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    variant="destructive"
                    className="gap-2"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Excluir
                  </Button>
                  <Button
                    onClick={() => setSelectedInvoice(null)}
                    variant="ghost"
                  >
                    Fechar
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {analyses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-6 mb-4">
              <FileSearch className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhuma fatura encontrada</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Suas faturas de PDF aparecerão aqui quando forem processadas. Faça upload de um PDF para começar!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {analyses.filter(analysis => analysis._id).map((analysis) => {
            const totalValue = analysis.invoices?.reduce((sum, invoice) => sum + invoice.value, 0) || 0;
            const transactionsCount = analysis.invoices?.length || 0;
            
            return (
              <Card key={analysis._id} className="hover:shadow-lg transition-all cursor-pointer hover:border-primary">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    {analysis.invoiceName || 'Análise de PDF'}
                  </CardTitle>
                  <CardDescription>
                    Processada em {new Date(analysis.date).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Valor Total:</span>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        R$ {totalValue.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Transações:</span>
                      </div>
                      <span className="font-semibold">{transactionsCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Categoria:</span>
                      </div>
                      <span className="text-sm bg-secondary px-2 py-1 rounded-full">
                        {analysis.category}
                      </span>
                    </div>
                  </div>
                
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2"
                      onClick={() => {
                        window.location.href = `/analysis-details/${analysis._id}`;
                      }}
                    >
                      <FileText className="h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    <Button 
                      onClick={async () => {
                        try {
                          setIsLoadingAnalytics(true);
                          setSelectedAnalysis(analysis);
                          
                          // Buscar analytics do backend
                          const analytics = await invoiceRepository.getAnalyticsForAnalysis(analysis._id!);
                          
                          if (analytics) {
                            setAnalyticsData(analytics);
                            setShowAnalysis(true);
                          } else {
                            console.error('Analytics não encontrados');
                            setError('Dados de análise não encontrados para esta fatura.');
                          }
                        } catch (error) {
                          console.error('[InvoiceViewer] Erro ao buscar analytics:', error);
                          setError('Erro ao gerar análise. Tente novamente.');
                        } finally {
                          setIsLoadingAnalytics(false);
                        }
                      }}
                      className="gap-2"
                      disabled={isLoadingAnalytics && selectedAnalysis?._id === analysis._id}
                    >
                      {isLoadingAnalytics && selectedAnalysis?._id === analysis._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <BarChart3 className="h-4 w-4" />
                      )}
                      {isLoadingAnalytics && selectedAnalysis?._id === analysis._id ? 'Gerando...' : 'Análise'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Analysis Modal */}
      {showAnalysis && analyticsData && (
        <AnalysisResults
          onClose={() => {
            setShowAnalysis(false);
            setAnalyticsData(null);
            setSelectedAnalysis(null);
          }}
          analytics={analyticsData.analytics}
          suggestion={analyticsData.suggestion}
          totalValue={analyticsData.totalValue}
        />
      )}
    </div>
  );
}
