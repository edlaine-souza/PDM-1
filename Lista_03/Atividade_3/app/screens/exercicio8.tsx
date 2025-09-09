import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, Alert } from "react-native"
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';

interface ImageItem {
    uri: string;
    id: string;
}

export default function Exercicio8(){
    const [imageItems, setImageItems] = useState<ImageItem[]>([]);
    
    const adicionarImagemDaGaleria = async () => {
        try {
            // Solicita permissão para acessar a galeria
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (!permissionResult.granted) {
                Alert.alert("Erro", "Permissão necessária para acessar a galeria");
                return;
            }
            
            // Abre a galeria para selecionar uma foto
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            
            if (!result.canceled && result.assets[0]) {
                const newImage: ImageItem = {
                    uri: result.assets[0].uri,
                    id: Date.now().toString() + Math.random().toString()
                };
                setImageItems(prev => [...prev, newImage]);
                Alert.alert("Sucesso", "Imagem adicionada da galeria!");
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao abrir a galeria");
        }
    };
    
    const adicionarImagemDaCamera = async () => {
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
                const newImage: ImageItem = {
                    uri: result.assets[0].uri,
                    id: Date.now().toString() + Math.random().toString()
                };
                setImageItems(prev => [...prev, newImage]);
                Alert.alert("Sucesso", "Imagem adicionada da câmera!");
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao abrir a câmera");
        }
    };
    
    const limparTodasImagens = () => {
        setImageItems([]);
        Alert.alert("Limpo", "Todas as imagens foram removidas");
    };
    
    const removerImagem = (id: string) => {
        setImageItems(prev => prev.filter(item => item.id !== id));
        Alert.alert("Removido", "Imagem removida!");
    };
    
    const renderImage = (item: ImageItem, index: number) => (
        <View key={item.id} style={styles.imageContainer}>
            <Image 
                source={{ uri: item.uri }} 
                style={styles.image}
                onError={() => {
                    console.log(`Erro ao carregar imagem ${index + 1}`);
                }}
            />
            
            {/* Botão X no canto superior esquerdo */}
            <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => removerImagem(item.id)}
            >
                <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            <Text style={styles.imageLabel}>Imagem {index + 1}</Text>
        </View>
    );
    
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Exercício 8</Text>
                <Text style={styles.subtitle}>Remover imagens individualmente</Text>
                <Text style={styles.description}>
                    Botão ✕ no canto superior esquerdo de cada imagem
                </Text>
            </View>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={adicionarImagemDaGaleria}
                >
                    <Text style={styles.buttonText}>📷 Galeria</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.button, styles.cameraButton]} 
                    onPress={adicionarImagemDaCamera}
                >
                    <Text style={styles.buttonText}>📸 Câmera</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.button, styles.clearButton]} 
                    onPress={limparTodasImagens}
                >
                    <Text style={styles.buttonText}>🗑️ Limpar Todas</Text>
                </TouchableOpacity>
            </View>
            
            {imageItems.length > 0 && (
                <View style={styles.imagesSection}>
                    <Text style={styles.sectionTitle}>
                        📸 {imageItems.length} imagem(ns) - Clique no ✕ para remover
                    </Text>
                    
                    <ScrollView 
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {imageItems.map((item, index) => renderImage(item, index))}
                    </ScrollView>
                </View>
            )}
            
            {imageItems.length === 0 && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>
                        📷 Nenhuma imagem adicionada{'\n'}
                        Use os botões "Galeria" ou "Câmera" para adicionar imagens{'\n'}
                        Cada imagem terá um botão ✕ para remoção individual
                    </Text>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5"
    },
    header: {
        padding: 20,
        paddingTop: 40,
        alignItems: "center"
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
        marginBottom: 10,
        textAlign: "center"
    },
    description: {
        fontSize: 14,
        color: "#888",
        fontStyle: "italic",
        textAlign: "center"
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 10,
        marginBottom: 20,
        flexWrap: "wrap",
        gap: 10
    },
    button: {
        backgroundColor: "#2196F3",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    cameraButton: {
        backgroundColor: "#4CAF50"
    },
    clearButton: {
        backgroundColor: "#f44336"
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center"
    },
    imagesSection: {
        flex: 1,
        paddingHorizontal: 20
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 15,
        textAlign: "center"
    },
    scrollView: {
        flex: 1
    },
    scrollContent: {
        paddingBottom: 20
    },
    imageContainer: {
        backgroundColor: "white",
        marginBottom: 15,
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        alignItems: "center",
        position: "relative"
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 8,
        marginBottom: 8
    },
    closeButton: {
        position: "absolute",
        top: 15,
        left: 15,
        backgroundColor: "#f44336",
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1
    },
    closeButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    },
    imageLabel: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500"
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        lineHeight: 24
    }
})
