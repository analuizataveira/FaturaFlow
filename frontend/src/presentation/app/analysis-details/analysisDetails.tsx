import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Invoice } from '@/domain/interfaces/Invoice';
import { InvoiceRepository } from '@/data/repositories/invoice';
import AnalysisResults from '../invoice-viewer/components/analysis-results';
import { ArrowLeft, FileText, Calendar, DollarSign, Tag, CreditCard, Receipt, Loader2, AlertCircle, Edit, Trash2, BarChart3 } from 'lucide-react';
import { Button } from '@/presentation/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';


export default function AnalysisDetails() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<Partial<any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const invoiceRepository = new InvoiceRepository();

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisId) {
        setError('ID da análise não fornecido');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const foundAnalysis = await invoiceRepository.getAnalysisById(analysisId);

        if (!foundAnalysis) {
          setError('Análise não encontrada');
          setIsLoading(false);
          return;
        }

        setAnalysis(foundAnalysis);
      } catch (err) {
        console.error('Erro ao buscar análise:', err);
        setError('Erro ao carregar análise');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [analysisId]);

  // As transações estão diretamente no campo invoices da análise
  const transactionsToUse = analysis?.invoices || [];
  
  // Calcular o valor total dinamicamente baseado nas transações atuais
  const totalAmount = transactionsToUse.reduce((sum, transaction) => sum + transaction.value, 0);
  const transactionsCount = transactionsToUse.length;
  
  const handleEditTransaction = async () => {
    if (!editingTransaction?._id || !analysisId) {
      setError('Selecione uma transação para editar');
      return;
    }

    try {
      setIsSubmitting(true);

      await invoiceRepository.updateTransactionInAnalysis(
        analysisId,
        editingTransaction._id,
        {
          description: editFormData.description || editingTransaction.description,
          value: editFormData.value || editingTransaction.value,
          category: editFormData.category || editingTransaction.category
        }
      );

      // Atualizar estado local após sucesso da API
      const updatedTransaction = {
        ...editingTransaction,
        ...editFormData,
        value: editFormData.value || editingTransaction.value
      };


      // Atualizar transações na análise
      if (analysis && analysis.invoices) {
        const updatedInvoices = analysis.invoices.map(inv => 
          inv._id === editingTransaction._id ? updatedTransaction : inv
        );
        
        // Recalcular o valor total baseado nas transações atualizadas
        const newTotalValue = updatedInvoices.reduce((sum, inv) => sum + inv.value, 0);
        
        setAnalysis({
          ...analysis,
          invoices: updatedInvoices,
          value: newTotalValue
        });
      }

      // Atualizar transação selecionada se for a mesma
      if (selectedTransaction?._id === editingTransaction._id) {
        setSelectedTransaction(updatedTransaction);
      }

      setEditingTransaction(null);
      setEditingTransactionId(null);
      setEditFormData({});
      setError(null);
    } catch (err) {
      console.error('❌ [AnalysisDetails] Erro ao editar transação:', err);
      setError('Erro ao editar transação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) {
      return;
    }

    if (!analysisId) {
      setError('ID da análise não encontrado');
      return;
    }

    try {
      setIsSubmitting(true);

      // Chamar API para excluir no backend
      await invoiceRepository.deleteTransactionFromAnalysis(analysisId, transactionId);

      // Atualizar estado local após sucesso da API
      if (analysis && analysis.invoices) {
        const updatedInvoices = analysis.invoices.filter(inv => inv._id !== transactionId);
        
        // Recalcular o valor total baseado nas transações restantes
        const newTotalValue = updatedInvoices.reduce((sum, inv) => sum + inv.value, 0);
        
        setAnalysis({
          ...analysis,
          invoices: updatedInvoices,
          value: newTotalValue
        });
      }

      // Limpar transação selecionada se for a mesma que foi excluída
      if (selectedTransaction?._id === transactionId) {
        setSelectedTransaction(null);
      }

      setError(null);
    } catch (err) {
      console.error('❌ [AnalysisDetails] Erro ao excluir transação:', err);
      setError('Erro ao excluir transação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando análise...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span className="text-destructive font-medium">{error}</span>
            </div>
            <Button onClick={() => navigate('/invoice-viewer')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Análise não encontrada</p>
            <Button onClick={() => navigate('/invoice-viewer')} variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/invoice-viewer')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{analysis.invoiceName}</h1>
            <p className="text-muted-foreground mt-1">
              Fatura processada em {analysis.date ? new Date(analysis.date).toLocaleDateString('pt-BR') : 'Data não disponível'}
            </p>
          </div>
        </div>
        {analysis.invoices && analysis.invoices.length > 0 && (
          <Button onClick={async () => {
            try {
              const updatedAnalysis = await invoiceRepository.getAnalysisById(analysisId!);
              if (updatedAnalysis) {
                setAnalysis(updatedAnalysis);
              }
            } catch (error) {
              console.error('❌ [AnalysisDetails] Erro ao atualizar análise:', error);
            }

            setShowAnalysis(true);
          }} size="lg" className="gap-2">
            <BarChart3 className="h-5 w-5" />
            Gerar Análise
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactionsCount}</div>
            <p className="text-xs text-muted-foreground">
              {transactionsCount === 1 ? "transação encontrada" : "transações encontradas"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Soma de todas as transações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {transactionsCount > 0 ? (totalAmount / transactionsCount).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Valor médio por transação</p>
          </CardContent>
        </Card>
      </div>

      {/* Selected Transaction Details */}
      {selectedTransaction && (
        <Card className="border-primary shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Transação Selecionada
            </CardTitle>
            <CardDescription>Detalhes da transação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Data:</span>
                  <span>{new Date(selectedTransaction.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Descrição:</span>
                  <span>{selectedTransaction.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Valor:</span>
                  <span className="text-lg font-bold text-primary">R$ {selectedTransaction.value.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Categoria:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {selectedTransaction.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Pagamento:</span>
                  <span>Cartão de Crédito</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6 pt-4 border-t">
              <Button
                onClick={() => {
                  setEditingTransaction(selectedTransaction);
                  setEditFormData({
                    description: selectedTransaction.description,
                    value: selectedTransaction.value,
                    category: selectedTransaction.category
                  });
                }}
                variant="outline"
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                onClick={() => handleDeleteTransaction(selectedTransaction._id)}
                variant="destructive"
                className="gap-2"
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
              <Button
                onClick={() => setSelectedTransaction(null)}
                variant="ghost"
              >
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}


      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Transações da Fatura</CardTitle>
          <CardDescription>
            Clique em uma transação para ver mais detalhes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactionsToUse.map((transaction) => (
              <Card
                key={transaction._id}
                className={`transition-all hover:shadow-md ${
                  selectedTransaction?._id === transaction._id ? "border-primary shadow-md" : "hover:border-primary/50"
                } ${editingTransactionId === transaction._id ? "border-primary shadow-lg" : ""}`}
                onClick={editingTransactionId === transaction._id ? undefined : () => setSelectedTransaction(transaction)}
              >
                <CardContent className="p-4">
                  {editingTransactionId === transaction._id ? (
                    // Modo de edição inline
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Edit className="h-4 w-4 text-primary" />
                        <span className="font-medium text-primary">Editando transação</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Descrição</label>
                          <input
                            type="text"
                            value={editFormData.description || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Descrição da transação"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Valor</label>
                          <input
                            type="number"
                            step="0.01"
                            value={editFormData.value || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, value: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Categoria</label>
                          <select
                            value={editFormData.category || ''}
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
                            <option value="Casa e Moradia">Casa e Moradia</option>
                            <option value="Bancos e Finanças">Bancos e Finanças</option>
                            <option value="Pagamentos">Pagamentos</option>
                            <option value="Outros">Outros</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          onClick={handleEditTransaction}
                          disabled={isSubmitting}
                          className="gap-2"
                        >
                          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit className="h-4 w-4" />}
                          Salvar
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingTransactionId(null);
                            setEditingTransaction(null);
                            setEditFormData({});
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Modo de visualização normal
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-border bg-background text-foreground gap-1">
                            <Tag className="h-3 w-3" />
                            {transaction.category}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(transaction.date).toLocaleDateString("pt-BR", {
                              timeZone: "UTC",
                            })}
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {transaction.description}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <CreditCard className="h-3 w-3" />
                              Cartão de Crédito
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">R$ {transaction.value.toFixed(2)}</p>
                            <div className="flex gap-1 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTransactionId(transaction._id || null);
                                  setEditingTransaction(transaction);
                                  setEditFormData({
                                    description: transaction.description,
                                    value: transaction.value,
                                    category: transaction.category
                                  });
                                }}
                                className="h-8 px-2"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTransaction(transaction._id || '');
                                }}
                                disabled={isSubmitting}
                                className="h-8 px-2"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Modal */}
      {showAnalysis && (
        <>
          <AnalysisResults
            transactions={transactionsToUse.map(transaction => ({
              _id: transaction._id,
              date: transaction.date,
              description: transaction.description,
              value: transaction.value,
              category: transaction.category,
              payment: transaction.payment || 'Cartão de Crédito',
              userId: analysis.userId
            }))}
            onClose={() => setShowAnalysis(false)}
            analytics={(analysis as any).analytics}
            suggestion={(analysis as any).suggestion}
          />
        </>
      )}
    </div>
  );
}
