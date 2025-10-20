import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

export default function CadastroProfessorScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [titulacao, setTitulacao] = useState('');
  const [tempo, setTempo] = useState('');

  const handleSalvar = async () => {
    try {
      const payload = { nome, titulacao, tempo_docencia: tempo };
      await api.createProfessor(payload);
      Alert.alert('Sucesso', 'Professor cadastrado');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao cadastrar professor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput value={nome} onChangeText={setNome} style={styles.input} />
      <Text style={styles.label}>Titulação</Text>
      <TextInput value={titulacao} onChangeText={setTitulacao} style={styles.input} />
      <Text style={styles.label}>Tempo de docência (anos)</Text>
      <TextInput value={tempo} onChangeText={setTempo} style={styles.input} keyboardType="numeric" />
      <Button title="Salvar" onPress={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { marginTop: 10, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 6 },
});
