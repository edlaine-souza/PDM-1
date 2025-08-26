import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
  Keyboard,
  ScrollView
} from 'react-native';
import { useCep } from '../hooks/useCep';

const ConsultaCepScreen: React.FC = () => {
  const [cep, setCep] = useState('');
  const { endereco, consultarCep, erro, limparEndereco } = useCep();

  const handleConsultar = async () => {
    if (cep.length !== 8) {
      Alert.alert('Erro', 'CEP deve ter 8 dígitos');
      return;
    }

    Keyboard.dismiss();
    await consultarCep(cep);
  };

  const handleLimpar = () => {
    setCep('');
    limparEndereco();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Consulta de CEP</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite o CEP (8 dígitos)"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={8}
            value={cep}
            onChangeText={setCep}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleConsultar}>
              <Text style={styles.buttonText}>Obter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.limparButton]} onPress={handleLimpar}>
              <Text style={styles.buttonText}>Limpar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {erro && (
          <View style={styles.resultContainer}>
            <Text style={styles.errorText}>{erro}</Text>
          </View>
        )}

        {endereco && !erro && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Resultado:</Text>
            <Text style={styles.resultText}>CEP: {endereco.cep}</Text>
            <Text style={styles.resultText}>Logradouro: {endereco.logradouro}</Text>
            <Text style={styles.resultText}>Bairro: {endereco.bairro}</Text>
            <Text style={styles.resultText}>Cidade: {endereco.localidade}</Text>
            <Text style={styles.resultText}>UF: {endereco.uf}</Text>
            {endereco.complemento && (
              <Text style={styles.resultText}>Complemento: {endereco.complemento}</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  limparButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ConsultaCepScreen;