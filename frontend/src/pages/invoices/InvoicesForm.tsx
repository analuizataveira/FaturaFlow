import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import NavBar from "../../components/Navbar";
import { Invoice } from "../../models/Invoice";
import {
  createInvoice,
  getCurrentDateFormatted,
} from "../../services/InvoiceService";
import AnalysisResults from "./AnalysisResults";
import InvoicesList from "./InvoicesList";
import FileUploader from "../../components/FileUploader";

const InvoiceForm = () => {
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const [invoice, setInvoice] = useState<Invoice>({
    date: getCurrentDateFormatted(),
    description: "",
    value: 0,
    category: "",
    payment: "",
    userId: "",
  });

  const [user] = useState(() => {
    const userData = localStorage.getItem("session");
    return userData ? JSON.parse(userData) : null;
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já viu o guia de ajuda
    const hasSeenHelp = localStorage.getItem("hasSeenInvoicesHelp");

    if (!hasSeenHelp) {
      setShowHelpModal(true);
    }

    if (user) {
      setInvoice((prev) => ({
        ...prev,
        userId: user.id,
      }));
    }
  }, [user]);

  const handleCloseHelp = () => {
    setShowHelpModal(false);
    // Marca que o usuário já viu o guia de ajuda
    localStorage.setItem("hasSeenInvoicesHelp", "true");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({
      ...prev,
      [name]: name === "value" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileUploadSuccess = () => {
    setRefreshTrigger((prev) => !prev);
    setShowFileUpload(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !invoice.description ||
      !invoice.value ||
      !invoice.category ||
      !invoice.payment
    ) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      await createInvoice({
        ...invoice,
        userId: user?.id || "",
      });

      setRefreshTrigger((prev) => !prev);

      setInvoice({
        _id: "",
        date: getCurrentDateFormatted(),
        description: "",
        value: 0,
        category: "",
        payment: "",
        userId: user?.id || "",
      });

      setErrorMessage("");
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      setErrorMessage("Ocorreu um erro ao adicionar a transação");
    }
  };

  return (
    <div>
      <NavBar />
      {showAnalysis && (
        <AnalysisResults
          transactions={invoicesList}
          onClose={() => setShowAnalysis(false)}
        />
      )}

      {/* Modal de Ajuda */}
      <Modal isOpen={showHelpModal} onCloseClick={handleCloseHelp}>
        <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Guia de Ajuda - Despesas
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                Como registrar suas despesas
              </h3>
              <p className="text-gray-700 mb-3">
                Preencha cuidadosamente cada campo do formulário para registrar
                suas despesas de forma organizada.
              </p>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div>
                    <strong className="text-indigo-700">Todos os campos</strong>{" "}
                    são obrigatórios para um registro completo.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div>
                    <strong className="text-indigo-700">Data precisa</strong>{" "}
                    ajuda na organização mensal/anual.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div>
                    <strong className="text-green-700">
                      Use o Upload de Arquivos
                    </strong>{" "}
                    para adicionar múltiplas despesas de uma vez!
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Categorias disponíveis
              </h3>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Alimentação
                </span>
                <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Transporte
                </span>
                <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Saúde
                </span>
                <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Lazer
                </span>
                <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Educação
                </span>
                <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Serviços
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                💡 Dica importante
              </h3>
              <p className="text-gray-700">
                Este guia só aparece na primeira vez. Você pode sempre acessá-lo
                novamente clicando no botão <strong>"Ajuda"</strong> no topo da
                página.
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button onClick={handleCloseHelp} className="btn btn-primary">
              Entendi! Não mostrar novamente
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal para Upload de Arquivos */}
      <Modal
        isOpen={showFileUpload}
        onCloseClick={() => setShowFileUpload(false)}
      >
        <FileUploader
          userId={user?.id || ""}
          onUploadSuccess={handleFileUploadSuccess}
        />
      </Modal>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Registrar Despesa</h1>
          <div className="flex gap-2">
            {/* Botão para Upload de Arquivos */}
            <button
              className="btn btn-outline btn-primary"
              onClick={() => setShowFileUpload(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload Arquivo
            </button>

            <button
              className="btn btn-ghost text-indigo-600 hover:bg-indigo-50"
              onClick={() => setShowHelpModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Ajuda
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... resto do formulário permanece igual ... */}
            <div>
              <label className="block mb-1">Data</label>
              <input
                type="date"
                name="date"
                value={invoice.date}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Descrição</label>
              <input
                type="text"
                name="description"
                value={invoice.description}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Valor</label>
              <input
                name="value"
                value={invoice.value}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Categoria</label>
              <select
                name="category"
                value={invoice.category}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="">Selecione</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Transporte">Transporte</option>
                <option value="Educação">Educação</option>
                <option value="Lazer">Lazer</option>
                <option value="Saúde">Saúde</option>
                <option value="Serviços">Serviços</option>
                <option value="Educação">Educação</option>
                <option value="Vestuário">Vestuário</option>
                <option value="Moradia">Moradia</option>
                <option value="Bancos e Finanças">Bancos e Finanças</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Forma de Pagamento</label>
              <select
                name="payment"
                value={invoice.payment}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="">Selecione</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão de crédito">Cartão de Crédito</option>
                <option value="Cartão de débito">Cartão de Débito</option>
                <option value="Pix">Pix</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Adicionar
            </button>
          </form>

          <InvoicesList
            refreshTrigger={refreshTrigger}
            onInvoiceDelete={(id) => {
              setInvoicesList((prev) =>
                prev.filter((invoice) => invoice._id !== id)
              );
              setRefreshTrigger((prev) => !prev);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
