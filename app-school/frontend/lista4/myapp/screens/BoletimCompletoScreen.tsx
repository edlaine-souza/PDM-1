import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function BoletimCompletoScreen() {
  const [alunoNome, setAlunoNome] = useState('');
  const [boletimData, setBoletimData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const buscarBoletim = async () => {
    if (!alunoNome.trim()) {
      Alert.alert('Atenção', 'Informe o nome do aluno para consultar o boletim.');
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Buscando boletim para aluno:', alunoNome);
      
      const res = await api.boletimByAlunoNome(alunoNome);
      console.log('✅ Boletim completo encontrado');
      
      setBoletimData(res.data);
    } catch (err: any) {
      console.error('❌ Erro ao buscar boletim:', err);
      Alert.alert('Erro', err?.response?.data?.message || 'Falha ao buscar boletim. Verifique o nome do aluno.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    if (!alunoNome.trim()) return;
    
    setRefreshing(true);
    await buscarBoletim();
    setRefreshing(false);
  };

  const getSituacaoColor = (situacao: string) => {
    return situacao === 'Aprovado' ? '#27AE60' : '#E74C3C';
  };

  const getNotaColor = (nota: number) => {
    if (nota >= 7) return '#27AE60';
    if (nota >= 5) return '#F39C12';
    return '#E74C3C';
  };

  const formatarNota = (nota: any): string => {
    if (nota === undefined || nota === null) {
      return '0.0';
    }
    const notaNumber = typeof nota === 'number' ? nota : parseFloat(nota);
    return isNaN(notaNumber) ? '0.0' : notaNumber.toFixed(1);
  };

  const renderDisciplina = ({ item }: { item: any }) => (
    <View style={styles.disciplinaCard}>
      <View style={styles.disciplinaHeader}>
        <View style={styles.disciplinaInfo}>
          <Text style={styles.disciplinaNome}>{item.disciplina_nome}</Text>
          <Text style={styles.professorNome}>{item.professor_nome}</Text>
          <Text style={styles.cargaHoraria}>{item.carga_horaria}h</Text>
        </View>
        <View style={[styles.situacaoBadge, { backgroundColor: getSituacaoColor(item.situacao) }]}>
          <Text style={styles.situacaoText}>{item.situacao}</Text>
        </View>
      </View>

      <View style={styles.notasContainer}>
        <View style={styles.notaItem}>
          <Text style={styles.notaLabel}>AV1</Text>
          <Text style={[styles.notaValue, { color: getNotaColor(item.nota1) }]}>
            {formatarNota(item.nota1)}
          </Text>
        </View>
        <View style={styles.notaItem}>
          <Text style={styles.notaLabel}>AV2</Text>
          <Text style={[styles.notaValue, { color: getNotaColor(item.nota2) }]}>
            {formatarNota(item.nota2)}
          </Text>
        </View>
        <View style={styles.mediaItem}>
          <Text style={styles.mediaLabel}>MÉDIA</Text>
          <Text style={[styles.mediaValue, { color: getNotaColor(item.media) }]}>
            {formatarNota(item.media)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEstatisticas = () => {
    if (!boletimData?.estatisticas) return null;

    const stats = boletimData.estatisticas;

    return (
      <View style={styles.estatisticasContainer}>
        <Text style={styles.estatisticasTitle}>Resumo do Semestre</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="library" size={24} color="#2E86AB" />
            <Text style={styles.statValue}>{stats.totalDisciplinas}</Text>
            <Text style={styles.statLabel}>Disciplinas</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={24} color="#27AE60" />
            <Text style={styles.statValue}>{stats.disciplinasAprovadas}</Text>
            <Text style={styles.statLabel}>Aprovadas</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="close-circle" size={24} color="#E74C3C" />
            <Text style={styles.statValue}>{stats.disciplinasReprovadas}</Text>
            <Text style={styles.statLabel}>Reprovadas</Text>
          </View>
        </View>

        <View style={styles.mediaGeralContainer}>
          <View style={styles.mediaGeralInfo}>
            <Text style={styles.mediaGeralLabel}>Média Geral</Text>
            <Text style={styles.mediaGeralValue}>{stats.mediaGeral}</Text>
          </View>
          <View style={styles.aprovacaoContainer}>
            <Text style={styles.aprovacaoLabel}>Taxa de Aprovação</Text>
            <Text style={styles.aprovacaoValue}>{stats.percentualAprovacao}%</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho de Busca */}
      <View style={styles.header}>
        <Text style={styles.title}>Boletim Acadêmico</Text>
        <Text style={styles.subtitle}>Consulte o desempenho do aluno</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            value={alunoNome}
            onChangeText={setAlunoNome}
            style={styles.input}
            placeholder="Digite o nome do aluno"
            placeholderTextColor="#6C757D"
            autoCapitalize="words"
          />
          <TouchableOpacity
            style={[
              styles.searchButton,
              (!alunoNome.trim() || loading) && styles.searchButtonDisabled
            ]}
            onPress={buscarBoletim}
            disabled={!alunoNome.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Ionicons name="search" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
        
        <Text style={styles.dicaText}>
          💡 Dica: Use "João Silva", "Maria Souza", "Carlos Oliveira", etc.
        </Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E86AB" />
          <Text style={styles.loadingText}>Buscando boletim...</Text>
        </View>
      ) : boletimData ? (
        <FlatList
          data={boletimData.boletim}
          keyExtractor={(item) => String(item.disciplina_id)}
          renderItem={renderDisciplina}
          ListHeaderComponent={
            <View>
              {/* Informações do Aluno */}
              <View style={styles.alunoHeader}>
                <View style={styles.alunoAvatar}>
                  <Ionicons name="person" size={24} color="#2E86AB" />
                </View>
                <View style={styles.alunoInfo}>
                  <Text style={styles.alunoNome}>{boletimData.aluno.nome}</Text>
                  <Text style={styles.alunoDetalhes}>
                    {boletimData.aluno.matricula} • {boletimData.aluno.curso}
                  </Text>
                </View>
              </View>

              {/* Estatísticas */}
              {renderEstatisticas()}

              {/* Título das Disciplinas */}
              <View style={styles.disciplinasHeader}>
                <Text style={styles.disciplinasTitle}>Disciplinas Cursadas</Text>
                <Text style={styles.disciplinasCount}>
                  {boletimData.boletim.length} disciplina(s)
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="school" size={64} color="#6C757D" />
              <Text style={styles.emptyText}>Nenhuma nota encontrada</Text>
              <Text style={styles.emptySubtext}>
                Este aluno não possui notas lançadas no sistema
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Ionicons name="document-text" size={80} color="#E9ECEF" />
          <Text style={styles.placeholderText}>
            Informe o nome do aluno para visualizar o boletim
          </Text>
          <Text style={styles.placeholderSubtext}>
            O boletim mostrará todas as disciplinas com notas, médias e situação de aprovação
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#2E86AB',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    fontSize: 16,
    color: '#2D3142',
  },
  searchButton: {
    backgroundColor: '#1A6A8D',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  searchButtonDisabled: {
    backgroundColor: '#6C757D',
    opacity: 0.6,
  },
  dicaText: {
    fontSize: 12,
    color: '#E3F2FD',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#6C757D',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  alunoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  alunoAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alunoInfo: {
    flex: 1,
  },
  alunoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3142',
    marginBottom: 4,
  },
  alunoDetalhes: {
    fontSize: 14,
    color: '#6C757D',
  },
  estatisticasContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  estatisticasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3142',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3142',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
  },
  mediaGeralContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  mediaGeralInfo: {
    alignItems: 'flex-start',
  },
  mediaGeralLabel: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
  },
  mediaGeralValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86AB',
  },
  aprovacaoContainer: {
    alignItems: 'flex-end',
  },
  aprovacaoLabel: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
  },
  aprovacaoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  disciplinasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  disciplinasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3142',
  },
  disciplinasCount: {
    fontSize: 14,
    color: '#6C757D',
  },
  disciplinaCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  disciplinaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  disciplinaInfo: {
    flex: 1,
    marginRight: 12,
  },
  disciplinaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3142',
    marginBottom: 4,
  },
  professorNome: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 2,
  },
  cargaHoraria: {
    fontSize: 12,
    color: '#6C757D',
  },
  situacaoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  situacaoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  notasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notaItem: {
    alignItems: 'center',
    flex: 1,
  },
  notaLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 4,
    fontWeight: '500',
  },
  notaValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  mediaItem: {
    alignItems: 'center',
    flex: 1,
  },
  mediaLabel: {
    fontSize: 12,
    color: '#2D3142',
    fontWeight: '600',
    marginBottom: 4,
  },
  mediaValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholderText: {
    fontSize: 18,
    color: '#6C757D',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});