/* eslint-disable prettier/prettier */
import { MultipartFile } from '@fastify/multipart';

export const validateCsvDTO = (file: MultipartFile): { isValid: boolean; message?: string } => {
  if (!file) {
    return { isValid: false, message: 'No file provided' };
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (file.mimetype !== 'text/csv') {
    return { isValid: false, message: 'The file must be a CSV' };
  }

  return { isValid: true };
};

export type CsvInvoiceData = {
  date: string;
  title: string;
  amount: string;
};

// Função para categorizar automaticamente baseado no título
const categorizeByTitle = (title: string): string => {
  const titleLower = title.toLowerCase().trim();

  // Alimentação
  if (
    titleLower.includes('supermercado') ||
    titleLower.includes('mercado') ||
    titleLower.includes('padaria') ||
    titleLower.includes('restaurante') ||
    titleLower.includes('lanchonete') ||
    titleLower.includes('ifood') ||
    titleLower.includes('uber eats') ||
    titleLower.includes('delivery') ||
    titleLower.includes('açougue') ||
    titleLower.includes('armazem')
  ) {
    return 'Alimentação';
  }

  // Transporte
  if (
    titleLower.includes('posto') ||
    titleLower.includes('gasolina') ||
    titleLower.includes('combustível') ||
    titleLower.includes('uber') ||
    titleLower.includes('99') ||
    titleLower.includes('taxi') ||
    titleLower.includes('ônibus') ||
    titleLower.includes('metrô') ||
    titleLower.includes('estacionamento') ||
    titleLower.includes('pedágio')
  ) {
    return 'Transporte';
  }

  // Contas e Serviços
  if (
    titleLower.includes('luz') ||
    titleLower.includes('energia') ||
    titleLower.includes('água') ||
    titleLower.includes('enel') ||
    titleLower.includes('sabesp') ||
    titleLower.includes('internet') ||
    titleLower.includes('telefone') ||
    titleLower.includes('celular') ||
    titleLower.includes('vivo') ||
    titleLower.includes('tim') ||
    titleLower.includes('claro') ||
    titleLower.includes('oi') ||
    titleLower.includes('netflix') ||
    titleLower.includes('spotify') ||
    titleLower.includes('amazon prime') ||
    titleLower.includes('apple')  ||
    titleLower.includes('sony')
  ) {
    return 'Serviços';
  }

  // Saúde
  if (
    titleLower.includes('farmácia') ||
    titleLower.includes('drogaria') ||
    titleLower.includes('médico') ||
    titleLower.includes('hospital') ||
    titleLower.includes('clínica') ||
    titleLower.includes('laboratório') ||
    titleLower.includes('exame') ||
    titleLower.includes('consulta') ||
    titleLower.includes('dentista') ||
    titleLower.includes('academia') ||
    titleLower.includes('fit') 
  ) {
    return 'Saúde';
  }

  // Lazer e Entretenimento
  if (
    titleLower.includes('cinema') ||
    titleLower.includes('teatro') ||
    titleLower.includes('show') ||
    titleLower.includes('evento') ||
    titleLower.includes('bar') ||
    titleLower.includes('balada') ||
    titleLower.includes('clube') ||
    titleLower.includes('parque') ||
    titleLower.includes('shopping')
  ) {
    return 'Lazer';
  }

  // Educação
  if (
    titleLower.includes('escola') ||
    titleLower.includes('faculdade') ||
    titleLower.includes('universidade') ||
    titleLower.includes('curso') ||
    titleLower.includes('livro') ||
    titleLower.includes('material escolar') ||
    titleLower.includes('mensalidade')
  ) {
    return 'Educação';
  }

  // Vestuário
  if (
    titleLower.includes('roupa') ||
    titleLower.includes('calçado') ||
    titleLower.includes('sapato') ||
    titleLower.includes('tênis') ||
    titleLower.includes('loja') ||
    titleLower.includes('shopping') ||
    titleLower.includes('renner') ||
    titleLower.includes('c&a') ||
    titleLower.includes('zara') ||
    titleLower.includes('look')

  ) {
    return 'Vestuário';
  }

  // Casa e Moradia
  if (
    titleLower.includes('aluguel') ||
    titleLower.includes('condomínio') ||
    titleLower.includes('iptu') ||
    titleLower.includes('reforma') ||
    titleLower.includes('móveis') ||
    titleLower.includes('decoração') ||
    titleLower.includes('limpeza') ||
    titleLower.includes('manutenção')
  ) {
    return 'Casa e Moradia';
  }

  // Bancos e Finanças
  if (
    titleLower.includes('banco') ||
    titleLower.includes('taxa') ||
    titleLower.includes('juros') ||
    titleLower.includes('anuidade') ||
    titleLower.includes('financiamento') ||
    titleLower.includes('empréstimo') ||
    titleLower.includes('investimento')
  ) {
    return 'Bancos e Finanças';
  }

  // Se não encontrar nenhuma categoria específica
  return 'Outros';
};

export const parseCsvRowDTO = (row: CsvInvoiceData, userId: string) => {
  return {
    date: row.date,
    description: row.title,
    value: parseFloat(parseFloat(row.amount).toFixed(2)),
    category: categorizeByTitle(row.title),
    payment: 'Cartão de Crédito',
    userId: userId,
  };
};
