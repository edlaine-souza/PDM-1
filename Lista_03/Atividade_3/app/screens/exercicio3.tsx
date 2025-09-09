import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Linking, Alert } from "react-native"

export default function Exercicio3(){
    
    const abrirInstagram = async () => {
        const instagramUrl = "https://www.instagram.com/fatec_jacarei";
        const instagramAppUrl = "instagram://user?username=fatec_jacarei";
        
        try {
            // Primeiro tenta abrir no aplicativo do Instagram
            const appSupported = await Linking.canOpenURL(instagramAppUrl);
            
            if (appSupported) {
                // Abre no aplicativo do Instagram
                await Linking.openURL(instagramAppUrl);
                Alert.alert("Sucesso", "Abrindo no aplicativo do Instagram!");
            } else {
                // Se não conseguir abrir no app, tenta no navegador
                const webSupported = await Linking.canOpenURL(instagramUrl);
                
                if (webSupported) {
                    await Linking.openURL(instagramUrl);
                    Alert.alert("Aviso", "Aplicativo do Instagram não encontrado. Abrindo no navegador.");
                } else {
                    Alert.alert("Erro", "Não é possível abrir o Instagram neste dispositivo");
                }
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o Instagram");
        }
    };
    
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Exercício 3</Text>
                <Text style={styles.subtitle}>Abrir Instagram da Fatec Jacareí</Text>
                <Text style={styles.username}>📷 @fatec_jacarei</Text>
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={abrirInstagram}
                >
                    <Text style={styles.buttonText}>📱 Abrir Instagram</Text>
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
        marginBottom: 20,
        textAlign: "center"
    },
    username: {
        fontSize: 20,
        fontWeight: "600",
        color: "#E4405F",
        marginBottom: 30,
        letterSpacing: 1
    },
    button: {
        backgroundColor: "#E4405F",
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
