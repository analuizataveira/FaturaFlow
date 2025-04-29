import { Transaction } from '../../models/Transaction';


interface CostsListProps {
    transactions: Transaction[];
    isSaving: boolean;
    onSave: () => void;
    onDelete: (index: number) => void;
  }
  

export default function CostsList({ transactions, isSaving, onSave, onDelete }: CostsListProps) {
    return (
        <div className="card bg-base-100 shadow-xl border border-gray-100">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <h2 className="card-title text-gray-700">Transações Adicionadas</h2>
                    <span className="badge badge-info">{transactions.length} itens</span>
                </div>

                {transactions.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        <TransactionsTable transactions={transactions} onDelete={onDelete} />
                        <SaveButton
                            isSaving={isSaving}
                            onSave={onSave}
                            disabled={transactions.length === 0 || isSaving}
                            totalAmount={transactions.reduce((sum, item) => sum + item.amount, 0)}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

// Componente para estado vazio
function EmptyState() {
    return (
        <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <p className="text-gray-500">Nenhuma transação adicionada ainda</p>
            <p className="text-sm text-gray-400 mt-2">Adicione transações usando o formulário ao lado</p>
        </div>
    );
}

// Componente para tabela de transações
function TransactionsTable({ transactions, onDelete }: { 
    transactions: Transaction[]; 
    onDelete: (index: number) => void 
  }) {
    return (
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item, index) => (
              <TransactionRow 
                key={index} 
                transaction={item} 
                onDelete={() => onDelete(index)}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
// Componente para linha da tabela
function TransactionRow({ transaction, onDelete }: { 
    transaction: Transaction;
    onDelete: () => void;
  }) {
    return (
      <tr className="hover:bg-gray-50">
        <td>{new Date(transaction.date).toLocaleDateString()}</td>
        <td className="font-medium">{transaction.description}</td>
        <td className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
          R$ {transaction.amount.toFixed(2)}
        </td>
        <td>
          <span className="badge badge-outline">
            {transaction.category}
          </span>
        </td>
        <td>
          <button 
            onClick={onDelete}
            className="btn btn-ghost btn-xs text-red-500 hover:bg-red-50"
            aria-label="Excluir transação"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </td>
      </tr>
    );
  }

// Componente para botão de salvar
function SaveButton({
    isSaving,
    onSave,
    disabled,
    totalAmount
}: {
    isSaving: boolean;
    onSave: () => void;
    disabled: boolean;
    totalAmount: number;
}) {
    return (
        <div className="card-actions justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
                Total: <span className="font-bold">R$ {totalAmount.toFixed(2)}</span>
            </div>
            <button
                className="btn btn-success"
                onClick={onSave}
                disabled={disabled}
            >
                {isSaving ? (
                    <>
                        <span className="loading loading-spinner"></span>
                        Salvando...
                    </>
                ) : (
                    'Salvar Todas as Transações'
                )}
            </button>
        </div>
    );
}