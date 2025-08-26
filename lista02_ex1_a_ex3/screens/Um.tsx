import React, { JSX } from 'react';
import { View, StyleSheet, StatusBar, ViewStyle, StyleProp } from 'react-native';

export default function Um(): JSX.Element {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={[styles.panel, { backgroundColor: 'crimson' }]} />
      <View style={[styles.panel, { backgroundColor: 'salmon' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  } as ViewStyle,
  panel: {
    flex: 0.5,
  } as ViewStyle,
});