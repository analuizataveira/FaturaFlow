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
      <div style={{ padding: '20px' }}>
        <button 
          onClick={handleCSVImport}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Importar CSV
        </button>
      </div>
    </div>
  );
}