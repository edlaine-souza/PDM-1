import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function Exercicio1() {
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    // Verificar orientação inicial
    updateOrientation();

    // Listener para mudanças de orientação
    const subscription = Dimensions.addEventListener('change', updateOrientation);

    // Permitir todas as orientações
    ScreenOrientation.unlockAsync();

    return () => {
      subscription?.remove();
    };
  }, []);

  const getBackgroundColor = () => {
    return orientation === 'portrait' ? '#FFA500' : '#1E90FF';
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.text}>
        Tela em modo {orientation === 'portrait' ? 'portrait' : 'landscape'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
