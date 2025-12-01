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

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'App Scholar API - Entrega 2',
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

// ==================== CADASTRO DE USUÁRIOS ====================
app.post('/api/auth/register', async (req: express.Request, res: express.Response) => {
  try {
    const { email, senha, perfil, nome } = req.body;

    // Validação
    if (!email || !senha || !perfil || !nome) {
      res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      return;
    }

    // Validar perfil
    if (!['admin', 'professor', 'aluno'].includes(perfil)) {
      res.status(400).json({ message: 'Perfil inválido. Use: admin, professor ou aluno' });
      return;
    }

    // Verificar se email já existe
    const emailExists = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (emailExists.rows.length > 0) {
      res.status(400).json({ message: 'Email já cadastrado' });
      return;
    }

    // Criptografar senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // Inserir usuário
    const result = await pool.query(
      `INSERT INTO usuarios (email, senha_hash, perfil, nome) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, perfil, nome, created_at`,
      [email.toLowerCase().trim(), senhaHash, perfil, nome]
    );

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: result.rows[0].id, 
        perfil: result.rows[0].perfil,
        email: result.rows[0].email 
      },
      process.env.JWT_SECRET || 'app_scholar_secret_2024',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      perfil: result.rows[0].perfil,
      nome: result.rows[0].nome,
      message: 'Usuário cadastrado com sucesso'
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar usuários (apenas admin)
app.get('/api/usuarios', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;

    if (user.perfil !== 'admin') {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    const result = await pool.query(`
      SELECT id, email, perfil, nome, created_at 
      FROM usuarios 
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

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

// ==================== ALUNOS ====================
app.get('/api/alunos', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const result = await pool.query(`
      SELECT id, nome, matricula, curso, created_at 
      FROM alunos 
      ORDER BY nome
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/alunos', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { nome, matricula, curso } = req.body;

    if (!nome || !matricula || !curso) {
      res.status(400).json({ message: 'Nome, matrícula e curso são obrigatórios' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO alunos (nome, matricula, curso) 
       VALUES ($1, $2, $3) 
       RETURNING id, nome, matricula, curso, created_at`,
      [nome, matricula, curso]
    );

    console.log(`✅ Novo aluno cadastrado: ${nome} (${matricula})`);

    res.status(201).json({ 
      message: 'Aluno cadastrado com sucesso',
      aluno: result.rows[0]
    });
  } catch (error: any) {
    console.error('Erro ao cadastrar aluno:', error);
    
    if (error.code === '23505') { // Violação de unique constraint
      res.status(400).json({ message: 'Matrícula já cadastrada' });
      return;
    }
    
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== PROFESSORES ====================
app.get('/api/professores', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const result = await pool.query(`
      SELECT id, nome, titulacao, tempo_docencia, created_at 
      FROM professores 
      ORDER BY nome
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar professores:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/professores', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { nome, titulacao, tempo_docencia } = req.body;

    if (!nome || !titulacao || !tempo_docencia) {
      res.status(400).json({ message: 'Nome, titulação e tempo de docência são obrigatórios' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO professores (nome, titulacao, tempo_docencia) 
       VALUES ($1, $2, $3) 
       RETURNING id, nome, titulacao, tempo_docencia, created_at`,
      [nome, titulacao, parseInt(tempo_docencia)]
    );

    res.status(201).json({ 
      message: 'Professor cadastrado com sucesso',
      professor: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao cadastrar professor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== DISCIPLINAS ====================
app.get('/api/disciplinas', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const result = await pool.query(`
      SELECT d.id, d.nome, d.carga_horaria, d.professor_id,
             p.nome as professor_nome
      FROM disciplinas d
      LEFT JOIN professores p ON d.professor_id = p.id
      ORDER BY d.nome
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar disciplinas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/disciplinas', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { nome, carga_horaria, professor_id } = req.body;

    if (!nome || !carga_horaria || !professor_id) {
      res.status(400).json({ message: 'Nome, carga horária e professor são obrigatórios' });
      return;
    }

    // Verificar se professor existe
    const professorExists = await pool.query(
      'SELECT id FROM professores WHERE id = $1',
      [professor_id]
    );

    if (professorExists.rows.length === 0) {
      res.status(400).json({ message: 'Professor não encontrado' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO disciplinas (nome, carga_horaria, professor_id) 
       VALUES ($1, $2, $3) 
       RETURNING id, nome, carga_horaria, professor_id, created_at`,
      [nome, parseInt(carga_horaria), parseInt(professor_id)]
    );

    res.status(201).json({ 
      message: 'Disciplina cadastrada com sucesso',
      disciplina: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao cadastrar disciplina:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== NOTAS ====================
app.get('/api/notas/:alunoId/:disciplinaId', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { alunoId, disciplinaId } = req.params;

    const result = await pool.query(
      `SELECT * FROM notas 
       WHERE aluno_id = $1 AND disciplina_id = $2`,
      [alunoId, disciplinaId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Notas não encontradas' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar notas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/notas', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { aluno_id, disciplina_id, nota1, nota2 } = req.body;
    const user = (req as any).user;

    // Verificar se o usuário é professor
    if (user.perfil !== 'professor' && user.perfil !== 'admin') {
      res.status(403).json({ message: 'Apenas professores podem cadastrar notas' });
      return;
    }

    if (!aluno_id || !disciplina_id) {
      res.status(400).json({ message: 'Aluno e disciplina são obrigatórios' });
      return;
    }

    // Verificar se aluno e disciplina existem
    const alunoExists = await pool.query('SELECT id FROM alunos WHERE id = $1', [aluno_id]);
    const disciplinaExists = await pool.query('SELECT id FROM disciplinas WHERE id = $1', [disciplina_id]);

    if (alunoExists.rows.length === 0) {
      res.status(400).json({ message: 'Aluno não encontrado' });
      return;
    }

    if (disciplinaExists.rows.length === 0) {
      res.status(400).json({ message: 'Disciplina não encontrada' });
      return;
    }

    // Validar notas (0 a 10)
    const validarNota = (nota: any) => {
      if (nota === undefined || nota === null) return 0;
      const n = parseFloat(nota);
      return isNaN(n) ? 0 : Math.max(0, Math.min(10, n));
    };

    const nota1Validada = validarNota(nota1);
    const nota2Validada = validarNota(nota2);

    const result = await pool.query(
      `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (aluno_id, disciplina_id) 
       DO UPDATE SET nota1 = $3, nota2 = $4
       RETURNING *`,
      [aluno_id, disciplina_id, nota1Validada, nota2Validada]
    );

    res.status(201).json({ 
      message: 'Notas salvas com sucesso',
      notas: result.rows[0]
    });
  } catch (error: any) {
    console.error('Erro ao salvar notas:', error);
    
    if (error.code === '23503') { // Foreign key violation
      res.status(400).json({ message: 'Aluno ou disciplina não encontrado' });
      return;
    }
    
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== ALUNOS DO PROFESSOR ====================
app.get('/api/professor/alunos', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;

    if (user.perfil !== 'professor' && user.perfil !== 'admin') {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    // Buscar TODOS os alunos cadastrados no sistema
    const result = await pool.query(`
      SELECT id, nome, matricula, curso, created_at
      FROM alunos 
      ORDER BY nome
    `);

    console.log(`📊 Retornando ${result.rows.length} alunos para ${user.perfil}`);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar disciplinas do professor
app.get('/api/professor/disciplinas', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;

    if (user.perfil !== 'professor' && user.perfil !== 'admin') {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    const result = await pool.query(
      `SELECT id, nome, carga_horaria 
       FROM disciplinas 
       WHERE professor_id = $1 OR $2 = 'admin'
       ORDER BY nome`,
      [user.id, user.perfil]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar disciplinas do professor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== BOLETIM POR NOME DO ALUNO - NOVA ROTA ====================
app.get('/api/boletim/nome/:alunoNome', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { alunoNome } = req.params;
    console.log(`🔍 Buscando boletim para aluno: ${alunoNome}`);

    // Buscar aluno pelo nome (busca parcial case-insensitive)
    const alunoResult = await pool.query(
      `SELECT id, nome, matricula, curso 
       FROM alunos 
       WHERE LOWER(nome) LIKE LOWER($1)
       ORDER BY nome
       LIMIT 1`,
      [`%${alunoNome}%`]
    );

    if (alunoResult.rows.length === 0) {
      console.log('❌ Aluno não encontrado');
      res.status(404).json({ message: 'Aluno não encontrado. Verifique o nome digitado.' });
      return;
    }

    const aluno = alunoResult.rows[0];
    console.log('✅ Aluno encontrado:', aluno.nome);

    // Buscar boletim completo usando o ID do aluno encontrado
    const result = await pool.query(`
      SELECT 
        d.id as disciplina_id,
        d.nome as disciplina_nome,
        p.nome as professor_nome,
        d.carga_horaria,
        COALESCE(CAST(n.nota1 AS DECIMAL), 0) as nota1,
        COALESCE(CAST(n.nota2 AS DECIMAL), 0) as nota2,
        COALESCE(CAST((COALESCE(n.nota1, 0) + COALESCE(n.nota2, 0)) / 2 AS DECIMAL), 0) as media,
        CASE 
          WHEN COALESCE(CAST((COALESCE(n.nota1, 0) + COALESCE(n.nota2, 0)) / 2 AS DECIMAL), 0) >= 6 THEN 'Aprovado'
          ELSE 'Reprovado'
        END as situacao
      FROM disciplinas d
      LEFT JOIN professores p ON d.professor_id = p.id
      LEFT JOIN notas n ON d.id = n.disciplina_id AND n.aluno_id = $1
      WHERE n.id IS NOT NULL
      ORDER BY d.nome
    `, [aluno.id]);

    const disciplinas = result.rows;
    
    // Calcular estatísticas
    const totalDisciplinas = disciplinas.length;
    const disciplinasAprovadas = disciplinas.filter(d => d.situacao === 'Aprovado').length;
    const disciplinasReprovadas = disciplinas.filter(d => d.situacao === 'Reprovado').length;
    
    let mediaGeral = 0;
    if (totalDisciplinas > 0) {
      const somaMedias = disciplinas.reduce((sum, disc) => {
        const media = parseFloat(disc.media) || 0;
        return sum + media;
      }, 0);
      mediaGeral = somaMedias / totalDisciplinas;
    }

    console.log(`✅ Boletim gerado: ${totalDisciplinas} disciplinas, Média Geral: ${mediaGeral.toFixed(2)}`);

    res.json({
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
        matricula: aluno.matricula,
        curso: aluno.curso
      },
      boletim: disciplinas,
      estatisticas: {
        totalDisciplinas,
        disciplinasAprovadas,
        disciplinasReprovadas,
        mediaGeral: mediaGeral.toFixed(1),
        percentualAprovacao: totalDisciplinas > 0 ? ((disciplinasAprovadas / totalDisciplinas) * 100).toFixed(0) : '0'
      }
    });

  } catch (error) {
    console.error('💥 Erro ao buscar boletim por nome:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== BOLETIM POR ID DO ALUNO (MANTIDA PARA COMPATIBILIDADE) ====================
app.get('/api/boletim/:alunoId', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { alunoId } = req.params;
    console.log(`📊 Buscando boletim completo para aluno ID: ${alunoId}`);

    // Verificar se aluno existe
    const alunoExists = await pool.query(
      'SELECT id, nome, matricula, curso FROM alunos WHERE id = $1',
      [alunoId]
    );

    if (alunoExists.rows.length === 0) {
      console.log('❌ Aluno não encontrado');
      res.status(404).json({ message: 'Aluno não encontrado' });
      return;
    }

    const aluno = alunoExists.rows[0];
    console.log('✅ Aluno encontrado:', aluno.nome);

    // Buscar boletim completo com estatísticas
    const result = await pool.query(`
      SELECT 
        d.id as disciplina_id,
        d.nome as disciplina_nome,
        p.nome as professor_nome,
        d.carga_horaria,
        COALESCE(CAST(n.nota1 AS DECIMAL), 0) as nota1,
        COALESCE(CAST(n.nota2 AS DECIMAL), 0) as nota2,
        COALESCE(CAST((COALESCE(n.nota1, 0) + COALESCE(n.nota2, 0)) / 2 AS DECIMAL), 0) as media,
        CASE 
          WHEN COALESCE(CAST((COALESCE(n.nota1, 0) + COALESCE(n.nota2, 0)) / 2 AS DECIMAL), 0) >= 6 THEN 'Aprovado'
          ELSE 'Reprovado'
        END as situacao
      FROM disciplinas d
      LEFT JOIN professores p ON d.professor_id = p.id
      LEFT JOIN notas n ON d.id = n.disciplina_id AND n.aluno_id = $1
      WHERE n.id IS NOT NULL
      ORDER BY d.nome
    `, [alunoId]);

    const disciplinas = result.rows;
    
    // Calcular estatísticas com tratamento seguro
    const totalDisciplinas = disciplinas.length;
    const disciplinasAprovadas = disciplinas.filter(d => d.situacao === 'Aprovado').length;
    const disciplinasReprovadas = disciplinas.filter(d => d.situacao === 'Reprovado').length;
    
    // Calcular média geral de forma segura
    let mediaGeral = 0;
    if (totalDisciplinas > 0) {
      const somaMedias = disciplinas.reduce((sum, disc) => {
        const media = parseFloat(disc.media) || 0;
        return sum + media;
      }, 0);
      mediaGeral = somaMedias / totalDisciplinas;
    }

    console.log(`✅ Boletim gerado: ${totalDisciplinas} disciplinas, Média Geral: ${mediaGeral.toFixed(2)}`);

    res.json({
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
        matricula: aluno.matricula,
        curso: aluno.curso
      },
      boletim: disciplinas,
      estatisticas: {
        totalDisciplinas,
        disciplinasAprovadas,
        disciplinasReprovadas,
        mediaGeral: mediaGeral.toFixed(1),
        percentualAprovacao: totalDisciplinas > 0 ? ((disciplinasAprovadas / totalDisciplinas) * 100).toFixed(0) : '0'
      }
    });

  } catch (error) {
    console.error('💥 Erro ao buscar boletim:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== ROTA PARA SUGESTÕES DE ALUNOS ====================
app.get('/api/alunos/busca/:termo', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { termo } = req.params;

    const result = await pool.query(
      `SELECT id, nome, matricula, curso 
       FROM alunos 
       WHERE LOWER(nome) LIKE LOWER($1)
       ORDER BY nome
       LIMIT 10`,
      [`%${termo}%`]
    );

    console.log(`🔍 Sugestões para "${termo}": ${result.rows.length} alunos encontrados`);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== ROTA DE DEBUG ====================
app.get('/api/debug/alunos', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;

    if (user.perfil !== 'admin') {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    const result = await pool.query(`
      SELECT 
        a.id,
        a.nome,
        a.matricula,
        a.curso,
        a.created_at,
        COUNT(n.id) as total_notas,
        COUNT(DISTINCT n.disciplina_id) as disciplinas_com_notas
      FROM alunos a
      LEFT JOIN notas n ON a.id = n.aluno_id
      GROUP BY a.id, a.nome, a.matricula, a.curso, a.created_at
      ORDER BY a.nome
    `);

    console.log('📊 Debug - Alunos no sistema:');
    result.rows.forEach(aluno => {
      console.log(`   👤 ${aluno.nome} (${aluno.matricula}) - Notas: ${aluno.total_notas}, Disciplinas: ${aluno.disciplinas_com_notas}`);
    });

    res.json(result.rows);
  } catch (error) {
    console.error('Erro no debug de alunos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== AVISOS ACADÊMICOS ====================

// Criar novo aviso (admin e professor)
app.post('/api/avisos', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { titulo, mensagem, tipo, data_expiracao } = req.body;

    // Verificar permissão
    if (user.perfil !== 'admin' && user.perfil !== 'professor') {
      res.status(403).json({ message: 'Apenas administradores e professores podem criar avisos' });
      return;
    }

    if (!titulo || !mensagem || !tipo) {
      res.status(400).json({ message: 'Título, mensagem e tipo são obrigatórios' });
      return;
    }

    // Validar tipo
    const tiposValidos = ['geral', 'importante', 'alerta', 'informacao'];
    if (!tiposValidos.includes(tipo)) {
      res.status(400).json({ message: 'Tipo de aviso inválido' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO avisos (titulo, mensagem, tipo, autor_id, data_expiracao) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [titulo, mensagem, tipo, user.id, data_expiracao || null]
    );

    console.log(`📢 Novo aviso criado: "${titulo}" por ${user.email}`);

    res.status(201).json({
      message: 'Aviso publicado com sucesso',
      aviso: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao criar aviso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar avisos (todos os perfis)
app.get('/api/avisos', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    
    // Buscar avisos não expirados
    const result = await pool.query(`
      SELECT 
        a.id,
        a.titulo,
        a.mensagem,
        a.tipo,
        a.autor_id,
        u.nome as autor_nome,
        a.data_publicacao,
        a.data_expiracao,
        a.lido_por,
        a.created_at,
        $1 = ANY(a.lido_por) as lido
      FROM avisos a
      LEFT JOIN usuarios u ON a.autor_id = u.id
      WHERE (a.data_expiracao IS NULL OR a.data_expiracao > NOW())
      ORDER BY 
        CASE a.tipo 
          WHEN 'importante' THEN 1
          WHEN 'alerta' THEN 2
          WHEN 'informacao' THEN 3
          ELSE 4
        END,
        a.data_publicacao DESC
    `, [user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar avisos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Marcar aviso como lido
app.post('/api/avisos/:id/ler', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    // Verificar se aviso existe
    const avisoResult = await pool.query(
      'SELECT id, lido_por FROM avisos WHERE id = $1',
      [id]
    );

    if (avisoResult.rows.length === 0) {
      res.status(404).json({ message: 'Aviso não encontrado' });
      return;
    }

    const aviso = avisoResult.rows[0];
    let lidoPor = aviso.lido_por || [];

    // Se ainda não foi lido por este usuário, adicionar
    if (!lidoPor.includes(user.id)) {
      lidoPor.push(user.id);
      
      await pool.query(
        'UPDATE avisos SET lido_por = $1 WHERE id = $2',
        [lidoPor, id]
      );

      console.log(`📝 Aviso ${id} marcado como lido pelo usuário ${user.email}`);
    }

    res.json({ 
      message: 'Aviso marcado como lido',
      lido: true 
    });

  } catch (error) {
    console.error('Erro ao marcar aviso como lido:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Contar avisos não lidos
app.get('/api/avisos/nao-lidos', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    
    const result = await pool.query(`
      SELECT COUNT(*) as total
      FROM avisos a
      WHERE (a.data_expiracao IS NULL OR a.data_expiracao > NOW())
      AND NOT ($1 = ANY(a.lido_por))
    `, [user.id]);

    const totalNaoLidos = parseInt(result.rows[0].total);

    res.json({ 
      total: totalNaoLidos,
      hasUnread: totalNaoLidos > 0
    });
  } catch (error) {
    console.error('Erro ao contar avisos não lidos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Excluir aviso (apenas admin)
app.delete('/api/avisos/:id', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    
    if (user.perfil !== 'admin') {
      res.status(403).json({ message: 'Apenas administradores podem excluir avisos' });
      return;
    }

    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM avisos WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Aviso não encontrado' });
      return;
    }

    res.json({ 
      message: 'Aviso excluído com sucesso',
      id: result.rows[0].id
    });

  } catch (error) {
    console.error('Erro ao excluir aviso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Inicialização do Banco de Dados
const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Inicializando banco de dados...');
    
    // Criar tabela usuarios se não existir
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

    // Criar outras tabelas se não existirem
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alunos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        matricula VARCHAR(50) UNIQUE NOT NULL,
        curso VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS professores (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        titulacao VARCHAR(100) NOT NULL,
        tempo_docencia INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS disciplinas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        carga_horaria INTEGER NOT NULL,
        professor_id INTEGER REFERENCES professores(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

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

    // Criar tabela de avisos
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

    // Popular dados de teste para boletim
    console.log('📊 Populando dados de teste para boletim...');
    
    // Inserir alunos de teste
    await pool.query(`
      INSERT INTO alunos (id, nome, matricula, curso) 
      VALUES 
        (1, 'João Silva', '20240001', 'Engenharia de Software'),
        (2, 'Maria Souza', '20240002', 'Ciência da Computação'),
        (3, 'Carlos Oliveira', '20240003', 'Engenharia de Software'),
        (4, 'Ana Santos', '20240004', 'Ciência da Computação'),
        (5, 'Pedro Costa', '20240005', 'Sistemas de Informação'),
        (6, 'Mariana Lima', '20240006', 'Engenharia de Software'),
        (7, 'Ricardo Alves', '20240007', 'Ciência da Computação'),
        (8, 'Fernanda Rocha', '20240008', 'Sistemas de Informação')
      ON CONFLICT (id) DO UPDATE SET
        nome = EXCLUDED.nome,
        matricula = EXCLUDED.matricula,
        curso = EXCLUDED.curso;
    `);

    // Inserir professores de teste
    await pool.query(`
      INSERT INTO professores (id, nome, titulacao, tempo_docencia) 
      VALUES 
        (1, 'Dr. Carlos Oliveira', 'Doutor', 15),
        (2, 'Dra. Ana Santos', 'Mestre', 8)
      ON CONFLICT (id) DO UPDATE SET
        nome = EXCLUDED.nome,
        titulacao = EXCLUDED.titulacao,
        tempo_docencia = EXCLUDED.tempo_docencia;
    `);

    // Inserir disciplinas de teste
    await pool.query(`
      INSERT INTO disciplinas (id, nome, carga_horaria, professor_id) 
      VALUES 
        (1, 'Programação I', 80, 1),
        (2, 'Banco de Dados', 60, 2),
        (3, 'Estrutura de Dados', 80, 1)
      ON CONFLICT (id) DO UPDATE SET
        nome = EXCLUDED.nome,
        carga_horaria = EXCLUDED.carga_horaria,
        professor_id = EXCLUDED.professor_id;
    `);

    // Inserir notas de teste para vários alunos
    await pool.query(`
      INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2) 
      VALUES 
        (1, 1, 7.5, 8.0),
        (1, 2, 6.0, 7.5),
        (1, 3, 5.5, 6.0),
        (2, 1, 8.5, 9.0),
        (2, 2, 7.0, 8.0),
        (3, 1, 6.5, 7.0),
        (3, 2, 8.0, 8.5),
        (4, 1, 9.0, 8.5),
        (4, 2, 7.5, 8.0)
      ON CONFLICT (aluno_id, disciplina_id) DO UPDATE SET
        nota1 = EXCLUDED.nota1,
        nota2 = EXCLUDED.nota2;
    `);

    console.log('✅ Banco de dados inicializado com sucesso');
    
    // Verificar a associação criada
    const associacao = await pool.query(`
      SELECT u.id as usuario_id, u.nome as usuario_nome, u.perfil, 
             a.id as aluno_id, a.nome as aluno_nome, a.matricula
      FROM usuarios u
      LEFT JOIN alunos a ON LOWER(a.nome) = LOWER(u.nome)
    `);
    
    console.log('🔗 Associação usuário-aluno criada:');
    associacao.rows.forEach(row => {
      console.log(`   👤 ${row.usuario_nome} (${row.perfil}) → 🎓 ${row.aluno_nome || 'Nenhum aluno associado'}`);
    });
    
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
  console.log(`📚 App Scholar - Sistema Completo`);
  console.log('');
  console.log('🔑 Credenciais para teste:');
  console.log('   👨‍💼 Admin:     admin@app.com / 1234');
  console.log('   👨‍🏫 Professor: prof@app.com  / 1234');
  console.log('   👨‍🎓 Aluno:     aluno@app.com / 1234');
  console.log('');
  console.log('🎯 NOVA FUNCIONALIDADE:');
  console.log('   🔍 Busca de boletim por NOME do aluno');
  console.log('   📊 Rotas disponíveis:');
  console.log('      GET /api/boletim/nome/:alunoNome  → Busca por nome');
  console.log('      GET /api/boletim/:alunoId         → Busca por ID (mantida)');
  console.log('      GET /api/alunos/busca/:termo      → Sugestões de alunos');
  console.log('');
  console.log('💡 Dicas de uso:');
  console.log('   • Digite "João Silva", "Maria", "Carlos", etc.');
  console.log('   • Busca não diferencia maiúsculas/minúsculas');
  console.log('   • Funciona com nomes parciais');
  console.log('');
  
  await initializeDatabase();
});

export default app;