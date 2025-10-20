# 📚 App Scholar

Aplicativo mobile para **gerenciamento de boletins acadêmicos** de instituições de graduação tecnológica.  
Desenvolvido com **React Native (Expo)** no frontend e **Node.js + PostgreSQL** no backend.

---

## 🚀 Como executar o projeto

### 🔹 Backend
1. Acesse a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o banco de dados PostgreSQL no arquivo `.env`:
   ```env
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=app_scholar
   JWT_SECRET=sua_chave_secreta
   ```
4. Inicie o servidor:
   ```bash
   npm run dev
   ```
> O backend rodará em **http://localhost:3000**

---

### 🔹 Frontend
1. Acesse a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o aplicativo com Expo:
   ```bash
   npx expo start
   ```
4. Escaneie o QR code no terminal com o aplicativo **Expo Go** (Android/iOS)  
   ou use um **emulador**.

---

## ⚙️ Funcionalidades da Entrega 1
- Estrutura do projeto criada no **Expo.dev**  
- Conexão inicial com o **PostgreSQL**  
- **Sistema de login e autenticação de usuários**  
- **Primeira API** implementada com JWT  

---

## 👩‍💻 Tecnologias Utilizadas
- **React Native + Expo**  
- **Node.js + Express**  
- **PostgreSQL**  
- **JWT + bcryptjs**
