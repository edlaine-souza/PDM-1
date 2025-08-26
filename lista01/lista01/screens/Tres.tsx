import React, { JSX } from 'react';
import { View, StyleSheet, StatusBar, ViewStyle } from 'react-native';

export default function Tres(): JSX.Element {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      /* Parte superior - crimson dividida em row */
      <View style={[styles.topPanel, { backgroundColor: 'crimson' }]}>
        
        /* Primeira metade - lime (inteira) */
        <View style={[styles.halfPanel, { backgroundColor: 'lime' }]} />
        
        /* Segunda metade - aquamarine dividida em column */
        <View style={[styles.halfPanel, { backgroundColor: 'aquamarine' }]}>
          <View style={[styles.quarterPanel, { backgroundColor: 'teal' }]} />
          <View style={[styles.quarterPanel, { backgroundColor: 'skyblue' }]} />
        </View>
      </View>
      
      /* Parte inferior - salmon */
      <View style={[styles.panel, { backgroundColor: 'salmon' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  } as ViewStyle,
  topPanel: {
    flex: 0.5, 
    flexDirection: 'row', // divide horizontalmente
  } as ViewStyle,
  panel: {
    flex: 0.5, 
  } as ViewStyle,
  halfPanel: {
    flex: 0.5, //  parte superior
  } as ViewStyle,
  quarterPanel: {
    flex: 0.5, // 50% da metade (25% do total)
  } as ViewStyle,
});