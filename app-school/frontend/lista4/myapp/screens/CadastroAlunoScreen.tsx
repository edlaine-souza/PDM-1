import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

export default function CadastroAlunoScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [curso, setCurso] = useState('');

  const handleSalvar = async () => {
    try {
      const payload = { nome, matricula, curso };
      await api.createAluno(payload);
      Alert.alert('Sucesso', 'Aluno cadastrado');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao cadastrar aluno');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput value={nome} onChangeText={setNome} style={styles.input} />
      <Text style={styles.label}>Matrícula</Text>
      <TextInput value={matricula} onChangeText={setMatricula} style={styles.input} />
      <Text style={styles.label}>Curso</Text>
      <TextInput value={curso} onChangeText={setCurso} style={styles.input} />
      <Button title="Salvar" onPress={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { marginTop: 10, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 6 },
});
