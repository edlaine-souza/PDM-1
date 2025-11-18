# 📚 App Scholar

Aplicativo mobile para gerenciamento de boletins acadêmicos, desenvolvido com React Native (Expo) no frontend e Node.js + PostgreSQL no backend.

---

## 🚀 Como executar o projeto

### 🔹 Backend

# Instalação:
<p>cd backend</p>
<p>npm install</p>

# Configuração:
<h3>Crie o arquivo .env com:</h3>
<p>DB_USER=seu_usuario</p>
<p>DB_PASSWORD=sua_senha_do_postgres</p>
<p>DB_HOST=localhost</p>
<p>DB_PORT=5432</p>
<p>DB_NAME=app_scholar</p>
<p>JWT_SECRET=sua_chave_secreta</p>

<p>No arquivo database/config.ts, coloque também a senha do seu banco de dados.</p>

# Executar:
<p>npm run dev</p>

<h3>Backend disponível em:</h3>
<p>http://localhost:3000</p>

---

### 🔹 Frontend

# Instalação:
<p>cd frontend</p>
<p>npm install</p>

# Configuração da API:
<h3>Defina no arquivo Service/api.ts:</h3>
<p>export const API_BASE_URL = "http://SEU_IP_AQUI:3000/api";</p>
<p>Substitua SEU_IP_AQUI pelo seu IP local.</p>

# Executar:
<p>npx expo start</p>
<p>ou</p>
<p>npm start</p>




