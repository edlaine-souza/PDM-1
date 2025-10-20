import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Modal,
  FlatList,
  Platform 
} from 'react-native';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroDisciplinaScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [carga, setCarga] = useState('');
  const [professores, setProfessores] = useState<any[]>([]);
  const [professorSelecionado, setProfessorSelecionado] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.listProfessores();
        setProfessores(res.data || []);
      } catch (err) {
        console.error(err);
        Alert.alert('Erro', 'Falha ao carregar professores');
      }
    };
    load();
  }, []);

  const handleSalvar = async () => {
    if (!nome || !carga || !professorSelecionado) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const payload = { 
        nome, 
        carga_horaria: carga, 
        professor_id: professorSelecionado.id 
      };
      await api.createDisciplina(payload);
      Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao cadastrar disciplina');
    }
  };

  const ProfessorItem = ({ professor }: any) => (
    <TouchableOpacity
      style={[
        styles.professorItem,
        professorSelecionado?.id === professor.id && styles.professorSelecionado
      ]}
      onPress={() => {
        setProfessorSelecionado(professor);
        setModalVisible(false);
      }}
    >
      <Text style={styles.professorNome}>{professor.nome}</Text>
      <Text style={styles.professorDetalhes}>
        {professor.titulacao} • {professor.tempo_docencia} anos
      </Text>
      {professorSelecionado?.id === professor.id && (
        <Ionicons name="checkmark" size={20} color="#2E86AB" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome da Disciplina *</Text>
      <TextInput 
        value={nome} 
        onChangeText={setNome} 
        style={styles.input} 
        placeholder="Ex: Programação Mobile I"
        placeholderTextColor="#6C757D"
      />

      <Text style={styles.label}>Carga Horária *</Text>
      <TextInput 
        value={carga} 
        onChangeText={setCarga} 
        style={styles.input} 
        keyboardType="numeric" 
        placeholder="Ex: 80"
        placeholderTextColor="#6C757D"
      />

      <Text style={styles.label}>Professor Responsável *</Text>
      <TouchableOpacity 
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={professorSelecionado ? styles.selectorText : styles.selectorPlaceholder}>
          {professorSelecionado ? professorSelecionado.nome : 'Selecione um professor'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#6C757D" />
      </TouchableOpacity>

      {professorSelecionado && (
        <View style={styles.professorInfo}>
          <Text style={styles.professorInfoText}>
            Professor selecionado: <Text style={styles.professorInfoNome}>{professorSelecionado.nome}</Text>
          </Text>
          <Text style={styles.professorInfoDetalhes}>
            {professorSelecionado.titulacao} • {professorSelecionado.tempo_docencia} anos de experiência
          </Text>
        </View>
      )}

      <TouchableOpacity 
        style={[
          styles.saveButton,
          (!nome || !carga || !professorSelecionado) && styles.saveButtonDisabled
        ]}
        onPress={handleSalvar}
        disabled={!nome || !carga || !professorSelecionado}
      >
        <Ionicons name="save" size={20} color="#FFFFFF" />
        <Text style={styles.saveButtonText}>Cadastrar Disciplina</Text>
      </TouchableOpacity>

      {/* Modal para seleção de professor */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Professor</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#2D3142" />
              </TouchableOpacity>
            </View>

            {professores.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="people" size={48} color="#6C757D" />
                <Text style={styles.emptyText}>Nenhum professor cadastrado</Text>
                <Text style={styles.emptySubtext}>
                  Cadastre professores primeiro para associá-los a disciplinas
                </Text>
              </View>
            ) : (
              <FlatList
                data={professores}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <ProfessorItem professor={item} />}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#F8F9FA'
  },
  label: { 
    marginTop: 16, 
    marginBottom: 8,
    fontWeight: '600',
    color: '#2D3142',
    fontSize: 16
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#E9ECEF', 
    borderRadius: 12, 
    padding: 16, 
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#2D3142'
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
  },
  selectorText: {
    fontSize: 16,
    color: '#2D3142',
  },
  selectorPlaceholder: {
    fontSize: 16,
    color: '#6C757D',
  },
  professorInfo: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  professorInfoText: {
    fontSize: 14,
    color: '#2D3142',
  },
  professorInfoNome: {
    fontWeight: '600',
    color: '#2E86AB',
  },
  professorInfoDetalhes: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E86AB',
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
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
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // Safe area para iOS
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
  closeButton: {
    padding: 4,
  },
  professorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  professorSelecionado: {
    backgroundColor: '#F8F9FA',
  },
  professorNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3142',
    flex: 1,
  },
  professorDetalhes: {
    fontSize: 12,
    color: '#6C757D',
    marginRight: 12,
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