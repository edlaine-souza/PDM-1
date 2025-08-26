import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CepProvider } from './src/contexts/CepContext';

import HistoricoScreen from './src/screens/HistoricoScreen';
import { RootStackParamList } from './src/types';
import ConsultaCepScreen from './src/screens/ConsultarCepScreen';

const Drawer = createDrawerNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <CepProvider>
      <NavigationContainer>
        <Drawer.Navigator 
          initialRouteName="ConsultaCep"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            drawerStyle: {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          <Drawer.Screen
            name="ConsultaCep"
            component={ConsultaCepScreen}
            options={{ 
              title: 'Consulta de CEP',
              drawerLabel: 'Consulta CEP'
            }}
          />
          <Drawer.Screen
            name="Historico"
            component={HistoricoScreen}
            options={{ 
              title: 'Histórico',
              drawerLabel: 'Histórico de Consultas'
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </CepProvider>
  );
};

export default App;