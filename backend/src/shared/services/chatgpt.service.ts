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
  }

  async processNubankTransactions(extractedText: string, userId: string): Promise<ChatGptResponse> {
    console.log('🤖 [ChatGptService] Iniciando processamento de transações:', {
      userId,
      textLength: extractedText.length,
      textPreview: extractedText.substring(0, 200) + '...'
    });

    try {
      const prompt = this.createPrompt(extractedText, userId);
      
      console.log('🤖 [ChatGptService] Prompt criado, enviando para OpenAI...');
      console.log('🤖 [ChatGptService] Prompt preview:', prompt.substring(0, 300) + '...');

      const startTime = Date.now();
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em processamento de extratos bancários brasileiros com foco em faturas de cartão de crédito.

OBJETIVO: Extrair e categorizar transações de forma precisa e consistente.

REGRAS OBRIGATÓRIAS:
1. Retorne APENAS JSON válido - sem texto adicional, explicações ou markdown
2. Todos os valores devem ser números positivos (sem símbolos ou sinais)
3. Datas sempre no formato DD/MM/YYYY
4. Descrições limpas, sem códigos de cartão ou caracteres especiais desnecessários
5. Campo "payment" sempre "Cartão de Crédito"
6. Ignore linhas que não sejam transações (títulos, totais, cabeçalhos)

CATEGORIAS DISPONÍVEIS:
• Alimentação - Supermercados, restaurantes, delivery, padarias, açougues, hortifruti
• Transporte - Combustível, Uber, 99, táxi, estacionamento, pedágios, manutenção veicular
• Serviços - Streaming, assinaturas, internet, telefone, água, luz, gás
• Saúde - Farmácias, consultas, exames, planos de saúde, academias
• Lazer - Cinema, shows, bares, viagens, hotéis, entretenimento
• Educação - Cursos, livros, mensalidades escolares, material didático
• Vestuário - Roupas, calçados, acessórios, lojas de moda
• Casa e Moradia - Aluguel, condomínio, móveis, decoração, reformas, utensílios
• Bancos e Finanças - Taxas bancárias, juros, anuidades, seguros, investimentos
• Pagamentos - Valores negativos (créditos, estornos, pagamentos recebidos)
• Outros - Quando não se encaixar claramente em nenhuma categoria acima

TRATAMENTO DE CASOS ESPECIAIS:
• Parcelamentos: Manter descrição original com indicação de parcela
• Estornos/Créditos: Categoria "Pagamentos" com valor positivo
• Compras internacionais: Categorizar normalmente, manter moeda original na descrição se presente
• Transações duplicadas: Incluir todas, não filtrar`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 4000,
      });

      const processingTime = Date.now() - startTime;
      console.log('🤖 [ChatGptService] Resposta do OpenAI recebida:', {
        processingTime: `${processingTime}ms`,
        usage: completion.usage,
        choicesCount: completion.choices.length
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        console.error('❌ [ChatGptService] Nenhuma resposta do ChatGPT');
        throw new Error('No response from ChatGPT');
      }

      console.log('🤖 [ChatGptService] Resposta recebida:', {
        responseLength: response.length,
        responsePreview: response.substring(0, 200) + '...'
      });

      let parsedResponse: ChatGptResponse;
      try {
        console.log('🤖 [ChatGptService] Fazendo parse da resposta JSON...');
        parsedResponse = JSON.parse(response) as ChatGptResponse;
        console.log('✅ [ChatGptService] JSON parseado com sucesso:', {
          transactionsCount: parsedResponse.transactions?.length || 0,
          hasSummary: !!parsedResponse.summary
        });
      } catch (parseError) {
        console.error('❌ [ChatGptService] Erro ao fazer parse do JSON:', {
          error: parseError instanceof Error ? parseError.message : parseError,
          rawResponse: response.substring(0, 500) + '...'
        });
        throw new Error('Invalid JSON response from ChatGPT');
      }

      console.log('🤖 [ChatGptService] Validando resposta...');
      this.validateResponse(parsedResponse);

      console.log('✅ [ChatGptService] Processamento concluído com sucesso');
      return parsedResponse;
    } catch (error) {
      console.error('❌ [ChatGptService] Erro no processamento:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        userId
      });
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`ChatGPT processing failed: ${errorMessage}`);
    }
  }

  private createPrompt(extractedText: string, userId: string): string {
    return `Analise a fatura de cartão de crédito abaixo e extraia TODAS as transações encontradas.

═══════════════════════════════════════════════════════════════
TEXTO DA FATURA:
═══════════════════════════════════════════════════════════════
${extractedText}

═══════════════════════════════════════════════════════════════
INSTRUÇÕES DE EXTRAÇÃO:
═══════════════════════════════════════════════════════════════

1. IDENTIFICAÇÃO DE TRANSAÇÕES:
   • Procure por linhas contendo valores monetários (R$, reais, ou números com vírgula/ponto decimal)
   • Cada transação geralmente contém: data + descrição + valor
   • Ignore cabeçalhos, rodapés, totais gerais e linhas informativas

2. EXTRAÇÃO DE DADOS:
   • DATA: Converta para DD/MM/YYYY (ex: "06 AGO" → "06/08/2025")
   • DESCRIÇÃO: Remova códigos de cartão (ex: "**** 1234"), mantenha nome do estabelecimento
   • VALOR: Extraia apenas o número, sempre positivo (ex: "R$ 82,66" → 82.66)
   • PAYMENT: Sempre "Cartão de Crédito"
   • USERID: Use "${userId}"

3. CATEGORIZAÇÃO INTELIGENTE:

   ALIMENTAÇÃO:
   • Supermercados: Carrefour, Pão de Açúcar, Extra, Walmart
   • Restaurantes: iFood, Rappi, Uber Eats, nomes de restaurantes
   • Padarias, açougues, hortifruti, mercadinhos

   TRANSPORTE:
   • Combustível: Shell, Ipiranga, Petrobras, BR, postos
   • Apps: Uber, 99, Cabify, Taxi
   • Estacionamento, pedágios, lavagem de carro

   SERVIÇOS:
   • Streaming: Netflix, Spotify, Amazon Prime, Disney+, YouTube
   • Telecom: Vivo, Claro, Tim, Oi, internet, telefone
   • Utilidades: Conta de luz, água, gás

   SAÚDE:
   • Farmácias: Drogasil, Raia, Pacheco, Pague Menos
   • Planos de saúde, consultas médicas, exames
   • Academias: Smart Fit, Bio Ritmo

   LAZER:
   • Entretenimento: Cinema, shows, eventos, ingressos
   • Viagens: Hotéis, Airbnb, passagens, turismo
   • Bares, pubs, casas noturnas

   EDUCAÇÃO:
   • Cursos online: Udemy, Coursera, Alura
   • Livrarias: Amazon, Saraiva, Cultura
   • Mensalidades escolares, material didático

   VESTUÁRIO:
   • Lojas: Renner, C&A, Riachuelo, Zara, Nike, Adidas
   • Calçados, acessórios, joias

   CASA E MORADIA:
   • Móveis: Tok&Stok, Leroy Merlin, Casas Bahia
   • Decoração, utensílios domésticos
   • Aluguel, condomínio, reformas

   BANCOS E FINANÇAS:
   • Taxas: Anuidade, juros, IOF, tarifas bancárias
   • Seguros: Seguro de vida, residencial, veicular
   • Investimentos, corretoras

   PAGAMENTOS:
   • Estornos, créditos, devoluções
   • Pagamentos recebidos (valores negativos no extrato)

   OUTROS:
   • Quando não houver correspondência clara com as categorias acima
   • Transações genéricas ou não identificáveis

4. CASOS ESPECIAIS:
   • Parcelamentos: Mantenha "Parcela X/Y" na descrição
   • Valores negativos: Use categoria "Pagamentos", mas valor positivo no JSON
   • Compras internacionais: Categorize normalmente
   • Assinaturas recorrentes: Identifique pela descrição (ex: "Netflix" → Serviços)

═══════════════════════════════════════════════════════════════
FORMATO DE SAÍDA (JSON):
═══════════════════════════════════════════════════════════════

{
  "transactions": [
    {
      "date": "06/08/2025",
      "description": "Mercadopago Fisiacom - Parcela 3/3",
      "value": 82.66,
      "category": "Saúde",
      "payment": "Cartão de Crédito",
      "userId": "${userId}"
    },
    {
      "date": "08/08/2025",
      "description": "iFood - Restaurante Italiano",
      "value": 45.90,
      "category": "Alimentação",
      "payment": "Cartão de Crédito",
      "userId": "${userId}"
    },
    {
      "date": "10/08/2025",
      "description": "Posto Shell - Gasolina",
      "value": 250.00,
      "category": "Transporte",
      "payment": "Cartão de Crédito",
      "userId": "${userId}"
    }
  ],
  "summary": {
    "totalTransactions": 3,
    "totalValue": 378.56,
    "categories": {
      "Saúde": {
        "count": 1,
        "totalValue": 82.66
      },
      "Alimentação": {
        "count": 1,
        "totalValue": 45.90
      },
      "Transporte": {
        "count": 1,
        "totalValue": 250.00
      }
    }
  }
}

═══════════════════════════════════════════════════════════════
IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.
═══════════════════════════════════════════════════════════════`;
  }

  private validateResponse(response: ChatGptResponse): void {
    console.log('🔍 [ChatGptService] Validando resposta:', {
      hasTransactions: !!response.transactions,
      transactionsCount: response.transactions?.length || 0,
      hasSummary: !!response.summary
    });

    if (!response.transactions || !Array.isArray(response.transactions)) {
      console.error('❌ [ChatGptService] Validação falhou: array de transações inválido');
      throw new Error('Invalid response: transactions array is required');
    }

    if (!response.summary) {
      console.error('❌ [ChatGptService] Validação falhou: resumo ausente');
      throw new Error('Invalid response: summary is required');
    }

    console.log('🔍 [ChatGptService] Validando transações individuais...');
    for (let i = 0; i < response.transactions.length; i++) {
      const transaction = response.transactions[i];
      
      if (!transaction.date || !transaction.description || !transaction.value) {
        console.error(`❌ [ChatGptService] Transação ${i} inválida: campos obrigatórios ausentes`, transaction);
        throw new Error('Invalid transaction: missing required fields');
      }

      if (typeof transaction.value !== 'number' || transaction.value <= 0) {
        console.error(`❌ [ChatGptService] Transação ${i} inválida: valor inválido`, transaction);
        throw new Error('Invalid transaction: value must be a positive number');
      }

      if (!transaction.category || !transaction.payment || !transaction.userId) {
        console.error(`❌ [ChatGptService] Transação ${i} inválida: categoria/pagamento/userId ausente`, transaction);
        throw new Error('Invalid transaction: missing category, payment or userId');
      }
    }

    console.log('✅ [ChatGptService] Validação concluída com sucesso');
  }
}

export default new ChatGptService();
