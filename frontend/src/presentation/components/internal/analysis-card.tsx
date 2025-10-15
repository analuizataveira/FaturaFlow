import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { FileText, Calendar, DollarSign, Receipt, ArrowRight } from 'lucide-react';
import { Button } from '@/presentation/components';

interface AnalysisCardProps {
  analysis: {
    _id: string;
    date: string;
    description: string;
    value: number;
    category: string;
    invoiceName: string;
    invoices: Array<{
      _id: string;
      date: string;
      description: string;
      value: number;
      category: string;
    }>;
    createdAt: string;
  };
  onViewDetails: (analysisId: string) => void;
}

export default function AnalysisCard({ analysis, onViewDetails }: AnalysisCardProps) {
  const totalTransactions = analysis.invoices?.length || 0;
  const formattedDate = new Date(analysis.createdAt).toLocaleDateString('pt-BR');
  
  return (
    <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{analysis.invoiceName}</CardTitle>
              <CardDescription className="text-sm">
                Análise criada em {formattedDate}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(analysis._id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent 
        className="pt-0 cursor-pointer"
        onClick={() => onViewDetails(analysis._id)}
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-lg font-semibold text-primary">
                R$ {analysis.value.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Transações</p>
              <p className="text-lg font-semibold">
                {totalTransactions} {totalTransactions === 1 ? 'item' : 'itens'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Processado em {formattedDate}</span>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-muted-foreground">
            Clique para ver todas as transações desta análise
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
