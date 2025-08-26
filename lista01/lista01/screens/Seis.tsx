import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert } from 'react-native';

interface Dados {
  nome: string;
  idade: string;
}

const Seis: React.FC = () => {
  const [nome, setNome] = useState<string>('');
  const [idade, setIdade] = useState<string>('');
  const [dados, setDados] = useState<Dados | null>(null);

  const handleSalvar = (): void => {
    if (!nome.trim() || !idade.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    setDados({ nome, idade });
    setNome('');
    setIdade('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Idade"
          value={idade}
          onChangeText={setIdade}
          keyboardType="numeric"
        />
        
        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
        
        {dados && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Nome: {dados.nome}</Text>
            <Text style={styles.resultText}>Idade: {dados.idade}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    width: '100%',
    maxWidth: 300,
  },
   titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#B4B8B5',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'white',
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
});

export default Seis;