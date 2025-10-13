import { useEffect, useState } from 'react';
import { Invoice } from '@/domain/interfaces/Invoice';
import { InvoiceRepository } from '@/data/repositories/invoice';
import AnalysisResults from './components/analysis-results';
import { Edit, Trash2, BarChart3, Loader2, Receipt, DollarSign, Calendar, Tag, CreditCard, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/presentation/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';

export default function InvoiceViewer() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Invoice>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
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
        const invoicesData = await invoiceRepository.getInvoicesByUserId(user.id);
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
  }, [user]);

  const handleDelete = async () => {
    if (!selectedInvoice?._id) {
      setError('Selecione uma fatura para excluir');
      return;
    }

    try {
      setIsSubmitting(true);
      await invoiceRepository.deleteInvoice(selectedInvoice._id);
      setInvoices(prev => prev.filter(invoice => invoice._id !== selectedInvoice._id));
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

      setInvoices(prev => prev.map(inv =>
        inv._id === editingInvoice._id ? updatedInvoice : inv
      ));

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

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.value, 0);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suas Despesas</h1>
          <p className="text-muted-foreground mt-1">Gerencie e acompanhe todos os seus gastos</p>
        </div>
        {invoices.length > 0 && (
          <Button onClick={() => setShowAnalysis(true)} size="lg" className="gap-2">
            <BarChart3 className="h-5 w-5" />
            Gerar Análise
          </Button>
        )}
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

      {/* Stats Cards */}
      {invoices.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoices.length}</div>
              <p className="text-xs text-muted-foreground">
                {invoices.length === 1 ? "despesa registrada" : "despesas registradas"}
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
              <p className="text-xs text-muted-foreground">Soma de todas as despesas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média por Despesa</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {(totalAmount / invoices.length).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Valor médio gasto</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analysis Modal */}
      {showAnalysis && (
        <AnalysisResults
          transactions={invoices}
          onClose={() => setShowAnalysis(false)}
        />
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
      {invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Receipt className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhuma despesa registrada</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Suas despesas aparecerão aqui quando forem adicionadas ao sistema. Comece registrando sua primeira
              despesa!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Despesas</CardTitle>
            <CardDescription>Clique em uma despesa para ver mais detalhes e opções</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <Card
                  key={invoice._id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedInvoice?._id === invoice._id ? "border-primary shadow-md" : "hover:border-primary/50"
                  }`}
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setEditingInvoice(null);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-border bg-background text-foreground gap-1">
                            <Tag className="h-3 w-3" />
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
                              <CreditCard className="h-3 w-3" />
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
    </div>
  );
}
