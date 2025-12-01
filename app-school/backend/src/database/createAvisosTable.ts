import pool from './config';

const createAvisosTable = async (): Promise<void> => {
  try {
    console.log('🔄 Criando tabela de avisos...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS avisos (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        mensagem TEXT NOT NULL,
        tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('geral', 'importante', 'alerta', 'informacao')),
        autor_id INTEGER REFERENCES usuarios(id),
        data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_expiracao TIMESTAMP,
        lido_por INTEGER[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela "avisos" criada');

    // Inserir alguns avisos de teste
    const avisosTeste = [
      {
        titulo: 'Início do Semestre 2024.2',
        mensagem: 'As aulas do semestre 2024.2 terão início no dia 05/08. Verifiquem seus horários no portal.',
        tipo: 'geral',
        autor_id: 2,
        data_expiracao: '2024-08-10 23:59:59'
      },
      {
        titulo: 'Manutenção do Sistema',
        mensagem: 'O sistema ficará indisponível no sábado (03/08) das 8h às 12h para manutenção programada.',
        tipo: 'alerta',
        autor_id: 1,
        data_expiracao: '2024-08-04 23:59:59'
      },
      {
        titulo: 'Prazo para Entrega de Trabalhos',
        mensagem: 'O prazo para entrega dos trabalhos de Programação Mobile é 15/08. Não deixem para a última hora!',
        tipo: 'importante',
        autor_id: 2,
        data_expiracao: '2024-08-15 23:59:59'
      }
    ];

    for (const aviso of avisosTeste) {
      await pool.query(
        `INSERT INTO avisos (titulo, mensagem, tipo, autor_id, data_expiracao) 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [aviso.titulo, aviso.mensagem, aviso.tipo, aviso.autor_id, aviso.data_expiracao]
      );
    }

    console.log('✅ Avisos de teste inseridos');
  } catch (error) {
    console.error('❌ Erro ao criar tabela de avisos:', error);
    throw error;
  }
};

export default createAvisosTable;