import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Button,
} from 'react-native';
import api from '../services/api';

export default function BoletimScreen() {
  const [alunoId, setAlunoId] = useState('');
  const [boletim, setBoletim] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarBoletim = async () => {
    if (!alunoId.trim()) {
      Alert.alert('Atenção', 'Informe o ID do aluno para consultar o boletim.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.boletimByAluno(Number(alunoId));
      setBoletim(res.data || []);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', err?.response?.data?.message || 'Falha ao buscar boletim');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.materia}>{item.disciplina_nome}</Text>
      <Text>Nota 1: {item.nota1}</Text>
      <Text>Nota 2: {item.nota2}</Text>
      <Text>Média: {item.media}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID do Aluno</Text>
      <TextInput
        value={alunoId}
        onChangeText={setAlunoId}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Digite o ID do aluno (ex: 1)"
      />
      <Button title="Buscar Boletim" onPress={buscarBoletim} />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <View style={{ marginTop: 20 }}>
  {boletim.length === 0 ? (
    <Text style={styles.emptyText}>Nenhum boletim encontrado</Text>
  ) : (
    <FlatList
      data={boletim}
      keyExtractor={(item) => String(item.disciplina_id)}
      renderItem={renderItem}
    />
  )}
</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginTop: 6,
    marginBottom: 10,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  materia: { fontWeight: '700', marginBottom: 6 },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 16,
    fontStyle: 'italic',
  },
});
