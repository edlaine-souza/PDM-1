import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.68.55.247:3000/api'; // Seu IP

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Interceptor de requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('❌ API Error:', error.response?.status, error.message);
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('@token');
      AsyncStorage.removeItem('@perfil');
    }
    return Promise.reject(error);
  }
);

export default {
  // Autenticação
  login: (email: string, senha: string) => 
    api.post('/auth/login', { email, senha }),

  validateToken: () => 
    api.get('/auth/validate'),

  getProfile: () => 
    api.get('/auth/profile'),

  // Alunos
  listAlunos: () => 
    api.get('/alunos'),

  createAluno: (payload: any) => 
    api.post('/alunos', payload),

  // Professores
  listProfessores: () => 
    api.get('/professores'),

  createProfessor: (payload: any) => 
    api.post('/professores', payload),

  // Disciplinas
  listDisciplinas: () => 
    api.get('/disciplinas'),

  createDisciplina: (payload: any) => 
    api.post('/disciplinas', payload),

  // Boletim - CORRIGIDO
  boletimByAluno: (idAluno: number) => 
    api.get(`/boletim/${idAluno}`),

  // NOVO MÉTODO: Buscar boletim por nome do aluno
  boletimByAlunoNome: (alunoNome: string) => 
    api.get(`/boletim/nome/${encodeURIComponent(alunoNome)}`),

  // NOTAS - NOVAS FUNÇÕES
  getNotas: (alunoId: number, disciplinaId: number) =>
    api.get(`/notas/${alunoId}/${disciplinaId}`),

  saveNotas: (payload: any) =>
    api.post('/notas', payload),

  // Professor
  getProfessorAlunos: () =>
    api.get('/professor/alunos'),

  getProfessorDisciplinas: () =>
    api.get('/professor/disciplinas'),

  // Cadastro e usuários
  register: (payload: any) =>
    api.post('/auth/register', payload),

  listUsuarios: () =>
    api.get('/usuarios'),

  // Busca de alunos para sugestões (OPCIONAL)
  buscarAlunos: (termo: string) =>
    api.get(`/alunos/busca/${encodeURIComponent(termo)}`),
};