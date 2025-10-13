import { repository } from "@/data/repositories";
import React, { useState } from "react";

interface PdfUploaderProps {
  userId: string;
  onUploadSuccess?: () => void;
}

const PdfUploader = ({ userId, onUploadSuccess }: PdfUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    validateAndSetFile(selectedFile);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const droppedFile = event.dataTransfer.files?.[0];
    validateAndSetFile(droppedFile);
  };

  const validateAndSetFile = (selectedFile: File | undefined) => {
    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setMessage("Por favor, selecione apenas arquivos PDF");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Por favor, selecione um arquivo PDF");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await repository.invoice.uploadPdfInvoices(userId, file);

      setMessage(
        `Sucesso! ${result.invoicesCreated || 0} faturas foram criadas.`
      );
      setFile(null);
      resetFileInput();

      onUploadSuccess?.();
    } catch (error) {
      setMessage(
        `Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const resetFileInput = () => {
    const fileInput = document.getElementById("pdfFile") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Upload de Faturas via PDF
      </h2>

      {/* Área de upload com drag and drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center transition-colors ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id="pdfFile"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
        />

        <label htmlFor="pdfFile" className="cursor-pointer block">
          <div className="flex flex-col items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-600 mb-1">
              {file
                ? file.name
                : "Arraste e solte um arquivo PDF aqui ou clique para selecionar"}
            </p>
            <p className="text-sm text-gray-500">
              Apenas arquivos PDF são aceitos
            </p>
          </div>
        </label>
      </div>

      {/* Botão de upload */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
          !file || loading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700 text-white"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processando...
          </span>
        ) : (
          "Enviar PDF"
        )}
      </button>

      {/* Mensagem de feedback */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            message.includes("Erro")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Informações sobre o formato esperado */}
      <div className="mt-6 bg-gray-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Como funciona:
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• O sistema extrai automaticamente as transações do PDF</li>
          <li>• Categoriza as despesas baseado na descrição</li>
          <li>• Funciona melhor com faturas de cartão de crédito</li>
          <li>• Suporta PDFs com texto (não imagens escaneadas)</li>
        </ul>
      </div>
    </div>
  );
};

export default PdfUploader;
