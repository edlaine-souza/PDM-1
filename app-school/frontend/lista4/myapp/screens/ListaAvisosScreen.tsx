import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListaAvisosScreen({ navigation, route }: any) {
  const [avisos, setAvisos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [perfil, setPerfil] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    mensagem: '',
    tipo: 'geral',
    data_expiracao: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
      return () => {};
    }, [])
  );

  useEffect(() => {
    const getPerfil = async () => {
      const perfilSalvo = await AsyncStorage.getItem('@perfil');
      setPerfil(perfilSalvo || '');
    };
    getPerfil();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resAvisos, resUnread] = await Promise.all([
        api.listAvisos(),
        api.getUnreadAvisosCount()
      ]);
      setAvisos(resAvisos.data || []);
      setUnreadCount(resUnread.data?.total || 0);
    } catch (err: any) {
      console.error('Erro ao carregar avisos:', err);
      Alert.alert('Erro', 'Falha ao carregar avisos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarDados();
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.markAvisoAsRead(id);
      // Atualizar localmente
      setAvisos(prev => prev.map(aviso => 
        aviso.id === id ? { ...aviso, lido: true } : aviso
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erro ao marcar como lido:', err);
    }
  };

  const handleCreateAviso = async () => {
    if (!formData.titulo || !formData.mensagem) {
      Alert.alert('Atenção', 'Preencha título e mensagem');
      return;
    }

    try {
      setSubmitting(true);
      await api.createAviso(formData);
      
      Alert.alert('Sucesso', 'Aviso publicado com sucesso!');
      setModalVisible(false);
      setFormData({
        titulo: '',
        mensagem: '',
        tipo: 'geral',
        data_expiracao: ''
      });
      carregarDados();
    } catch (err: any) {
      console.error('Erro ao criar aviso:', err);
      Alert.alert('Erro', err.response?.data?.message || 'Falha ao publicar aviso');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAviso = (id: number) => {
    Alert.alert(
      'Excluir Aviso',
      'Tem certeza que deseja excluir este aviso?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteAviso(id);
              carregarDados();
            } catch (err) {
              console.error('Erro ao excluir aviso:', err);
              Alert.alert('Erro', 'Falha ao excluir aviso');
            }
          }
        }
      ]
    );
  };

  const getTipoColor = (tipo: string) => {
    switch(tipo) {
      case 'importante': return '#E74C3C';
      case 'alerta': return '#F39C12';
      case 'informacao': return '#3498DB';
      default: return '#2E86AB';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch(tipo) {
      case 'importante': return 'warning';
      case 'alerta': return 'alert-circle';
      case 'informacao': return 'information-circle';
      default: return 'megaphone';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderAviso = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[
        styles.avisoCard,
        !item.lido && styles.avisoNaoLido
      ]}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <View style={[styles.tipoIndicator, { backgroundColor: getTipoColor(item.tipo) }]} />
      
      <View style={styles.avisoContent}>
        <View style={styles.avisoHeader}>
          <View style={styles.tipoContainer}>
            <Ionicons 
              name={getTipoIcon(item.tipo)} 
              size={16} 
              color={getTipoColor(item.tipo)} 
            />
            <Text style={[styles.tipoText, { color: getTipoColor(item.tipo) }]}>
              {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
            </Text>
          </View>
          {!item.lido && (
            <View style={styles.naoLidoBadge}>
              <Text style={styles.naoLidoText}>NOVO</Text>
            </View>
          )}
        </View>

        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.mensagem}>{item.mensagem}</Text>

        <View style={styles.avisoFooter}>
          <Text style={styles.autor}>
            Por: {item.autor_nome}
          </Text>
          <Text style={styles.data}>
            {formatDate(item.data_publicacao)}
          </Text>
        </View>

        {item.data_expiracao && (
          <Text style={styles.expiracao}>
            ⏰ Expira: {formatDate(item.data_expiracao)}
          </Text>
        )}

        {perfil === 'admin' && (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteAviso(item.id)}
          >
            <Ionicons name="trash" size={16} color="#E74C3C" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E86AB" />
        <Text style={styles.loadingText}>Carregando avisos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Avisos Acadêmicos</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        {(perfil === 'admin' || perfil === 'professor') && (
          <TouchableOpacity 
            style={styles.novoAvisoButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
            <Text style={styles.novoAvisoText}>Novo Aviso</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.subtitle}>
          {unreadCount > 0 
            ? `Você tem ${unreadCount} aviso(s) não lido(s)` 
            : 'Todos os avisos foram lidos'}
        </Text>
      </View>

      <FlatList
        data={avisos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderAviso}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="megaphone" size={64} color="#6C757D" />
            <Text style={styles.emptyText}>Nenhum aviso disponível</Text>
            <Text style={styles.emptySubtext}>
              Acompanhe aqui os comunicados importantes da instituição
            </Text>
          </View>
        }
        contentContainerStyle={avisos.length === 0 && styles.emptyList}
      />

      {/* Modal para criar novo aviso */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Aviso</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#2D3142" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalLabel}>Título *</Text>
              <TextInput
                value={formData.titulo}
                onChangeText={(text) => setFormData({...formData, titulo: text})}
                style={styles.modalInput}
                placeholder="Ex: Início do Semestre"
                placeholderTextColor="#6C757D"
              />

              <Text style={styles.modalLabel}>Mensagem *</Text>
              <TextInput
                value={formData.mensagem}
                onChangeText={(text) => setFormData({...formData, mensagem: text})}
                style={[styles.modalInput, styles.textArea]}
                placeholder="Digite a mensagem do aviso..."
                placeholderTextColor="#6C757D"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <Text style={styles.modalLabel}>Tipo</Text>
              <View style={styles.tipoOptions}>
                {['geral', 'importante', 'alerta', 'informacao'].map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.tipoOption,
                      formData.tipo === tipo && styles.tipoOptionSelected
                    ]}
                    onPress={() => setFormData({...formData, tipo})}
                  >
                    <Text style={[
                      styles.tipoOptionText,
                      formData.tipo === tipo && styles.tipoOptionTextSelected
                    ]}>
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Data de Expiração (opcional)</Text>
              <TextInput
                value={formData.data_expiracao}
                onChangeText={(text) => setFormData({...formData, data_expiracao: text})}
                style={styles.modalInput}
                placeholder="AAAA-MM-DD HH:MM:SS"
                placeholderTextColor="#6C757D"
              />
              <Text style={styles.helpText}>
                Deixe em branco para aviso permanente
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
                disabled={submitting}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modalSubmitButton,
                  (!formData.titulo || !formData.mensagem || submitting) && styles.modalSubmitButtonDisabled
                ]}
                onPress={handleCreateAviso}
                disabled={!formData.titulo || !formData.mensagem || submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="send" size={16} color="#FFFFFF" />
                    <Text style={styles.modalSubmitText}>Publicar Aviso</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 20,
    backgroundColor: '#2E86AB',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  unreadBadge: {
    backgroundColor: '#E74C3C',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  novoAvisoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A6A8D',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  novoAvisoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#E3F2FD',
  },
  avisoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avisoNaoLido: {
    backgroundColor: '#F0F7FF',
    borderColor: '#2E86AB',
  },
  tipoIndicator: {
    width: 6,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  avisoContent: {
    flex: 1,
    padding: 16,
  },
  avisoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipoText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  naoLidoBadge: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  naoLidoText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3142',
    marginBottom: 8,
  },
  mensagem: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
    marginBottom: 12,
  },
  avisoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  autor: {
    fontSize: 12,
    color: '#6C757D',
  },
  data: {
    fontSize: 12,
    color: '#6C757D',
  },
  expiracao: {
    fontSize: 11,
    color: '#F39C12',
    marginTop: 8,
    fontStyle: 'italic',
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
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
    maxHeight: '90%',
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
  modalBody: {
    padding: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3142',
    marginBottom: 8,
    marginTop: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#2D3142',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  tipoOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tipoOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
  },
  tipoOptionSelected: {
    backgroundColor: '#2E86AB',
    borderColor: '#2E86AB',
  },
  tipoOptionText: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },
  tipoOptionTextSelected: {
    color: '#FFFFFF',
  },
  helpText: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 4,
    fontStyle: 'italic',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6C757D',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '500',
  },
  modalSubmitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E86AB',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  modalSubmitButtonDisabled: {
    backgroundColor: '#6C757D',
    opacity: 0.6,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});