# 📚 App Scholar

Aplicativo mobile para gerenciamento de boletins acadêmicos, desenvolvido com React Native (Expo) no frontend e Node.js + PostgreSQL no backend.

---

## 🚀 Como executar o projeto

### 🔹 Backend

Instalação:
cd backend
npm install

Configuração:
Crie o arquivo .env com as informações do seu banco de dados:

DB_USER=seu_usuario
DB_PASSWORD=sua_senha_do_postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_scholar
JWT_SECRET=sua_chave_secreta

No arquivo database/config.ts, coloque também a senha do seu banco de dados.

Executar:
npm run dev

O backend ficará disponível em:
http://localhost:3000


### 🔹 Frontend

Instalação:
cd frontend
npm install

Configuração da API:
No arquivo Service/api.ts, configure o IP da sua máquina:
export const API_BASE_URL = "http://SEU_IP_AQUI:3000/api";

Substitua SEU_IP_AQUI pelo IP local obtido com ipconfig (Windows) ou ifconfig (Linux/Mac).

Executar:
npx expo start ou npm start




