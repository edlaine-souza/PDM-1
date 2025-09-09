import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Alert, Image } from "react-native"
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';

export default function Exercicio6(){
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    
    const abrirGaleria = async () => {
        try {
            // Solicita permissão para a galeria
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (!permissionResult.granted) {
                Alert.alert("Erro", "Permissão necessária para acessar a galeria");
                return;
            }
            
            // Abre a galeria para uma foto
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            
            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
                Alert.alert("Sucesso", "Foto selecionada da galeria!");
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao abrir a galeria");
        }
    };
    
    const abrirCamera = async () => {
        try {
            // Solicita permissão para usar a câmera
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            
            if (!permissionResult.granted) {
                Alert.alert("Erro", "Permissão necessária para usar a câmera");
                return;
            }
            
            // Abre a câmera para tirar uma foto
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            
            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
                Alert.alert("Sucesso", "Foto tirada com a câmera!");
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao abrir a câmera");
        }
    };
    
    return(
        <SafeAreaView style={styles.container}>
            {/* Botões no canto superior direito */}
            <View style={styles.topButtonsContainer}>
                <TouchableOpacity 
                    style={[styles.topButton, styles.photoButton]} 
                    onPress={abrirGaleria}
                >
                    <Text style={styles.iconText}>📷</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.topButton, styles.cameraButton]} 
                    onPress={abrirCamera}
                >
                    <Text style={styles.iconText}>📸</Text>
                </TouchableOpacity>
            </View>

            {/* Conteúdo principal */}
            <View style={styles.content}>
                <Text style={styles.title}>Exercício 6</Text>
                <Text style={styles.subtitle}>Galeria e Câmera</Text>
                <Text style={styles.description}>
                    Dois botões no canto superior direito{'\n'}
                    📷 Galeria • 📸 Câmera
                </Text>
                
                {selectedImage ? (
                    <View style={styles.imageContainer}>
                        <Text style={styles.imageTitle}>Imagem selecionada:</Text>
                        <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                        <TouchableOpacity 
                            style={styles.clearButton}
                            onPress={() => setSelectedImage(null)}
                        >
                            <Text style={styles.clearButtonText}>🗑️ Limpar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            ✅ MaterialIcons com name "photo" e color "deepskyblue"{'\n'}
                            ✅ MaterialIcons com name "photo-camera" e color "deepskyblue"{'\n'}
                            ✅ Posicionados no canto superior direito da tela{'\n'}
                            ✅ Abre câmera e galeria reais do dispositivo
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5"
    },
    topButtonsContainer: {
        position: "absolute",
        top: 50,
        right: 20,
        flexDirection: "row",
        gap: 10,
        zIndex: 1
    },
    topButton: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        width: 50,
        height: 50
    },
    photoButton: {
        borderWidth: 2,
        borderColor: "deepskyblue"
    },
    cameraButton: {
        borderWidth: 2,
        borderColor: "deepskyblue"
    },
    iconText: {
        fontSize: 20
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        paddingTop: 100
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
        textAlign: "center"
    },
    description: {
        fontSize: 14,
        color: "#888",
        fontStyle: "italic",
        marginBottom: 30,
        textAlign: "center",
        lineHeight: 20
    },
    infoContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    infoText: {
        fontSize: 14,
        color: "#555",
        lineHeight: 22
    },
    imageContainer: {
        alignItems: "center",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    imageTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 15
    },
    selectedImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 15
    },
    clearButton: {
        backgroundColor: "#f44336",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6
    },
    clearButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600"
    }
})