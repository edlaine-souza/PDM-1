import React from 'react';
import { View, StyleSheet, StatusBar, Image, ImageStyle, ViewStyle } from 'react-native';
import logo from '../assets/splash-icon.png';

const Quatro: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      
      <View style={[styles.topPanel, { backgroundColor: 'crimson' }]}>
        <View style={[styles.subPanel, { backgroundColor: 'lime' }]}>
          <View style={[styles.innerPanel, { backgroundColor: 'teal' }]}>
            <Image 
              source={logo} 
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <View style={[styles.innerPanel, { backgroundColor: 'skyblue' }]}>
            <Image 
              source={logo} 
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={[styles.subPanel, { backgroundColor: 'aquamarine' }]}>
          <Image 
            source={logo} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
      
     
      <View style={[styles.panel, { backgroundColor: 'salmon' }]}>
        <Image 
          source={logo} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

// Definindo  para os estilos
interface Styles {
  container: ViewStyle;
  topPanel: ViewStyle;
  panel: ViewStyle;
  subPanel: ViewStyle;
  innerPanel: ViewStyle;
  image: ImageStyle;
}

const styles = StyleSheet.create<Styles>({
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  subPanel: {
    flex: 0.5,
    flexDirection: 'column',
  },
  innerPanel: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
});

export default Quatro;