import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useCep } from '../hooks/useCep';

const HistoricoScreen: React.FC = () => {
  const { historico } = useCep();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Histórico de Consultas</Text>
      
      <ScrollView style={styles.scrollView}>
        {historico.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma consulta realizada</Text>
        ) : (
          historico.map((item, index) => (
            <View key={index} style={styles.historicoItem}>
              <Text style={styles.cepText}>CEP: {item.cep}</Text>
              <Text>{item.logradouro}</Text>
              <Text>{item.bairro} - {item.localidade}/{item.uf}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  scrollView: {
    flex: 1,
  },
  historicoItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  cepText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
});

export default HistoricoScreen;