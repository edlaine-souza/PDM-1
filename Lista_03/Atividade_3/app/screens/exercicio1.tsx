import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native"

export default function Exercicio1(){
    
    const abrirYouTube = async () => {
        const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // URL de exemplo (Rick Roll)
        
        try {
            // Verifica se o dispositivo consegue abrir a URL
            const supported = await Linking.canOpenURL(youtubeUrl);
            
            if (supported) {
                // Abre o YouTube
                await Linking.openURL(youtubeUrl);
            } else {
                Alert.alert("Erro", "Não é possível abrir o YouTube neste dispositivo");
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o YouTube");
        }
    };

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Exercício 1</Text>
                <Text style={styles.subtitle}>Abrir vídeo do YouTube</Text>
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={abrirYouTube}
                >
                    <Text style={styles.buttonText}>Abrir YouTube</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5"
    },
    content: {
        alignItems: "center",
        padding: 20
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
        marginBottom: 30,
        textAlign: "center"
    },
    button: {
        backgroundColor: "#FF0000",
        paddingHorizontal: 30,
        paddingVertical: 15,
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
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center"
    }
})