import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert, SafeAreaView } from 'react-native';

interface DadosLogin {
  email: string;
  senha: string;
}

const Sete: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [dados, setDados] = useState<DadosLogin | null>(null);

  const handleLogin = (): void => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    setDados({ email, senha });
    Alert.alert('Sucesso', 'Login realizado com sucesso!');
  };

  const handleCadastrar = (): void => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    setDados({ email, senha });
    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.titulo}>Cadastro</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
          maxLength={8}
        />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
            <Text style={styles.buttonText}>Logar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.cadastrarButton]} onPress={handleCadastrar}>
            <Text style={styles.buttonText}>Cadastrar-se</Text>
          </TouchableOpacity>
        </View>
        
        {dados && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>E-mail: {dados.email}</Text>
            <Text style={styles.resultText}>Senha: {dados.senha}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    width: '100%',
    maxWidth: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
    gap: 10,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#007AFF',
  },
  cadastrarButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    width: '100%',
    maxWidth: 300,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
});

export default Sete;