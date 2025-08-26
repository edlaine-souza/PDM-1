import React, { JSX } from 'react';
import { View, StyleSheet, StatusBar, ViewStyle } from 'react-native';

export default function Dois(): JSX.Element {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={[styles.topPanel, { backgroundColor: 'crimson' }]}>
        <View style={[styles.subPanel, { backgroundColor: 'lime' }]} />
        <View style={[styles.subPanel, { backgroundColor: 'aquamarine' }]} />
      </View>
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
    flexDirection: 'row',
  } as ViewStyle,
  panel: {
    flex: 0.5,
  } as ViewStyle,
  subPanel: {
    flex: 0.5,
  } as ViewStyle,
});