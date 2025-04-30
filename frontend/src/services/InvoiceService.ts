import { Invoice } from "../models/Invoice";
import { request } from "./RequestService";


interface CategoryDetails {
    totalAmount: number;
    details: Invoice[];
}

interface InvoicesResponse {
    totalAmount: number;
    categories: Record<string, CategoryDetails>;
}

// Função para criar uma fatura
export async function createInvoice(invoice: Invoice) {
    try {
        const response = await request("/api/invoices", "POST", JSON.stringify(invoice));

        // Verifica se a resposta contém um indicativo de sucesso (ex.: token ou usuário)
        if (!response || (response.status && response.status !== 200) || response.error) {
            throw new Error("Erro ao criar fatura. Por favor, verifique os dados.");
        }
        return response; // Retorna a resposta apenas se o login for bem-sucedido
    } catch (err) {
        console.log("Invoice Create Error: ", err);
    }
}

// Função para pegar uma fatura pelo id 
export async function getInvoiceById(id: number) {
    try {
        const response = await request(`/api/invoices/${id}`, "GET");

        // Verifica se a resposta contém um indicativo de sucesso (ex.: token ou usuário)
        if (!response || (response.status && response.status !== 200) || response.error) {
            throw new Error("Erro ao pegar fatura. Por favor, verifique os dados.");
        }
        return response; // Retorna a resposta apenas se o login for bem-sucedido
    } catch (err) {
        // Trata outros erros genéricos
        throw new Error("Erro ao pegar fatura. Por favor, verifique os dados.");
    }
}

// Função para pegar faturas por usuário
export const getInvoicesByUserId = async (userId: string): Promise<Invoice[]> => {
    const response = await fetch(`http://localhost:3000/api/invoices/users/${userId}`);
    
    if (!response.ok) {
      throw new Error('Falha ao buscar faturas');
    }
  
    const data: InvoicesResponse = await response.json();
    
    // Transforma o objeto de categorias em um array plano de invoices
    const invoicesArray: Invoice[] = [];
    
    for (const category of Object.values(data.categories)) {
      if (category && category.details) {
        invoicesArray.push(...category.details);
      }
    }
    
    return invoicesArray;
  };

// Função para editar uma fatura
export async function editInvoice(invoice: Invoice) {
    try {
        const response = await request(`/api/invoices/${invoice._id}`, "PATCH", JSON.stringify(invoice));

        // Verifica se a resposta contém um indicativo de sucesso (ex.: token ou usuário)
        if (!response || (response.status && response.status !== 200) || response.error) {
            throw new Error("Erro ao editar fatura. Por favor, verifique os dados.");
        }
        return response; // Retorna a resposta apenas se o login for bem-sucedido
    } catch (err) {
        // Trata outros erros genéricos
        throw new Error("Erro ao editar fatura. Por favor, verifique os dados.");
    }
}

// Função para deletar uma fatura
export const deleteInvoice = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/api/invoices/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({}) // Envia objeto vazio
      });
  
      // ... resto do código
    } catch (error) {
      // ... tratamento de erro
    }
  };


// Converte data de 'dd/MM/yyyy' (backend) para 'yyyy-MM-dd' (input date)
export const formatDateToFrontend = (dateString: string | undefined): string => {
    if (!dateString) {
        return getCurrentDateFormatted(); // ou return ''; dependendo do que você preferir
    }

    // Se a data já estiver no formato correto (YYYY-MM-DD), retorna diretamente
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }

    // Se estiver no formato DD/MM/YYYY, converte para YYYY-MM-DD
    if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Se não reconhecer o formato, retorna a data atual
    return getCurrentDateFormatted();
};


// Retorna a data de hoje no formato 'yyyy-MM-dd'
export function getCurrentDateFormatted(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}