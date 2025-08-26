import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert, SafeAreaView, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface DadosUsuario {
  email: string;
  senha: string;
  tipoUsuario: string;
  logado: boolean;
}

const Dez: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [confirmarSenha, setConfirmarSenha] = useState<string>('');
  const [tipoUsuario, setTipoUsuario] = useState<string>('manager');
  const [logado, setLogado] = useState<boolean>(false);
  const [dados, setDados] = useState<DadosUsuario | null>(null);

  const handleLogin = (): void => {
    if (!email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    
    setDados({ email, senha, tipoUsuario, logado });
    Alert.alert('Sucesso', 'Login realizado com sucesso!');
  };

  const handleCadastrar = (): void => {
    if (!email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    
    setDados({ email, senha, tipoUsuario, logado });
    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
  };

  const toggleSwitch = (): void => setLogado(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.titulo}>Cadastro</Text>
        <View style={styles.moldura}>
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
          
          <TextInput
            style={styles.input}
            placeholder="Confirmar Senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry={true}
            maxLength={8}
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipoUsuario}
              style={styles.picker}
              onValueChange={(itemValue: string) => setTipoUsuario(itemValue)}
            >
              <Picker.Item label="Administrador" value="admin" />
              <Picker.Item label="Gestor" value="manager" />
              <Picker.Item label="Usuário" value="user" />
            </Picker>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Manter conectado</Text>
            <Switch
              trackColor={{ false: "#e77878", true: "#94df83" }}
              thumbColor={logado ? "#47eb22" : "#ed1111"}
              onValueChange={toggleSwitch}
              value={logado}
            />
          </View>
        </View>
        
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
            <Text style={styles.resultText}>Tipo: {dados.tipoUsuario}</Text>
            <Text style={styles.resultText}>Conectado: {dados.logado ? 'Sim' : 'Não'}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
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
  moldura: {
    width: 270,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 20,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 270,
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
    width: 270,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
});

export default Dez;