import OpenAI from 'openai';

export type TransactionData = {
  date: string;
  description: string;
  value: number;
  category: string;
  payment: string;
  userId: string;
};

export type ChatGptResponse = {
  transactions: TransactionData[];
  summary: {
    totalTransactions: number;
    totalValue: number;
    categories: Record<string, { count: number; totalValue: number }>;
  };
};

class ChatGptService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    // this.openai = {
    //   chat: {
    //     completions: {
    //       create: () => ({
    //         choices: [{ message: { content: '' } }],
    //       }),
    //     },
    //   },
    // };
  }

  async processNubankTransactions(extractedText: string, userId: string): Promise<ChatGptResponse> {
    try {
      const prompt = this.createPrompt(extractedText, userId);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em análise de extratos bancários. 
            Sua tarefa é extrair transações de um texto de fatura de cartão de crédito e categorizá-las adequadamente.
            
            IMPORTANTE:
            - Retorne APENAS um JSON válido, sem texto adicional
            - Use as categorias: Alimentação, Transporte, Serviços, Saúde, Lazer, Educação, Vestuário, Casa e Moradia, Bancos e Finanças, Outros
            - Para pagamentos (valores negativos), use a categoria "Pagamentos"
            - O campo "payment" deve ser sempre "Cartão de Crédito"
            - Valores devem ser números positivos (sem sinal negativo)
            - Datas devem estar no formato DD/MM/YYYY`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 4000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from ChatGPT');
      }

      // Tenta fazer parse do JSON
      let parsedResponse: ChatGptResponse;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        parsedResponse = JSON.parse(response);
      } catch (parseError) {
        console.error('Error parsing ChatGPT response:', parseError);
        console.error('Raw response:', response);
        throw new Error('Invalid JSON response from ChatGPT');
      }

      // Valida a estrutura da resposta
      this.validateResponse(parsedResponse);

      return parsedResponse;
    } catch (error) {
      console.error('Error processing with ChatGPT:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`ChatGPT processing failed: ${errorMessage}`);
    }
  }

  private createPrompt(extractedText: string, userId: string): string {
    return `
Analise o seguinte texto extraído de uma fatura de cartão de crédito e extraia todas as transações, categorizando-as adequadamente.

TEXTO EXTRAÍDO:
${extractedText}

INSTRUÇÕES:
1. Encontre todas as transações que contêm valores em R$
2. Para cada transação, extraia:
   - Data (formato DD/MM/YYYY)
   - Descrição (limpa, sem códigos do cartão)
   - Valor (número positivo)
   - Categoria (baseada na descrição)
   - Payment: "Cartão de Crédito"
   - UserId: "${userId}"

3. Categorize baseado na descrição:
   - Alimentação: supermercados, restaurantes, delivery, padarias, etc.
   - Transporte: postos, gasolina, uber, taxi, etc.
   - Serviços: luz, água, internet, telefone, streaming, etc.
   - Saúde: farmácias, médicos, hospitais, etc.
   - Lazer: cinema, shows, bares, etc.
   - Educação: cursos, livros, mensalidades, etc.
   - Vestuário: roupas, calçados, lojas, etc.
   - Casa e Moradia: aluguel, condomínio, móveis, etc.
   - Bancos e Finanças: taxas, juros, anuidades, etc.
   - Pagamentos: para valores negativos (pagamentos recebidos)
   - Outros: quando não se encaixar em nenhuma categoria

4. Calcule um resumo com:
   - Total de transações
   - Valor total
   - Contagem e valor por categoria

Retorne APENAS um JSON no seguinte formato:
{
  "transactions": [
    {
      "date": "06/08/2025",
      "description": "Mercadopago Fisiacom - Parcela 3/3",
      "value": 82.66,
      "category": "Outros",
      "payment": "Cartão de Crédito",
      "userId": "${userId}"
    }
  ],
  "summary": {
    "totalTransactions": 1,
    "totalValue": 82.66,
    "categories": {
      "Outros": {
        "count": 1,
        "totalValue": 82.66
      }
    }
  }
}
`;
  }

  private validateResponse(response: ChatGptResponse): void {
    if (!response.transactions || !Array.isArray(response.transactions)) {
      throw new Error('Invalid response: transactions array is required');
    }

    if (!response.summary) {
      throw new Error('Invalid response: summary is required');
    }

    // Valida cada transação
    for (const transaction of response.transactions) {
      if (!transaction.date || !transaction.description || !transaction.value) {
        throw new Error('Invalid transaction: missing required fields');
      }

      if (typeof transaction.value !== 'number' || transaction.value <= 0) {
        throw new Error('Invalid transaction: value must be a positive number');
      }

      if (!transaction.category || !transaction.payment || !transaction.userId) {
        throw new Error('Invalid transaction: missing category, payment or userId');
      }
    }
  }
}

export default new ChatGptService();
