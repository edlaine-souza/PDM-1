import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroProfessorScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [titulacao, setTitulacao] = useState('');
  const [tempoDocencia, setTempoDocencia] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!nome.trim() || !titulacao.trim() || !tempoDocencia.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (isNaN(Number(tempoDocencia)) || Number(tempoDocencia) < 0) {
      Alert.alert('Atenção', 'Tempo de docência deve ser um número válido');
      return;
    }

    try {
      setLoading(true);
      const payload = { 
        nome, 
        titulacao, 
        tempo_docencia: tempoDocencia 
      };
      
      await api.createProfessor(payload);
      
      Alert.alert('Sucesso', 'Professor cadastrado com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => {
            setNome('');
            setTitulacao('');
            setTempoDocencia('');
            navigation.goBack();
          }
        }
      ]);
    } catch (err: any) {
      console.error('Erro ao cadastrar professor:', err);
      const errorMessage = err.response?.data?.message || 'Falha ao cadastrar professor';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-add" size={32} color="#2E86AB" />
        <Text style={styles.title}>Cadastrar Professor</Text>
        <Text style={styles.subtitle}>Preencha os dados do novo professor</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome Completo *</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          placeholder="Ex: Prof. André Olímpio"
          placeholderTextColor="#6C757D"
        />

        <Text style={styles.label}>Titulação *</Text>
        <TextInput
          value={titulacao}
          onChangeText={setTitulacao}
          style={styles.input}
          placeholder="Ex: Mestre, Doutor, Especialista"
          placeholderTextColor="#6C757D"
        />

        <Text style={styles.label}>Tempo de Docência (anos) *</Text>
        <TextInput
          value={tempoDocencia}
          onChangeText={setTempoDocencia}
          style={styles.input}
          placeholder="Ex: 5"
          placeholderTextColor="#6C757D"
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={[
            styles.saveButton,
            (!nome || !titulacao || !tempoDocencia) && styles.saveButtonDisabled
          ]}
          onPress={handleSalvar}
          disabled={!nome || !titulacao || !tempoDocencia || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="save" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Cadastrar Professor</Text>
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
});