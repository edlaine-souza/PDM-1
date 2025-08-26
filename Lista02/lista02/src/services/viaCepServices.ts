import axios from 'axios';
import { Endereco } from '../types';

const BASE_URL = 'https://viacep.com.br/ws';

export const consultarCep = async (cep: string): Promise<Endereco> => {
  try {
    const response = await axios.get(`${BASE_URL}/${cep}/json/`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao consultar CEP');
  }
};