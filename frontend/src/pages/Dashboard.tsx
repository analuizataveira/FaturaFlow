import NavBar from "../components/Navbar";

// Interface para o evento de mudança do input
interface FileChangeEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

// Interface para tipagem dos dados do CSV
interface CSVData {
  [key: string]: string;
}

export default function Dashboard() {
  // Função para lidar com a importação do CSV
  const handleCSVImport = (): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.addEventListener('change', (event: Event) => {
      const fileEvent = event as FileChangeEvent;
      const file = fileEvent.target.files?.[0];

      if (file) {
        readCSVFile(file);
      }
    });

    input.click();
  };

  // Função para ler o conteúdo do arquivo
  const readCSVFile = (file: File): void => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string;
      const data = parseCSV(text);
      console.log('Dados do CSV:', data);
      // Aqui você pode adicionar lógica para usar os dados
    };

    reader.onerror = (e) => {
      console.error('Erro ao ler o arquivo:', e);
    };

    reader.readAsText(file);
  };

  // Função para parsear o CSV usando a interface CSVData
  const parseCSV = (csvText: string): CSVData[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const result: CSVData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim());
      const obj: CSVData = {};

      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });

      result.push(obj);
    }

    return result;
  };

  return (
    <div>
      <NavBar page={"Dashboard"} />
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-center text-base/7 font-semibold text-indigo-600">FaturaFlow</h2>
        <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
          Tudo que você precisa para gerenciar suas finanças
        </p>
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-1">
          <div className="relative max-lg:row-start-1">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-10 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Importação
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Aqui você pode importar seus dados financeiros em formato CSV.
                </p>
                <button className="btn btn-info mt-4"
                  onClick={handleCSVImport}>
                  Importar CSV
                  </button>

              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
          </div>
        </div>
      </div>
    </div>

  )
}