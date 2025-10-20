import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  senha_hash: string;
  perfil: 'admin' | 'professor' | 'aluno';
  nome: string;
  created_at: Date;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  perfil: string;
  nome: string;
  message?: string;
}

// CORREÇÃO: Extender corretamente a Request do Express
export interface AuthRequest extends Request {
  user?: {
    id: number;
    perfil: string;
    email: string;
  };
}