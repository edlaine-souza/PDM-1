import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

// Telas
import Um from "./screens/Um";
import Dois from "./screens/Dois";
import Tres from "./screens/Tres";
import Quatro from "./screens/Quatro";
import Cinco from "./screens/Cinco";
import Seis from "./screens/Seis";
import Sete from "./screens/Sete";
import Oito from "./screens/Oito";
import Nove from "./screens/Nove";
import Dez from "./screens/Dez";

import { RootStackParamList } from "./types";

const Drawer = createDrawerNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Um"
        screenOptions={({ route }) => ({
          drawerIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case "Um":
                iconName = "home-outline";
                break;
              case "Dois":
                iconName = "list-outline";
                break;
              case "Tres":
                iconName = "book-outline";
                break;
              case "Quatro":
                iconName = "clipboard-outline";
                break;
              case "Cinco":
                iconName = "star-outline";
                break;
              case "Seis":
                iconName = "settings-outline";
                break;
              case "Sete":
                iconName = "person-outline";
                break;
              case "Oito":
                iconName = "alarm-outline";
                break;
              case "Nove":
                iconName = "map-outline";
                break;
              case "Dez":
                iconName = "information-circle-outline";
                break;
              default:
                iconName = "alert-circle-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Drawer.Screen name="Um" component={Um} options={{ title: "Exercício Um" }} />
        <Drawer.Screen name="Dois" component={Dois} options={{ title: "Exercício Dois" }} />
        <Drawer.Screen name="Tres" component={Tres} options={{ title: "Exercício Três" }} />
        <Drawer.Screen name="Quatro" component={Quatro} options={{ title: "Exercício Quatro" }} />
        <Drawer.Screen name="Cinco" component={Cinco} options={{ title: "ExercícioCinco" }} />
        <Drawer.Screen name="Seis" component={Seis} options={{ title: "Exercício Seis" }} />
        <Drawer.Screen name="Sete" component={Sete} options={{ title: "Exercício Sete" }} />
        <Drawer.Screen name="Oito" component={Oito} options={{ title: "Exercício Oito" }} />
        <Drawer.Screen name="Nove" component={Nove} options={{ title: "Exercício Nove" }} />
        <Drawer.Screen name="Dez" component={Dez} options={{ title: "Exercício Dez" }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;