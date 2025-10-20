import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './database/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'App Scholar API - Entrega 1',
    timestamp: new Date().toISOString()
  });
});

// API de Autenticação
app.post('/api/auth/login', async (req: express.Request, res: express.Response) => {
  try {
    const { email, senha } = req.body;

    // Validação
    if (!email || !senha) {
      res.status(400).json({ message: 'Email e senha são obrigatórios' });
      return;
    }

    // Buscar usuário
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ message: 'Credenciais inválidas' });
      return;
    }

    const usuario = result.rows[0];

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    
    if (!senhaValida) {
      res.status(401).json({ message: 'Credenciais inválidas' });
      return;
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        perfil: usuario.perfil,
        email: usuario.email 
      },
      process.env.JWT_SECRET || 'app_scholar_secret_2024',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      perfil: usuario.perfil,
      nome: usuario.nome,
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Middleware de Autenticação
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'Token de autenticação não fornecido' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'Token mal formatado' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'app_scholar_secret_2024') as any;
    (req as any).user = decoded;
    next();
    
  } catch (error) {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

// API para validar token
app.get('/api/auth/validate', authMiddleware, (req: express.Request, res: express.Response) => {
  res.json({ 
    valid: true, 
    user: (req as any).user 
  });
});

// API para obter perfil do usuário
app.get('/api/auth/profile', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    
    const result = await pool.query(
      'SELECT id, email, perfil, nome, created_at FROM usuarios WHERE id = $1',
      [user.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Inicialização do Banco de Dados
const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Inicializando banco de dados...');
    
    // Criar tabela se não existir
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('admin', 'professor', 'aluno')),
        nome VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Hash correto para senha "1234"
    const SENHA_CORRETA_HASH = '$2a$10$CbNDV9rPNyjk9NnyZBeZfer/BciSJWLzmvcFO6aYz7m3FJfQ0MzU.';
    
    // Inserir usuários de teste
    const users = [
      {
        email: 'admin@app.com',
        senha_hash: SENHA_CORRETA_HASH,
        perfil: 'admin',
        nome: 'Administrador Sistema'
      },
      {
        email: 'prof@app.com',
        senha_hash: SENHA_CORRETA_HASH,
        perfil: 'professor',
        nome: 'Professor André Olimpio'
      },
      {
        email: 'aluno@app.com',
        senha_hash: SENHA_CORRETA_HASH,
        perfil: 'aluno',
        nome: 'Aluno João Silva'
      }
    ];

    for (const user of users) {
      await pool.query(`
        INSERT INTO usuarios (email, senha_hash, perfil, nome) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
      `, [user.email, user.senha_hash, user.perfil, user.nome]);
    }

    console.log('✅ Banco de dados inicializado com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
  }
};

// Rota não encontrada
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Inicializar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Acesso pela rede: http://192.168.18.14:${PORT}/api/health`);
  console.log(`📚 App Scholar - Entrega 1: Autenticação`);
  console.log('');
  console.log('🔑 Credenciais para teste:');
  console.log('   👨‍💼 Admin:     admin@app.com / 1234');
  console.log('   👨‍🏫 Professor: prof@app.com  / 1234');
  console.log('   👨‍🎓 Aluno:     aluno@app.com / 1234');
  console.log('');
  
  await initializeDatabase();
});

export default app;