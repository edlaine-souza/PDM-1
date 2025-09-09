import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Linking, Alert } from "react-native"

export default function Exercicio2(){
    
    const abrirDiscador = async () => {
        const numeroTelefone = "11994889966"; // Número de exemplo
        const telUrl = `tel:${numeroTelefone}`;
        
        try {
            // Verifica se suporta chamadas telefônicas
            const supported = await Linking.canOpenURL(telUrl);
            
            if (supported) {
                // Abre a discagem com o número preenchido
                await Linking.openURL(telUrl);
                Alert.alert("Sucesso", "Abrindo interface de discagem!");
            } else {
                Alert.alert("Erro", "Este dispositivo não suporta chamadas telefônicas");
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o discador");
        }
    };
    
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Exercício 2</Text>
                <Text style={styles.subtitle}>Abrir interface de discagem</Text>
                <Text style={styles.phoneNumber}>📞 (11) 99488-9966</Text>
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={abrirDiscador}
                >
                    <Text style={styles.buttonText}>📱 Fazer Chamada</Text>
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
    phoneNumber: {
        fontSize: 20,
        fontWeight: "600",
        color: "#2E7D32",
        marginBottom: 30,
        letterSpacing: 1
    },
    button: {
        backgroundColor: "#2E7D32",
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