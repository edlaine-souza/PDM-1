import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importações das telas existentes
import LoginScreen from './lista4/myapp/screens/LoginScreen';
import HomeScreen from './lista4/myapp/screens/HomeScreen';
import BoletimCompletoScreen from './lista4/myapp/screens/BoletimCompletoScreen';
import CadastroAlunoScreen from './lista4/myapp/screens/CadastroAlunoScreen';
import CadastroProfessorScreen from './lista4/myapp/screens/CadastroProfessorScreen';
import CadastroDisciplinaScreen from './lista4/myapp/screens/CadastroDisciplinaScreen';
import CadastroNotasScreen from './lista4/myapp/screens/CadastroNotasScreen'; 
import ListaAlunosScreen from './lista4/myapp/screens/ListaAlunosScreen';
import CadastroUsuarioScreen from './lista4/myapp/screens/CadastroUsuarioScreen';

// NOVA TELA: Avisos Acadêmicos
import ListaAvisosScreen from './lista4/myapp/screens/ListaAvisosScreen';

const Stack = createStackNavigator();

// Tema personalizado
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E86AB',
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#2D3142',
    border: '#E9ECEF',
  },
};

export default function App() {
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Home'>('Login');
  const [perfil, setPerfil] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('@token');
        const perfilSalvo = await AsyncStorage.getItem('@perfil');
        if (token && perfilSalvo) {
          setInitialRoute('Home');
          setPerfil(perfilSalvo);
        } else {
          setInitialRoute('Login');
        }
      } catch (err) {
        console.error(err);
        setInitialRoute('Login');
      } finally {
        setLoading(false);
      }
    };

    verificarLogin();
  }, []);

  if (loading) {
    return null; // Ou um componente de loading
  }

  return (
    <NavigationContainer theme={MyTheme}>
      <StatusBar backgroundColor="#2E86AB" barStyle="light-content" />
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2E86AB',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
          cardStyle: {
            backgroundColor: '#F8F9FA'
          }
        }}
      >
        {/* Tela de Login (sem header) */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        {/* Tela de Cadastro de Usuário */}
        <Stack.Screen 
          name="CadastroUsuario" 
          component={CadastroUsuarioScreen} 
          options={{ title: 'Cadastrar Usuário' }}
        />

        {/* Tela Principal */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ 
            title: 'App Scholar',
            headerBackTitle: 'Sair'
          }}
          initialParams={{ perfil }}
        />

        {/* Tela de Boletim */}
        <Stack.Screen 
          name="BoletimCompleto" 
          component={BoletimCompletoScreen} 
          options={{ title: 'Boletim Acadêmico' }}
        />

        {/* Tela de Cadastro de Aluno */}
        <Stack.Screen 
          name="CadastroAluno" 
          component={CadastroAlunoScreen} 
          options={{ title: 'Cadastrar Aluno' }}
        />

        {/* Tela de Cadastro de Professor */}
        <Stack.Screen 
          name="CadastroProfessor" 
          component={CadastroProfessorScreen} 
          options={{ title: 'Cadastrar Professor' }}
        />

        {/* Tela de Cadastro de Disciplina */}
        <Stack.Screen 
          name="CadastroDisciplina" 
          component={CadastroDisciplinaScreen} 
          options={{ title: 'Cadastrar Disciplina' }}
        />

        {/* Tela de Cadastro de Notas */}
        <Stack.Screen 
          name="CadastroNotas" 
          component={CadastroNotasScreen} 
          options={{ title: 'Cadastrar Notas' }}
        />

        {/* Tela de Lista de Alunos */}
        <Stack.Screen 
          name="ListaAlunos" 
          component={ListaAlunosScreen} 
          options={{ title: 'Lista de Alunos' }}
        />

        {/* NOVA TELA: Avisos Acadêmicos */}
        <Stack.Screen 
          name="ListaAvisos" 
          component={ListaAvisosScreen} 
          options={{ title: 'Avisos Acadêmicos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}