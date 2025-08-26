import React from 'react';
import { View, StyleSheet } from 'react-native';
//import Um from './screens/Um';
//import Dois from './screens/Dois';
//import Tres from './screens/Tres';
//import Quatro from './screens/Quatro';
//import Cinco from './screens/Cinco';
//import Seis from './screens/Seis';
//import Sete from './screens/Sete';
//import Oito from './screens/Oito';
//import Nove from './screens/Nove';
//import Dez from './screens/Dez';
import Onze from './screens/Onze';

//Botão ainda não esta funcional, para trocar as telas é preciso chamar no App cada um individualmnete.

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <Onze/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;