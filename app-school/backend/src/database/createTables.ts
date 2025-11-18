import pool from './config';

const createTables = async (): Promise<void> => {
  try {
    console.log('🔄 Criando tabelas...');
    
    // Tabela usuarios (já existente)
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

    // NOVAS TABELAS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alunos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        matricula VARCHAR(50) UNIQUE NOT NULL,
        curso VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela "alunos" criada');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS professores (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        titulacao VARCHAR(100) NOT NULL,
        tempo_docencia INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela "professores" criada');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS disciplinas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        carga_horaria INTEGER NOT NULL,
        professor_id INTEGER REFERENCES professores(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela "disciplinas" criada');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notas (
        id SERIAL PRIMARY KEY,
        aluno_id INTEGER REFERENCES alunos(id),
        disciplina_id INTEGER REFERENCES disciplinas(id),
        nota1 DECIMAL(4,2) DEFAULT 0,
        nota2 DECIMAL(4,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(aluno_id, disciplina_id)
      );
    `);
    console.log('✅ Tabela "notas" criada');

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

    // Dados de teste para as novas tabelas
    const professoresTeste = [
      { nome: 'Prof. André Olímpio', titulacao: 'Mestre', tempo_docencia: 8 },
      { nome: 'Profa. Carla Mendes', titulacao: 'Doutora', tempo_docencia: 10 }
    ];

    for (const prof of professoresTeste) {
      await pool.query(
        `INSERT INTO professores (nome, titulacao, tempo_docencia) 
         VALUES ($1, $2, $3) 
         ON CONFLICT DO NOTHING`,
        [prof.nome, prof.titulacao, prof.tempo_docencia]
      );
    }

    const alunosTeste = [
      { nome: 'João Silva', matricula: '2023001', curso: 'DSM' },
      { nome: 'Maria Souza', matricula: '2023002', curso: 'ADS' }
    ];

    for (const aluno of alunosTeste) {
      await pool.query(
        `INSERT INTO alunos (nome, matricula, curso) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (matricula) DO NOTHING`,
        [aluno.nome, aluno.matricula, aluno.curso]
      );
    }

    const disciplinasTeste = [
      { nome: 'Programação Mobile I', carga_horaria: 80, professor_id: 1 },
      { nome: 'Banco de Dados II', carga_horaria: 60, professor_id: 2 }
    ];

    for (const disc of disciplinasTeste) {
      await pool.query(
        `INSERT INTO disciplinas (nome, carga_horaria, professor_id) 
         VALUES ($1, $2, $3) 
         ON CONFLICT DO NOTHING`,
        [disc.nome, disc.carga_horaria, disc.professor_id]
      );
    }

    // Notas de teste
    const notasTeste = [
      { aluno_id: 1, disciplina_id: 1, nota1: 8.0, nota2: 9.0 },
      { aluno_id: 1, disciplina_id: 2, nota1: 7.0, nota2: 8.0 },
      { aluno_id: 2, disciplina_id: 1, nota1: 9.0, nota2: 8.5 }
    ];

    for (const nota of notasTeste) {
      await pool.query(
        `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (aluno_id, disciplina_id) DO NOTHING`,
        [nota.aluno_id, nota.disciplina_id, nota.nota1, nota.nota2]
      );
    }

    console.log('✅ Dados de teste inseridos');
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