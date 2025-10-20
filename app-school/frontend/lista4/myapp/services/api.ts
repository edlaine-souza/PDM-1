import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Troque para `false` quando o back-end estiver pronto.
 * Quando `true`, o app usa dados mockados (falsos) locais.
 */
const USE_MOCK = false;

// ✅ SEU IP - Backend real
const API_BASE_URL = 'http://192.168.18.14:3000/api';

// Instância axios (usada só no modo real)
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Intercepta requisições e adiciona token, se houver
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------------- MOCKS ---------------- */
const mockData = {
  usuarios: [
    { email: 'admin@app.com', senha: '1234', perfil: 'admin', token: 'admintoken' },
    { email: 'prof@app.com', senha: '1234', perfil: 'professor', token: 'proftoken' },
    { email: 'aluno@app.com', senha: '1234', perfil: 'aluno', token: 'alunotoken' },
  ],
  alunos: [
    { id: 1, nome: 'João Silva', matricula: '2023001', curso: 'DSM' },
    { id: 2, nome: 'Maria Souza', matricula: '2023002', curso: 'ADS' },
  ],
  professores: [
    { id: 1, nome: 'Prof. André Olímpio', titulacao: 'Mestre', tempo_docencia: 8 },
    { id: 2, nome: 'Profa. Carla Mendes', titulacao: 'Doutora', tempo_docencia: 10 },
  ],
  disciplinas: [
    { id: 1, nome: 'Programação Mobile I', carga_horaria: 80, professor_id: 1 },
    { id: 2, nome: 'Banco de Dados II', carga_horaria: 60, professor_id: 2 },
  ],
  boletim: [
    {
      aluno_id: 1,
      disciplina_id: 1,
      disciplina_nome: 'Programação Mobile I',
      nota1: 8,
      nota2: 9,
      media: 8.5,
    },
    {
      aluno_id: 1,
      disciplina_id: 2,
      disciplina_nome: 'Banco de Dados II',
      nota1: 7,
      nota2: 8,
      media: 7.5,
    },
  ],
};

/* ---------------- MOCK FUNCTIONS ---------------- */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockApi = {
  login: async (email: string, senha: string) => {
    await delay(700);
    const user = mockData.usuarios.find(
      (u) => u.email === email && u.senha === senha
    );
    if (!user) throw { response: { data: { message: 'Usuário ou senha inválidos' } } };
    return { data: { token: user.token, perfil: user.perfil, nome: user.email.split('@')[0] } };
  },

  registerUser: async (payload: any) => {
    await delay(500);
    mockData.usuarios.push(payload);
    return { data: { message: 'Usuário registrado' } };
  },

  listAlunos: async () => {
    await delay(500);
    return { data: mockData.alunos };
  },

  createAluno: async (payload: any) => {
    await delay(500);
    mockData.alunos.push({ id: mockData.alunos.length + 1, ...payload });
    return { data: { message: 'Aluno criado' } };
  },

  listDisciplinas: async () => {
    await delay(500);
    return { data: mockData.disciplinas };
  },

  createDisciplina: async (payload: any) => {
    await delay(500);
    mockData.disciplinas.push({ id: mockData.disciplinas.length + 1, ...payload });
    return { data: { message: 'Disciplina criada' } };
  },

  listProfessores: async () => {
    await delay(500);
    return { data: mockData.professores };
  },

  createProfessor: async (payload: any) => {
    await delay(500);
    mockData.professores.push({ id: mockData.professores.length + 1, ...payload });
    return { data: { message: 'Professor criado' } };
  },

  boletimByAluno: async (idAluno: number) => {
    await delay(600);
    const result = mockData.boletim.filter((b) => b.aluno_id === idAluno);
    if (result.length === 0)
      throw { response: { data: { message: 'Nenhum boletim encontrado' } } };
    return { data: result };
  },
};

/* ---------------- EXPORT ---------------- */
export default USE_MOCK ? mockApi : {
  // APIs reais
  login: (email: string, senha: string) => 
    api.post('/auth/login', { email, senha }),

  validateToken: () => 
    api.get('/auth/validate'),

  getProfile: () => 
    api.get('/auth/profile'),

  // Manter mocks para outras funcionalidades por enquanto
  listAlunos: mockApi.listAlunos,
  createAluno: mockApi.createAluno,
  listDisciplinas: mockApi.listDisciplinas,
  createDisciplina: mockApi.createDisciplina,
  listProfessores: mockApi.listProfessores,
  createProfessor: mockApi.createProfessor,
  boletimByAluno: mockApi.boletimByAluno,
};