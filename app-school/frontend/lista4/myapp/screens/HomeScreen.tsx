import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

export default function HomeScreen({ navigation, route }: any) {
  const perfil = route.params?.perfil || 'aluno';
  const [unreadAvisos, setUnreadAvisos] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const checkUnreadAvisos = async () => {
        try {
          const res = await api.getUnreadAvisosCount();
          setUnreadAvisos(res.data?.total || 0);
        } catch (err) {
          console.error('Erro ao verificar avisos:', err);
        }
      };
      checkUnreadAvisos();
    }, [])
  );

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

  const MenuButton = ({ title, onPress, icon, color = '#2E86AB', badgeCount = 0 }: any) => (
    <View style={styles.menuItemWithBadge}>
      <TouchableOpacity style={styles.menuButton} onPress={onPress}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Ionicons name={icon} size={24} color="#FFFFFF" />
        </View>
        <Text style={styles.menuText}>{title}</Text>
        <Ionicons name="chevron-forward" size={20} color="#6C757D" />
      </TouchableOpacity>
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#2E86AB" />
          </View>
          {unreadAvisos > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{unreadAvisos}</Text>
            </View>
          )}
        </View>
        <Text style={styles.welcome}>Bem-vindo ao App Scholar</Text>
        <View style={styles.perfilBadge}>
          <Text style={styles.perfilText}>{getPerfilName()}</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Menu Principal</Text>
        
        {/* Menu para todos os perfis */}
        <MenuButton 
          title="Boletim Acadêmico" 
          icon="school" 
          onPress={() => navigation.navigate('BoletimCompleto')} 
        />

        {/* Menu de Avisos para todos os perfis */}
        <MenuButton 
          title="Avisos Acadêmicos" 
          icon="megaphone" 
          color="#9B59B6"
          badgeCount={unreadAvisos}
          onPress={() => navigation.navigate('ListaAvisos')} 
        />

        {/* Menu para PROFESSOR e ADMIN */}
        {(perfil === 'admin' || perfil === 'professor') && (
          <>
            <MenuButton 
              title="Cadastrar Notas" 
              icon="document-text" 
              color="#27AE60"
              onPress={() => navigation.navigate('CadastroNotas')} 
            />
            <MenuButton 
              title="Cadastrar Disciplina" 
              icon="book" 
              color="#F39C12"
              onPress={() => navigation.navigate('CadastroDisciplina')} 
            />
          </>
        )}

        {/* Menu exclusivo para ADMIN */}
        {perfil === 'admin' && (
          <>
            <MenuButton 
              title="Cadastrar Usuário" 
              icon="person-add" 
              color="#9B59B6"
              onPress={() => navigation.navigate('CadastroUsuario')} 
            />
            <MenuButton 
              title="Cadastrar Aluno" 
              icon="person-add" 
              color="#9B59B6"
              onPress={() => navigation.navigate('CadastroAluno')} 
            />
            <MenuButton 
              title="Lista de Alunos" 
              icon="list" 
              color="#3498DB"
              onPress={() => navigation.navigate('ListaAlunos')} 
            />
            <MenuButton 
              title="Cadastrar Professor" 
              icon="person-add" 
              color="#E74C3C"
              onPress={() => navigation.navigate('CadastroProfessor')} 
            />
          </>
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Informações do Sistema</Text>
        
        {perfil === 'professor' && (
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color="#2E86AB" />
            <Text style={styles.infoText}>
              Como professor, você pode cadastrar notas para os alunos, gerenciar suas disciplinas e publicar avisos acadêmicos.
            </Text>
          </View>
        )}

        {perfil === 'admin' && (
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color="#2E86AB" />
            <Text style={styles.infoText}>
              Como administrador, você tem acesso completo ao sistema para gerenciar alunos, professores, disciplinas e avisos.
            </Text>
          </View>
        )}

        {perfil === 'aluno' && (
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color="#2E86AB" />
            <Text style={styles.infoText}>
              Como aluno, você pode visualizar seu boletim acadêmico e acompanhar os avisos importantes da instituição.
            </Text>
          </View>
        )}

        {unreadAvisos > 0 && (
          <View style={[styles.infoCard, { backgroundColor: '#FFF3CD', borderLeftColor: '#FFC107' }]}>
            <Ionicons name="notifications" size={20} color="#F39C12" />
            <Text style={styles.infoText}>
              Você tem {unreadAvisos} aviso(s) não lido(s). Clique em "Avisos Acadêmicos" para visualizar.
            </Text>
          </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#2E86AB',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3142',
    marginBottom: 8,
    textAlign: 'center',
  },
  perfilBadge: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  perfilText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3142',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  menuItemWithBadge: {
    position: 'relative',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
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
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3142',
    marginBottom: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2E86AB',
    marginBottom: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3142',
    marginLeft: 8,
    lineHeight: 20,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutText: {
    color: '#E74C3C',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});