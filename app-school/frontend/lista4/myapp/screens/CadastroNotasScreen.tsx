import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  FlatList
} from 'react-native';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { RefreshControl } from 'react-native-gesture-handler';

export default function CadastroNotasScreen({ navigation, route }: any) {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<any>(null);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<any>(null);
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [modalAlunoVisible, setModalAlunoVisible] = useState(false);
  const [modalDisciplinaVisible, setModalDisciplinaVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Recarregar dados quando a tela receber foco (quando voltar de cadastrar aluno)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🔄 Tela de notas recebeu foco, recarregando dados...');
      carregarDados();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      console.log('📥 Carregando alunos e disciplinas...');
      
      const [resAlunos, resDisciplinas] = await Promise.all([
        api.getProfessorAlunos(),
        api.getProfessorDisciplinas()
      ]);
      
      setAlunos(resAlunos.data || []);
      setDisciplinas(resDisciplinas.data || []);
      
      console.log('✅ Dados carregados:');
      console.log(`   📊 ${resAlunos.data?.length} aluno(s)`);
      console.log(`   📚 ${resDisciplinas.data?.length} disciplina(s)`);
      
      // Log dos alunos carregados para debug
      if (resAlunos.data) {
        resAlunos.data.forEach((aluno: any, index: number) => {
          console.log(`   👤 ${index + 1}. ${aluno.nome} (${aluno.matricula})`);
        });
      }
      
    } catch (err: any) {
      console.error('❌ Erro ao carregar dados:', err);
      Alert.alert('Erro', 'Falha ao carregar alunos e disciplinas');
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarDados();
  };

  const carregarNotasExistentes = async () => {
    if (!alunoSelecionado || !disciplinaSelecionada) return;

    try {
      const res = await api.getNotas(alunoSelecionado.id, disciplinaSelecionada.id);
      const notas = res.data;
      setNota1(notas.nota1?.toString() || '');
      setNota2(notas.nota2?.toString() || '');
      console.log(`📝 Notas carregadas: AV1=${notas.nota1}, AV2=${notas.nota2}`);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error('Erro ao carregar notas:', err);
      } else {
        console.log('📝 Nenhuma nota encontrada, campos limpos');
      }
      // Se não encontrar notas, mantém os campos vazios
      setNota1('');
      setNota2('');
    }
  };

  useEffect(() => {
    carregarNotasExistentes();
  }, [alunoSelecionado, disciplinaSelecionada]);

  const validarNota = (nota: string): boolean => {
    if (nota === '') return true;
    const valor = parseFloat(nota);
    return !isNaN(valor) && valor >= 0 && valor <= 10;
  };

  const handleSalvarNotas = async () => {
    if (!alunoSelecionado || !disciplinaSelecionada) {
      Alert.alert('Atenção', 'Selecione um aluno e uma disciplina');
      return;
    }

    if (!validarNota(nota1) || !validarNota(nota2)) {
      Alert.alert('Atenção', 'As notas devem ser números entre 0 e 10');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        aluno_id: alunoSelecionado.id,
        disciplina_id: disciplinaSelecionada.id,
        nota1: nota1 === '' ? 0 : parseFloat(nota1),
        nota2: nota2 === '' ? 0 : parseFloat(nota2)
      };

      console.log(`💾 Salvando notas para ${alunoSelecionado.nome}:`, payload);
      
      await api.saveNotas(payload);
      
      Alert.alert('Sucesso', 'Notas salvas com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => {
            console.log('✅ Notas salvas, voltando...');
            navigation.goBack();
          }
        }
      ]);
    } catch (err: any) {
      console.error('❌ Erro ao salvar notas:', err);
      const errorMessage = err.response?.data?.message || 'Falha ao salvar notas';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calcularMedia = (): string => {
    const n1 = nota1 === '' ? 0 : parseFloat(nota1);
    const n2 = nota2 === '' ? 0 : parseFloat(nota2);
    const media = (n1 + n2) / 2;
    return isNaN(media) ? '0.0' : media.toFixed(1);
  };

  const getSituacao = (): string => {
    const media = parseFloat(calcularMedia());
    return media >= 6 ? 'Aprovado' : 'Reprovado';
  };

  const getSituacaoColor = (): string => {
    return getSituacao() === 'Aprovado' ? '#27AE60' : '#E74C3C';
  };

  const handleCadastrarNovoAluno = () => {
    console.log('➡️ Navegando para cadastro de aluno...');
    navigation.navigate('CadastroAluno');
  };

  const renderAlunoItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        alunoSelecionado?.id === item.id && styles.itemSelecionado
      ]}
      onPress={() => {
        setAlunoSelecionado(item);
        setModalAlunoVisible(false);
        console.log(`👤 Aluno selecionado: ${item.nome}`);
      }}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemDetalhes}>
          {item.matricula} • {item.curso}
        </Text>
        <Text style={styles.itemData}>
          Cadastrado em: {new Date(item.created_at).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      {alunoSelecionado?.id === item.id && (
        <Ionicons name="checkmark" size={20} color="#2E86AB" />
      )}
    </TouchableOpacity>
  );

  const renderDisciplinaItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        disciplinaSelecionada?.id === item.id && styles.itemSelecionado
      ]}
      onPress={() => {
        setDisciplinaSelecionada(item);
        setModalDisciplinaVisible(false);
        console.log(`📚 Disciplina selecionada: ${item.nome}`);
      }}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemDetalhes}>
          {item.carga_horaria}h
        </Text>
      </View>
      {disciplinaSelecionada?.id === item.id && (
        <Ionicons name="checkmark" size={20} color="#2E86AB" />
      )}
    </TouchableOpacity>
  );

  if (carregando) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E86AB" />
        <Text style={styles.loadingText}>Carregando alunos e disciplinas...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Ionicons name="document-text" size={32} color="#2E86AB" />
        <Text style={styles.title}>Cadastrar Notas</Text>
        <Text style={styles.subtitle}>Lançamento de notas AV1 e AV2</Text>
        
        {/* Informações sobre dados carregados */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            📊 {alunos.length} aluno(s) disponível(is)
          </Text>
          <Text style={styles.infoText}>
            📚 {disciplinas.length} disciplina(s) disponível(is)
          </Text>
        </View>

        {/* Botão para cadastrar novo aluno */}
        <TouchableOpacity 
          style={styles.novoAlunoButton}
          onPress={handleCadastrarNovoAluno}
        >
          <Ionicons name="person-add" size={16} color="#2E86AB" />
          <Text style={styles.novoAlunoText}>Cadastrar Novo Aluno</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {/* Seletor de Aluno */}
        <View style={styles.selectorHeader}>
          <Text style={styles.label}>Aluno *</Text>
          <TouchableOpacity onPress={() => setModalAlunoVisible(true)}>
            <Text style={styles.selectorHelp}>Ver lista completa</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.selectorButton}
          onPress={() => setModalAlunoVisible(true)}
        >
          <Text style={alunoSelecionado ? styles.selectorText : styles.selectorPlaceholder}>
            {alunoSelecionado ? alunoSelecionado.nome : 'Selecione um aluno'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#6C757D" />
        </TouchableOpacity>

        {/* Seletor de Disciplina */}
        <View style={styles.selectorHeader}>
          <Text style={styles.label}>Disciplina *</Text>
          <TouchableOpacity onPress={() => setModalDisciplinaVisible(true)}>
            <Text style={styles.selectorHelp}>Ver lista completa</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.selectorButton}
          onPress={() => setModalDisciplinaVisible(true)}
        >
          <Text style={disciplinaSelecionada ? styles.selectorText : styles.selectorPlaceholder}>
            {disciplinaSelecionada ? disciplinaSelecionada.nome : 'Selecione uma disciplina'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#6C757D" />
        </TouchableOpacity>

        {/* Campos de Notas */}
        {(alunoSelecionado && disciplinaSelecionada) && (
          <View style={styles.notasContainer}>
            <Text style={styles.notasTitle}>Lançamento de Notas</Text>
            
            <View style={styles.alunoSelecionadoInfo}>
              <Ionicons name="person" size={16} color="#2E86AB" />
              <Text style={styles.alunoSelecionadoText}>
                {alunoSelecionado.nome} • {disciplinaSelecionada.nome}
              </Text>
            </View>
            
            <View style={styles.notasRow}>
              <View style={styles.notaInputContainer}>
                <Text style={styles.notaLabel}>AV1</Text>
                <TextInput
                  value={nota1}
                  onChangeText={setNota1}
                  style={[
                    styles.notaInput,
                    !validarNota(nota1) && styles.inputError
                  ]}
                  keyboardType="decimal-pad"
                  placeholder="0.0"
                  placeholderTextColor="#6C757D"
                  maxLength={4}
                />
              </View>

              <View style={styles.notaInputContainer}>
                <Text style={styles.notaLabel}>AV2</Text>
                <TextInput
                  value={nota2}
                  onChangeText={setNota2}
                  style={[
                    styles.notaInput,
                    !validarNota(nota2) && styles.inputError
                  ]}
                  keyboardType="decimal-pad"
                  placeholder="0.0"
                  placeholderTextColor="#6C757D"
                  maxLength={4}
                />
              </View>
            </View>

            {/* Preview da Média e Situação */}
            <View style={styles.previewContainer}>
              <View style={styles.previewItem}>
                <Text style={styles.previewLabel}>Média</Text>
                <Text style={styles.previewValue}>{calcularMedia()}</Text>
              </View>
              <View style={styles.previewItem}>
                <Text style={styles.previewLabel}>Situação</Text>
                <Text style={[styles.previewValue, { color: getSituacaoColor() }]}>
                  {getSituacao()}
                </Text>
              </View>
            </View>

            <Text style={styles.helpText}>
              💡 Digite notas de 0 a 10. Média mínima para aprovação: 6.0
            </Text>
          </View>
        )}

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!alunoSelecionado || !disciplinaSelecionada || loading) && styles.saveButtonDisabled
          ]}
          onPress={handleSalvarNotas}
          disabled={!alunoSelecionado || !disciplinaSelecionada || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="save" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Salvar Notas</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={20} color="#6C757D" />
          <Text style={styles.cancelButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Seleção de Aluno */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAlunoVisible}
        onRequestClose={() => setModalAlunoVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Selecionar Aluno ({alunos.length})
              </Text>
              <TouchableOpacity onPress={() => setModalAlunoVisible(false)}>
                <Ionicons name="close" size={24} color="#2D3142" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={alunos}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderAlunoItem}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="people" size={48} color="#6C757D" />
                  <Text style={styles.emptyText}>Nenhum aluno cadastrado</Text>
                  <Text style={styles.emptySubtext}>
                    Cadastre alunos primeiro para lançar notas
                  </Text>
                  <TouchableOpacity 
                    style={styles.emptyButton}
                    onPress={handleCadastrarNovoAluno}
                  >
                    <Text style={styles.emptyButtonText}>Cadastrar Aluno</Text>
                  </TouchableOpacity>
                </View>
              }
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de Seleção de Disciplina */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDisciplinaVisible}
        onRequestClose={() => setModalDisciplinaVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Selecionar Disciplina ({disciplinas.length})
              </Text>
              <TouchableOpacity onPress={() => setModalDisciplinaVisible(false)}>
                <Ionicons name="close" size={24} color="#2D3142" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={disciplinas}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderDisciplinaItem}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="book" size={48} color="#6C757D" />
                  <Text style={styles.emptyText}>Nenhuma disciplina encontrada</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
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
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  infoContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    alignSelf: 'stretch',
  },
  infoText: {
    fontSize: 12,
    color: '#2E86AB',
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  novoAlunoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2E86AB',
  },
  novoAlunoText: {
    color: '#2E86AB',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  form: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    color: '#2D3142',
    fontSize: 16,
  },
  selectorHelp: {
    fontSize: 12,
    color: '#2E86AB',
    fontWeight: '500',
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  selectorText: {
    fontSize: 16,
    color: '#2D3142',
  },
  selectorPlaceholder: {
    fontSize: 16,
    color: '#6C757D',
  },
  notasContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  notasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3142',
    marginBottom: 12,
    textAlign: 'center',
  },
  alunoSelecionadoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 6,
  },
  alunoSelecionadoText: {
    fontSize: 14,
    color: '#2E86AB',
    fontWeight: '500',
    marginLeft: 4,
  },
  notasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  notaInputContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  notaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3142',
    marginBottom: 8,
  },
  notaInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#2D3142',
    textAlign: 'center',
    width: '100%',
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  previewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  previewItem: {
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86AB',
  },
  helpText: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E86AB',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  saveButtonDisabled: {
    backgroundColor: '#6C757D',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#6C757D',
  },
  cancelButtonText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3142',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  itemSelecionado: {
    backgroundColor: '#F8F9FA',
  },
  itemInfo: {
    flex: 1,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3142',
    marginBottom: 4,
  },
  itemDetalhes: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 2,
  },
  itemData: {
    fontSize: 10,
    color: '#6C757D',
    fontStyle: 'italic',
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
  emptyButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2E86AB',
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});