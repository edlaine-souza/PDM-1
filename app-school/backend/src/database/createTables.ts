import pool from './config';

const createTables = async (): Promise<void> => {
  try {
    console.log('🔄 Criando tabelas...');
    
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
    console.log('✅ Tabela "usuarios" criada');

    // Usuários de teste (senha: 1234)
    const users = [
      {
        email: 'admin@app.com',
        senha_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMye.J8I6NQwJgUX.5oTm6kzXEGMpV4AvBS',
        perfil: 'admin',
        nome: 'Administrador Sistema'
      },
      {
        email: 'prof@app.com',
        senha_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMye.J8I6NQwJgUX.5oTm6kzXEGMpV4AvBS',
        perfil: 'professor',
        nome: 'Professor André Olimpio'
      },
      {
        email: 'aluno@app.com',
        senha_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMye.J8I6NQwJgUX.5oTm6kzXEGMpV4AvBS',
        perfil: 'aluno',
        nome: 'Aluno João Silva'
      }
    ];

    for (const user of users) {
      await pool.query(
        `INSERT INTO usuarios (email, senha_hash, perfil, nome) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (email) DO NOTHING`,
        [user.email, user.senha_hash, user.perfil, user.nome]
      );
    }

    console.log('✅ Usuários de teste inseridos');
    console.log('🎉 Banco de dados configurado!');

  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  createTables();
}

export default createTables;