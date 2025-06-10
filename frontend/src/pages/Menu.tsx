import { useNavigate } from "react-router";
import NavBar from "../components/Navbar";
import { useState } from "react";
import Modal from "../components/Modal";
import CsvUploader from "../components/CSVUploader";


export default function Menu() {
  const navigate = useNavigate();
  const [showCsvUpload, setShowCsvUpload] = useState(false);


  // Pega o usuário do localStorage
  const [user] = useState(() => {
    const userData = localStorage.getItem('session');
    return userData ? JSON.parse(userData) : null;
  });

  // Função para quando o upload CSV for bem-sucedido
  const handleCsvUploadSuccess = () => {
    setShowCsvUpload(false); // Fecha o modal de upload
    navigate('/invoicesform');
  };

  return (
    <div>
      <NavBar/>
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-center text-base/7 font-semibold text-indigo-600">FaturaFlow</h2>
        <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
          Tudo que você precisa para gerenciar suas finanças
        </p>



        {/* Container principal com flex para alinhar os quadrados */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mt-10">
          {/* Primeiro quadrado */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-10 sm:pt-10 bg-white rounded-lg shadow">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 text-center">
                  Importação
                </p>
                <p className="mt-2 text-sm/6 text-gray-600 text-center">
                  Aqui você pode importar seus dados financeiros em formato CSV.
                </p>
                <button
                  className="btn btn-info mt-4 mx-auto flex items-center gap-2 px-4 py-2"
                  onClick={() => setShowCsvUpload(true)}
                  disabled={!user?.id}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Importar CSV
                </button>
                </div>
              <div className="pointer-events-none absolute inset-px rounded-lg ring-1 ring-black/5"></div>
            </div>
          </div>

          {/* Segundo quadrado */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-10 sm:pt-10 bg-white rounded-lg shadow">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 text-center">
                  Inserir dados manualmente
                </p>
                <p className="mt-2 text-sm/6 text-gray-600 text-center">
                  Inserir dados referentes a fatura o cartão e outros gastos manualmente.
                </p>
                <button
                  className="btn btn-info mt-4 mx-auto block"
                  onClick={() => navigate('/invoicesform')}
                >
                  Inserir Manualmente
                </button>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg ring-1 ring-black/5"></div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showCsvUpload}
        onCloseClick={() => setShowCsvUpload(false)}
      >
        <CsvUploader
          userId={user?.id || ''}
          onUploadSuccess={handleCsvUploadSuccess}
        />
      </Modal>
    </div>
  );
}