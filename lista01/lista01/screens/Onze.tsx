import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from 'react-native';

const fatecImage = require('../assets/fatec_jacarei.png');

interface Exercise {
  id: number;
  nome: string;
  component: string;
}

const Home: React.FC = () => {
  const exerciciosEsquerda: Exercise[] = [
    { id: 1, nome: 'Um', component: 'Um' },
    { id: 2, nome: 'Dois', component: 'Dois' },
    { id: 3, nome: 'Tres', component: 'Tres' },
    { id: 4, nome: 'Quatro', component: 'Quatro' },
    { id: 5, nome: 'Cinco', component: 'Cinco' },
  ];

  const exerciciosDireita: Exercise[] = [
    { id: 6, nome: 'Seis', component: 'Seis' },
    { id: 7, nome: 'Sete', component: 'Sete' },
    { id: 8, nome: 'Oito', component: 'Oito' },
    { id: 9, nome: 'Nove', component: 'Nove' },
    { id: 10, nome: 'Dez', component: 'Dez' },
  ];

  const handleSelectExercise = (component: string): void => {
    console.log('Exercício selecionado:', component);
    
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <View style={styles.logoContainer}>
        <Image 
          source={fatecImage} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      
      <Text style={styles.titulo}>HOME</Text>

      
      <View style={styles.mainContainer}>
        
        <View style={styles.coluna}>
          {exerciciosEsquerda.map((exercicio) => (
            <TouchableOpacity
              key={exercicio.id}
              style={styles.botao}
              onPress={() => handleSelectExercise(exercicio.component)}
            >
              <Text style={styles.botaoTexto}>{exercicio.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>

       
        <View style={styles.coluna}>
          {exerciciosDireita.map((exercicio) => (
            <TouchableOpacity
              key={exercicio.id}
              style={styles.botao}
              onPress={() => handleSelectExercise(exercicio.component)}
            >
              <Text style={styles.botaoTexto}>{exercicio.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 50,
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 70,
  },
  logo: {
    width: 140,
    height: 140,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#B4B8B5',
    marginBottom: 30,
    textAlign: 'center',
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    gap: 20,
  },
  coluna: {
    flex: 1,
    gap: 15,
  },
  botao: {
    backgroundColor: 'yellow',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  botaoTexto: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Home;