"use client"

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components"
import { FileInvoiceUploader } from "@/presentation/components/internal/uploaders"
import { Dialog, DialogContent } from "@/presentation/components/ui/dialog"
import { BarChart3, DollarSign, FileText, History, Sparkles, TrendingUp, Upload, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { InvoiceRepository } from "@/data/repositories/invoice"

export default function MenuPage() {
  const navigate = useNavigate()

  const [user] = useState(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("session")
      return userData ? JSON.parse(userData) : null
    }
    return null
  })

  const [showFileUpload, setShowFileUpload] = useState(false);
  const [stats, setStats] = useState({
    totalRecords: 0,
    totalAnalyses: 0,
    totalSpent: 0,
    averageSpentPerMonth: 0,
    categoriesCount: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  const invoiceRepository = new InvoiceRepository();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) {
        setIsLoadingStats(false);
        return;
      }

      try {
        const userStats = await invoiceRepository.getUserStats(user.id);
        if (userStats) {
          setStats(userStats);
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, [user]);

  const handleFileUploadSuccess = async () => {
    setShowFileUpload(false); 
    
    if (user?.id) {
      try {
        setIsLoadingStats(true);
        const userStats = await invoiceRepository.getUserStats(user.id);
        if (userStats) {
          setStats(userStats);
        }
      } catch (error) {
        console.error('Erro ao atualizar estatísticas:', error);
      } finally {
        setIsLoadingStats(false);
      }
    }
    
    navigate("/invoice-viewer");
  };



  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Main Content */}
      <div className="w-full px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground mb-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Bem-vindo ao FaturaFlow
            </span>
            <h1 className="text-5xl font-bold tracking-tight text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
              Gerencie suas finanças com facilidade
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
              Organize seus gastos, analise padrões e tome decisões financeiras mais inteligentes com nossa plataforma
              completa
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total de Registros</CardTitle>
                  <FileText className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isLoadingStats ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    stats.totalRecords.toLocaleString()
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalRecords === 0 ? 'Comece registrando suas despesas' : `${stats.categoriesCount} categorias diferentes`}
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Análises Feitas</CardTitle>
                  <BarChart3 className="h-4 w-4 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isLoadingStats ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    stats.totalAnalyses
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalAnalyses === 0 ? 'Faça upload de PDFs' : 'Faturas processadas'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Gasto Total</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isLoadingStats ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    `R$ ${stats.totalSpent.toLocaleString('pt-BR', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}`
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.averageSpentPerMonth > 0 
                    ? `Média: R$ ${stats.averageSpentPerMonth.toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}/mês`
                    : 'Comece a rastrear gastos'
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Import Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 hover:-translate-y-1">
              <CardHeader>
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                  <Upload className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Importar Arquivo</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Importe seus dados financeiros em formato CSV ou PDF para análise rápida e automática
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                    CSV
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                    PDF
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                    Análise Automática
                  </span>
                </div>
                <Button className="w-full" size="lg" onClick={() => setShowFileUpload(true)} disabled={!user?.id}>
                  <Upload className="mr-2 h-5 w-5" />
                  Importar Dados
                </Button>
              </CardContent>
            </Card>

            {/* View Invoices Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 hover:-translate-y-1">
              <CardHeader>
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                  <DollarSign className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl">Ver Faturas Atuais</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Visualize, edite e gerencie suas faturas existentes com análise em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                    Visualização
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                    Edição
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                    Análise
                  </span>
                </div>
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={() => navigate("/invoice-viewer")} 
                  disabled={!user?.id}
                >
                  <History className="mr-2 h-5 w-5" />
                  Ver Faturas Atuais
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* History Card - Full Width */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center shadow-md flex-shrink-0">
                    <History className="h-7 w-7 text-foreground" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">Histórico de Gastos</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Visualize, edite e analise todo seu histórico financeiro com filtros avançados e gráficos
                      interativos
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border border-border bg-background text-foreground">
                        Filtros Avançados
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border border-border bg-background text-foreground">
                        Edição Inline
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border border-border bg-background text-foreground">
                        Gráficos
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border border-border bg-background text-foreground">
                        Exportação
                      </span>
                    </div>
                  </div>
                </div>
                <Button onClick={() => navigate("/invoice-history")} size="lg" className="md:self-start">
                  <History className="mr-2 h-5 w-5" />
                  Ver Histórico
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      <Dialog open={showFileUpload} onOpenChange={() => setShowFileUpload(false)}>
        <DialogContent className="max-w-md">
          <FileInvoiceUploader
            userId={user?.id || ""}
            onUploadSuccess={handleFileUploadSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
