import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Endereco } from '../types';

interface CepContextType {
  endereco: Endereco | null;
  historico: Endereco[];
  consultarCep: (cep: string) => Promise<void>;
  limparEndereco: () => void;
  erro: string | null;
}

const CepContext = createContext<CepContextType | undefined>(undefined);

export const CepProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [endereco, setEndereco] = useState<Endereco | null>(null);
  const [historico, setHistorico] = useState<Endereco[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const consultarCep = async (cep: string) => {
    try {
      setErro(null);
      // Remove qualquer caractere não numérico
      const cepLimpo = cep.replace(/\D/g, '');
      
      if (cepLimpo.length !== 8) {
        setErro('CEP deve ter 8 dígitos');
        return;
      }

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data: Endereco = await response.json();

      if (data.erro) {
        setErro('CEP inválido');
        setEndereco(null);
      } else {
        setEndereco(data);
        // Adiciona apenas CEPs válidos ao histórico
        setHistorico(prev => [data, ...prev.slice(0, 9)]); // Mantém apenas os 10 últimos
      }
    } catch (error) {
      setErro('Erro ao consultar CEP');
      setEndereco(null);
    }
  };

  const limparEndereco = () => {
    setEndereco(null);
    setErro(null);
  };

  return (
    <CepContext.Provider value={{ 
      endereco, 
      historico, 
      consultarCep, 
      limparEndereco, 
      erro 
    }}>
      {children}
    </CepContext.Provider>
  );
};

export const useCep = () => {
  const context = useContext(CepContext);
  if (!context) {
    throw new Error('useCep deve ser usado dentro de CepProvider');
  }
  return context;
};