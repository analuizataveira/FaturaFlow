import { Invoice, InvoicesResponse, CsvUploadResponse } from "@/domain/interfaces/Invoice";
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

        const response = await this.httpClient.post(`${this.path}/upload/pdf/users/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response || !response.data.success) {
            throw new Error('Erro ao fazer upload do PDF. Por favor, verifique o arquivo.');
        }

        return response.data;
    }

}