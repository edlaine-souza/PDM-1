import React, { useState } from 'react';
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

export default function CadastroUsuarioScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [perfil, setPerfil] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalPerfilVisible, setModalPerfilVisible] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);

  const perfis = [
    { 
      id: 'aluno', 
      nome: 'Aluno', 
      descricao: 'Acesso ao boletim acadêmico', 
      icon: 'school' as const, 
      color: '#2E86AB' 
    },
    { 
      id: 'professor', 
      nome: 'Professor', 
      descricao: 'Cadastro de notas e disciplinas', 
      icon: 'person' as const, 
      color: '#27AE60' 
    },
    { 
      id: 'admin', 
      nome: 'Administrador', 
      descricao: 'Acesso completo ao sistema', 
      icon: 'shield' as const, 
      color: '#E74C3C' 
    }
  ];

  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarSenha = (senha: string): boolean => {
    return senha.length >= 6;
  };

  const handleCadastrar = async () => {
    // Validações
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha || !perfil) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('Atenção', 'Digite um email válido');
      return;
    }

    if (!validarSenha(senha)) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senha,
        perfil: perfil
      };

      await api.register(payload);
      
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => {
            // Limpar formulário
            setNome('');
            setEmail('');
            setSenha('');
            setConfirmarSenha('');
            setPerfil('');
            navigation.goBack();
          }
        }
      ]);
    } catch (err: any) {
      console.error('Erro ao cadastrar usuário:', err);
      const errorMessage = err.response?.data?.message || 'Falha ao cadastrar usuário';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderPerfilItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.perfilItem,
        perfil === item.id && styles.perfilSelecionado
      ]}
      onPress={() => {
        setPerfil(item.id);
        setModalPerfilVisible(false);
      }}
    >
      <View style={[styles.perfilIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.perfilInfo}>
        <Text style={styles.perfilNome}>{item.nome}</Text>
        <Text style={styles.perfilDescricao}>{item.descricao}</Text>
      </View>
      {perfil === item.id && (
        <Ionicons name="checkmark-circle" size={24} color={item.color} />
      )}
    </TouchableOpacity>
  );

  const getPerfilSelecionado = () => {
    return perfis.find(p => p.id === perfil);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-add" size={32} color="#2E86AB" />
        <Text style={styles.title}>Cadastrar Usuário</Text>
        <Text style={styles.subtitle}>Crie uma nova conta no sistema</Text>
      </View>

      <View style={styles.form}>
        {/* Nome */}
        <Text style={styles.label}>Nome Completo *</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          placeholder="Ex: João Silva"
          placeholderTextColor="#6C757D"
        />

        {/* Email */}
        <Text style={styles.label}>Email *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#6C757D" style={styles.inputIcon} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.inputWithIcon}
            placeholder="exemplo@email.com"
            placeholderTextColor="#6C757D"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* Senha */}
        <Text style={styles.label}>Senha *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#6C757D" style={styles.inputIcon} />
          <TextInput
            value={senha}
            onChangeText={setSenha}
            style={styles.inputWithIcon}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#6C757D"
            secureTextEntry={secureText}
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

        {/* Confirmar Senha */}
        <Text style={styles.label}>Confirmar Senha *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#6C757D" style={styles.inputIcon} />
          <TextInput
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            style={styles.inputWithIcon}
            placeholder="Digite a senha novamente"
            placeholderTextColor="#6C757D"
            secureTextEntry={secureTextConfirm}
          />
          <TouchableOpacity 
            onPress={() => setSecureTextConfirm(!secureTextConfirm)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={secureTextConfirm ? "eye-off" : "eye"} 
              size={20} 
              color="#6C757D" 
            />
          </TouchableOpacity>
        </View>

        {/* Perfil */}
        <Text style={styles.label}>Perfil *</Text>
        <TouchableOpacity 
          style={styles.selectorButton}
          onPress={() => setModalPerfilVisible(true)}
        >
          {perfil ? (
            <View style={styles.perfilSelecionadoPreview}>
              <View style={[styles.perfilIconSmall, { backgroundColor: getPerfilSelecionado()?.color }]}>
                <Ionicons name={getPerfilSelecionado()?.icon} size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.selectorText}>{getPerfilSelecionado()?.nome}</Text>
            </View>
          ) : (
            <Text style={styles.selectorPlaceholder}>Selecione um perfil</Text>
          )}
          <Ionicons name="chevron-down" size={20} color="#6C757D" />
        </TouchableOpacity>

        {/* Botão Cadastrar */}
        <TouchableOpacity
          style={[
            styles.cadastrarButton,
            (!nome || !email || !senha || !confirmarSenha || !perfil || loading) && styles.cadastrarButtonDisabled
          ]}
          onPress={handleCadastrar}
          disabled={!nome || !email || !senha || !confirmarSenha || !perfil || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="person-add" size={20} color="#FFFFFF" />
              <Text style={styles.cadastrarButtonText}>Cadastrar Usuário</Text>
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

      {/* Modal de Seleção de Perfil */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPerfilVisible}
        onRequestClose={() => setModalPerfilVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Perfil</Text>
              <TouchableOpacity onPress={() => setModalPerfilVisible(false)}>
                <Ionicons name="close" size={24} color="#2D3142" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={perfis}
              keyExtractor={(item) => item.id}
              renderItem={renderPerfilItem}
              style={styles.perfilList}
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
  form: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#2D3142',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#2D3142',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  inputWithIcon: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#2D3142',
  },
  eyeIcon: {
    padding: 16,
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
  perfilSelecionadoPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  perfilIconSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectorText: {
    fontSize: 16,
    color: '#2D3142',
    fontWeight: '500',
  },
  selectorPlaceholder: {
    fontSize: 16,
    color: '#6C757D',
  },
  cadastrarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E86AB',
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
  },
  cadastrarButtonDisabled: {
    backgroundColor: '#6C757D',
    opacity: 0.6,
  },
  cadastrarButtonText: {
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
  perfilList: {
    paddingHorizontal: 16,
  },
  perfilItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  perfilSelecionado: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  perfilIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  perfilInfo: {
    flex: 1,
  },
  perfilNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3142',
    marginBottom: 4,
  },
  perfilDescricao: {
    fontSize: 12,
    color: '#6C757D',
  },
});