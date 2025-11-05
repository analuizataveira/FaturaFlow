import { Invoice, InvoicesResponse, CsvUploadResponse, AnalyticsData } from "@/domain/interfaces/Invoice";

interface CategoryDetails {
  totalAmount: number;
  details: Invoice[];
}
import { BaseRepository } from "../base";

export class InvoiceRepository extends BaseRepository {
    constructor() {
        super('invoices');
    }

    async createInvoice(invoice: Invoice) {
        const response = await this.httpClient.post(`${this.path}`, invoice);
        if (!response || !response.data) {
            throw new Error('Erro ao criar fatura. Por favor, verifique os dados informados.');
        }

        return response.data;
    }

    async getInvoiceById(id: number) {
        const response = await this.httpClient.get(`${this.path}/${id}`);
        if (!response || !response.data) {
            throw new Error('Erro ao buscar fatura. Por favor, verifique os dados informados.');
        }

        return response.data;
    }

    async getInvoicesByUserId(userId: string): Promise<Invoice[]> {
        const response = await this.httpClient.get(`${this.path}/users/${userId}`);
        if (!response || !response.data) {
            throw new Error('Erro ao buscar faturas. Por favor, verifique os dados informados.');
        }

        const data: InvoicesResponse = response.data;

        // Transforma o objeto de categorias em um array plano de invoices
        const invoicesArray: Invoice[] = [];

        for (const category of Object.values(data.categories)) {
            if (category && category.details) {
                invoicesArray.push(...category.details);
            }
        }

        return invoicesArray;
    }

    async getInvoicesByUserIdWithStructure(userId: string): Promise<{
        regularInvoices: Invoice[];
        analysisInvoices: Invoice[];
        totalAmount: number;
        categories: Record<string, CategoryDetails>;
    }> {
        const response = await this.httpClient.get(`${this.path}/users/${userId}`);
        if (!response || !response.data) {
            throw new Error('Erro ao buscar faturas. Por favor, verifique os dados informados.');
        }

        const data = response.data;

        // A nova API retorna análises separadas
        const regularInvoices: Invoice[] = [];
        const analysisInvoices: Invoice[] = [];

        for (const category of Object.values(data.categories)) {
            if (category && (category as CategoryDetails).details) {
                regularInvoices.push(...(category as CategoryDetails).details);
            }
        }

        if (data.analyses) {
            if (data.analyses.CSV) {
                analysisInvoices.push(...data.analyses.CSV);
            }
            if (data.analyses.PDF) {
                analysisInvoices.push(...data.analyses.PDF);
            }
        }

        return {
            regularInvoices,
            analysisInvoices,
            totalAmount: data.totalAmount,
            categories: data.categories
        };
    }

    async editInvoice(invoice: Invoice) {
        const response = await this.httpClient.patch(`${this.path}/${invoice._id}`, invoice);
        if (!response || !response.data) {
            throw new Error('Erro ao editar fatura. Por favor, verifique os dados informados.');
        }

        return response.data;
    }

    async deleteInvoice(id: string): Promise<void> {
        const response = await this.httpClient.delete(`${this.path}/${id}`);
        if (!response) {
            throw new Error('Erro ao deletar fatura. Por favor, verifique os dados informados.');
        }
    }

    async uploadCsvInvoices(userId: string, file: File): Promise<CsvUploadResponse> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await this.httpClient.post(`${this.path}/upload/csv/users/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response || !response.data.success) {
            throw new Error('Erro ao fazer upload do CSV. Por favor, verifique o arquivo.');
        }

        return response.data;
    }

    async uploadPdfInvoices(userId: string, file: File): Promise<CsvUploadResponse> {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await this.httpClient.post(`${this.path}/upload/pdf/users/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response || !response.data.success) {
                throw new Error('Erro ao fazer upload do PDF. Por favor, verifique o arquivo.');
            }

            return response.data;
        } catch (error) {
            console.error('[InvoiceRepository] Erro no upload:', {
                error: error instanceof Error ? error.message : error,
                stack: error instanceof Error ? error.stack : undefined,
                userId,
                fileName: file.name
            });
            throw error;
        }
    }

    async updateTransactionInAnalysis(analysisId: string, transactionId: string, updateData: {
        description: string;
        value: number;
        category: string;
    }): Promise<any> {
        try {
            const response = await this.httpClient.patch(
                `${this.path}/analysis/${analysisId}/transaction/${transactionId}`,
                updateData
            );

            return response.data;
        } catch (error) {
            console.error('[InvoiceRepository] Erro ao atualizar transação:', {
                error: error instanceof Error ? error.message : error,
                analysisId,
                transactionId
            });
            throw error;
        }
    }

    async deleteTransactionFromAnalysis(analysisId: string, transactionId: string): Promise<any> {
        try {
            const response = await this.httpClient.delete(
                `${this.path}/analysis/${analysisId}/transaction/${transactionId}`
            );

            return response.data;
        } catch (error) {
            console.error('[InvoiceRepository] Erro ao excluir transação:', {
                error: error instanceof Error ? error.message : error,
                analysisId,
                transactionId
            });
            throw error;
        }
    }

    async getAnalysisById(analysisId: string): Promise<Invoice | null> {
        try {
            const response = await this.httpClient.get(`${this.path}/analysis/${analysisId}`);
            if (!response || !response.data) {
                return null;
            }
            return response.data;
        } catch (error) {
            console.error('[InvoiceRepository] Erro ao buscar análise:', {
                error: error instanceof Error ? error.message : error,
                analysisId
            });
            throw error;
        }
    }

    async getAnalyticsForAnalysis(analysisId: string): Promise<{analytics: AnalyticsData[], suggestion: string, totalValue: number} | null> {
        try {
            const analysis = await this.getAnalysisById(analysisId);
            if (!analysis) {
                return null;
            }
            
            // Calcular valor total das transações da análise
            const totalValue = analysis.invoices?.reduce((sum, invoice) => sum + invoice.value, 0) || 0;
            
            return {
                analytics: analysis.analytics || [],
                suggestion: analysis.suggestion || '',
                totalValue: totalValue
            };
        } catch (error) {
            console.error('[InvoiceRepository] Erro ao buscar analytics da análise:', {
                error: error instanceof Error ? error.message : error,
                analysisId
            });
            throw error;
        }
    }

    async getUserStats(userId: string): Promise<{
        totalRecords: number;
        totalAnalyses: number;
        totalSpent: number;
        averageSpentPerMonth: number;
        categoriesCount: number;
    } | null> {
        try {
            const data = await this.getInvoicesByUserIdWithStructure(userId);
            
            const regularRecordsCount = data.regularInvoices.length;
            const analysisTransactionsCount = data.analysisInvoices.reduce((sum, analysis) => 
                sum + (analysis.invoices?.length || 0), 0);
            const totalRecords = regularRecordsCount + analysisTransactionsCount;
            
            const totalAnalyses = data.analysisInvoices.length;
            
            const regularTotal = data.regularInvoices.reduce((sum, inv) => sum + inv.value, 0);
            const analysisTotal = data.analysisInvoices.reduce((sum, analysis) => 
                sum + (analysis.invoices?.reduce((subSum, inv) => subSum + inv.value, 0) || 0), 0);
            const totalSpent = regularTotal + analysisTotal;
            
            const averageSpentPerMonth = totalSpent / 3;
            
            const allInvoices = [
                ...data.regularInvoices,
                ...data.analysisInvoices.flatMap(analysis => analysis.invoices || [])
            ];
            const uniqueCategories = new Set(allInvoices.map(inv => inv.category));
            const categoriesCount = uniqueCategories.size;
            
            return {
                totalRecords,
                totalAnalyses,
                totalSpent,
                averageSpentPerMonth,
                categoriesCount
            };
        } catch (error) {
            console.error('[InvoiceRepository] Erro ao buscar estatísticas do usuário:', {
                error: error instanceof Error ? error.message : error,
                userId
            });
            throw error;
        }
    }

}