import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.login(email, senha);
      const token = res.data.token;
      await AsyncStorage.setItem('@token', token);
      
      const perfil = res.data.perfil || 'aluno';
      await AsyncStorage.setItem('@perfil', perfil);
      
      navigation.replace('Home', { perfil });
    } catch (err: any) {
      console.error(err?.response || err);
      Alert.alert('Erro', err?.response?.data?.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Ionicons name="school" size={48} color="#2E86AB" />
        </View>
        <Text style={styles.title}>App Scholar</Text>
        <Text style={styles.subtitle}>Gestão Acadêmica</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#6C757D" style={styles.inputIcon} />
          <TextInput 
            placeholder="Email" 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#6C757D"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#6C757D" style={styles.inputIcon} />
          <TextInput 
            placeholder="Senha" 
            style={styles.input} 
            value={senha} 
            onChangeText={setSenha} 
            secureTextEntry={secureText}
            placeholderTextColor="#6C757D"
          />
          <TouchableOpacity 
            onPress={() => setSecureText(!secureText)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={secureText ? "eye-off" : "eye"} 
              size={20} 
              color="#6C757D" 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[
            styles.loginButton, 
            loading && styles.loginButtonDisabled
          ]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.loginButtonText}>Entrando...</Text>
          ) : (
            <>
              <Text style={styles.loginButtonText}>Entrar</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>Dados de Demonstração:</Text>
          <Text style={styles.demoText}>Admin: admin@app.com / 1234</Text>
          <Text style={styles.demoText}>Professor: prof@app.com / 1234</Text>
          <Text style={styles.demoText}>Aluno: aluno@app.com / 1234</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#2D3142',
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#2E86AB',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#6C757D',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  demoContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E86AB',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#2D3142',
    marginBottom: 4,
  },
});