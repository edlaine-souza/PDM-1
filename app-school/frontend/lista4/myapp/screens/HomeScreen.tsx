import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation, route }: any) {
  const perfil = route.params?.perfil || 'aluno';

  const getPerfilName = () => {
    switch(perfil) {
      case 'admin': return 'Administrador';
      case 'professor': return 'Professor';
      default: return 'Aluno';
    }
  };

  const handleLogout = async () => {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('@token');
          await AsyncStorage.removeItem('@perfil');

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          );
        },
      },
    ]);
  };

  const MenuButton = ({ title, onPress, icon, color = '#2E86AB' }: any) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.menuText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#6C757D" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#2E86AB" />
        </View>
        <Text style={styles.welcome}>Bem-vindo ao App Scholar</Text>
        <View style={styles.perfilBadge}>
          <Text style={styles.perfilText}>{getPerfilName()}</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Menu Principal</Text>
        
        <MenuButton 
          title="Visualizar Boletim" 
          icon="school" 
          onPress={() => navigation.navigate('Boletim')} 
        />

        {(perfil === 'admin' || perfil === 'professor') && (
          <MenuButton 
            title="Cadastrar Disciplina" 
            icon="book" 
            onPress={() => navigation.navigate('CadastroDisciplina')} 
          />
        )}

        {perfil === 'admin' && (
          <>
            <MenuButton 
              title="Cadastrar Aluno" 
              icon="people" 
              onPress={() => navigation.navigate('CadastroAluno')} 
            />
            <MenuButton 
              title="Cadastrar Professor" 
              icon="person-add" 
              onPress={() => navigation.navigate('CadastroProfessor')} 
            />
          </>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#E74C3C" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3142',
    marginBottom: 8,
  },
  perfilBadge: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  perfilText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C757D',
    marginBottom: 12,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#2D3142',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E74C3C',
  },
  logoutText: {
    color: '#E74C3C',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});