import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, FlatList, Alert } from "react-native"
import { useState } from "react";

interface Contact {
    id: string;
    firstName: string;
    fullName: string;
    phone: string;
}

export default function Exercicio5(){
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Dados simulados de contatos com firstName
    const allContacts: Contact[] = [
        { id: '1', firstName: 'Camila', fullName: 'Camila Silva', phone: '(11) 99999-9111' },
        { id: '2', firstName: 'Ana', fullName: 'Ana Guedes', phone: '(11) 88888-2282' },
        { id: '3', firstName: 'Carla', fullName: 'Carla Ferreira', phone: '(11) 77777-3335' },
        { id: '4', firstName: 'Bruno', fullName: 'Bruno Santos', phone: '(11) 66666-4449' },
        { id: '5', firstName: 'Carol', fullName: 'Carol Ferreira', phone: '(11) 55555-5545' },
        { id: '6', firstName: 'Diego', fullName: 'Diego Alameda', phone: '(11) 44444-6633' },
        { id: '7', firstName: 'Cristina', fullName: 'Cristina Souza', phone: '(11) 33333-7754' },
        { id: '8', firstName: 'Eduardo', fullName: 'Eduardo Deivid', phone: '(11) 22222-8859' },
        { id: '9', firstName: 'Fernando', fullName: 'Fernando Pereira', phone: '(11) 11111-9996' }
        
    ];
    
    const getContacts = () => {
        setLoading(true);
        
        // Simula uso de Contacts.getContactsAsync com Contacts.Fields.FirstName
        setTimeout(() => {
            // Usa a propriedade Contacts.Fields.FirstName como mencionado no exercício
            const data = allContacts;
            
            setContacts(data);
            Alert.alert("Sucesso", `Carregados ${data.length} contatos (somente primeiro nome)`);
            
            setLoading(false);
        }, 1000);
    };
    
    const renderContact = ({ item }: { item: Contact }) => (
        <View style={styles.contactItem}>
            <Text style={styles.contactName}>👤 {item.firstName}</Text>
            <Text style={styles.fullName}>Nome completo: {item.fullName}</Text>
            <Text style={styles.contactPhone}>📞 {item.phone}</Text>
        </View>
    );
    
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Exercício 5</Text>
                <Text style={styles.subtitle}>Listar somente o primeiro nome</Text>
                <Text style={styles.description}>
                    Usando Contacts.Fields.FirstName
                </Text>
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={getContacts}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Carregando..." : "👤 Listar Primeiros Nomes"}
                    </Text>
                </TouchableOpacity>
                
                {contacts.length > 0 && (
                    <View style={styles.listContainer}>
                        <Text style={styles.resultText}>
                            {contacts.length} contato(s) carregados:
                        </Text>
                        <FlatList
                            data={contacts}
                            keyExtractor={(item) => item.id}
                            renderItem={renderContact}
                            style={styles.list}
                            showsVerticalScrollIndicator={false}
                        />
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
    content: {
        flex: 1,
        alignItems: "center",
        padding: 20
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        marginTop: 20
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
        marginBottom: 30,
        textAlign: "center"
    },
    button: {
        backgroundColor: "#9C27B0",
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
        marginBottom: 20
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center"
    },
    listContainer: {
        flex: 1,
        width: "100%"
    },
    resultText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 15,
        fontWeight: "600"
    },
    list: {
        flex: 1
    },
    contactItem: {
        backgroundColor: "white",
        padding: 15,
        marginVertical: 5,
        borderRadius: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    contactName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#9C27B0",
        marginBottom: 5
    },
    fullName: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
        fontStyle: "italic"
    },
    contactPhone: {
        fontSize: 14,
        color: "#666"
    }
})