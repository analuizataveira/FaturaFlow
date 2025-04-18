# 💳 Gerenciador de Faturas de Cartão de Crédito

Uma aplicação web que permite importar faturas de cartão de crédito, visualizar os gastos por categoria de forma gráfica e acompanhar um resumo financeiro interativo.

## ✨ Recursos Principais

✅ **Autenticação segura** (JWT)  
✅ **Importação de faturas** em CSV ou PDF  
✅ **Dashboard intuitivo** com **gráficos interativos** (pizza ou barras)  
✅ **Resumo financeiro** com totais por categoria (alimentação, transporte, lazer etc.)  
✅ **Efeitos visuais com Vanta.js (Halo)**  
✅ **Tema escuro/claro** (opcional)  
✅ **Responsivo** – funciona bem em desktop e mobile  
✅ **Sem banco de dados** – dados são armazenados apenas na sessão do usuário

## ⚙️ Tecnologias Utilizadas

**Frontend**  
- React  
- JavaScript (ES6)  
- HTML5 & CSS3  
- Material UI ou Styled-components  
- Chart.js ou Recharts  
- Redux ou Context API  
- Vanta.js (efeitos visuais)

**Backend**  
- Node.js  
- TypeScript  
- Fastify  
- papaparse (CSV)  
- pdf.js (PDF)

## 🛠️ Comandos Úteis

### 🔹 Rodar o Frontend

```bash
cd frontend
npm install
npm run dev
```

### 🔹 Rodar o Backend + Banco (via Docker Compose)

```bash
cd backend
docker compose up -d
npm install
npm run dev
```
💡 Obs.: O backend é responsável por processar os arquivos enviados e retornar os dados formatados para o frontend.

## 📂 Estrutura da Aplicação
Upload da fatura pelo usuário

Backend processa o CSV ou PDF

Frontend exibe gráficos e resumo dos gastos

Os dados são temporários (armazenados apenas na sessão)

### 👥 Integrantes
Rafael Carolino
Ana Luiza Taveira