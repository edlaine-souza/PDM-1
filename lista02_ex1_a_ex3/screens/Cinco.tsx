import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableOpacity, Alert } from 'react-native';
import logo from '../assets/splash-icon.png';

const Cinco: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      
      <View style={[styles.topPanel, { backgroundColor: 'crimson' }]}>
        <View style={[styles.subPanel, { backgroundColor: 'lime' }]}>
          <View style={[styles.innerPanel, { backgroundColor: 'teal', justifyContent: 'center', alignItems: 'center' }]}>
            <TouchableOpacity onPress={() => Alert.alert('Mensagem', 'Boa noite!')} style={styles.touchable}>
              <Image source={logo} style={styles.image} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          <View style={[styles.innerPanel, { backgroundColor: 'skyblue', justifyContent: 'center', alignItems: 'center' }]}>
            <TouchableOpacity onPress={() => Alert.alert('Mensagem', 'Boa noite!')} style={styles.touchable}>
              <Image source={logo} style={styles.image} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.subPanel, { backgroundColor: 'aquamarine', justifyContent: 'center', alignItems: 'center' }]}>
          <TouchableOpacity onPress={() => Alert.alert('Mensagem', 'Boa noite!')} style={styles.touchable}>
            <Image source={logo} style={styles.image} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>
      
      
      <View style={[styles.panel, { backgroundColor: 'salmon', justifyContent: 'center', alignItems: 'center' }]}>
        <TouchableOpacity onPress={() => Alert.alert('Mensagem', 'Boa noite!')} style={styles.touchable}>
          <Image source={logo} style={styles.image} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  topPanel: {
    flex: 0.5,
    flexDirection: 'row',
  },
  panel: {
    flex: 0.5,
  },
  subPanel: {
    flex: 0.5,
    flexDirection: 'column',
  },
  innerPanel: {
    flex: 0.5,
  },
  touchable: {
    // Garante que o TouchableOpacity seja clicável
  },
  image: {
    width: 250,
    height: 250,
  },
});

export default Cinco;