import { repository } from '@/data/repositories';
import React, { useState } from 'react';

interface CsvUploaderProps {
  userId: string;
  onUploadSuccess?: () => void;
}

const CsvUploader = ({ userId, onUploadSuccess }: CsvUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
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

    if (selectedFile.type !== 'text/csv') {
      setMessage('Por favor, selecione apenas arquivos CSV');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Por favor, selecione um arquivo CSV');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await repository.invoice.uploadCsvInvoices(userId, file);
      setMessage(`Sucesso! ${result.invoicesCreated || 0} faturas foram importadas.`);
      setFile(null);
      resetFileInput();
      
      onUploadSuccess?.();
    } catch (error) {
      setMessage(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetFileInput = () => {
    const fileInput = document.getElementById('csvFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload de Faturas via CSV</h2>
      
      {/* Área de upload com drag and drop */}
      <div 
        className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center transition-colors ${
          isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id="csvFile"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
        />
        
        <label 
          htmlFor="csvFile" 
          className="cursor-pointer block"
        >
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-gray-600 mb-1">
              {file ? file.name : 'Arraste e solte um arquivo CSV aqui ou clique para selecionar'}
            </p>
            <p className="text-sm text-gray-500">
              Apenas arquivos CSV são aceitos
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
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </span>
        ) : 'Enviar CSV'}
      </button>

      {/* Mensagem de feedback */}
      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.includes('Erro') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Exemplo do formato CSV */}
      <div className="mt-6 bg-gray-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Formato esperado do CSV:</h3>
        <div className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
          <pre className="text-sm">
            <code>
{`date,title,amount
2025-01-15,Compra supermercado,150.50
2025-01-16,Conta de luz,89.30
2025-01-17,Gasolina posto,200.00`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CsvUploader;