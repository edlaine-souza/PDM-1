import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function ListaAlunosScreen({ navigation }: any) {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarAlunos = async () => {
    try {
      const response = await api.listAlunos();
      setAlunos(response.data || []);
    } catch (err: any) {
      console.error('Erro ao carregar alunos:', err);
      Alert.alert('Erro', 'Falha ao carregar lista de alunos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    carregarAlunos();
  };

  const renderAluno = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.alunoCard}>
      <View style={styles.alunoInfo}>
        <Text style={styles.alunoNome}>{item.nome}</Text>
        <Text style={styles.alunoDetalhes}>
          Matrícula: {item.matricula} • Curso: {item.curso}
        </Text>
        <Text style={styles.alunoData}>
          Cadastrado em: {new Date(item.created_at).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6C757D" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E86AB" />
        <Text style={styles.loadingText}>Carregando alunos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CadastroAluno')}
        >
          <Ionicons name="person-add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Novo Aluno</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={alunos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderAluno}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people" size={48} color="#6C757D" />
            <Text style={styles.emptyText}>Nenhum aluno cadastrado</Text>
            <Text style={styles.emptySubtext}>
              Clique em "Novo Aluno" para cadastrar o primeiro aluno
            </Text>
          </View>
        }
        contentContainerStyle={alunos.length === 0 && styles.emptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6C757D',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E86AB',
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  alunoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  alunoInfo: {
    flex: 1,
  },
  alunoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3142',
    marginBottom: 4,
  },
  alunoDetalhes: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 2,
  },
  alunoData: {
    fontSize: 12,
    color: '#6C757D',
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});