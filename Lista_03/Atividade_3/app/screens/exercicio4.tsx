import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, FlatList, Alert } from "react-native"
import { useState } from "react";

interface Contact {
    id: string;
    name: string;
    phone: string;
}

export default function Exercicio4(){
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Dados simulados de contatos
    const allContacts: Contact[] = [
        { id: '1', name: 'Camila Silva', phone: '(11) 99999-9111' },
        { id: '2', name: 'Ana Guedes', phone: '(11) 88888-2282' },
        { id: '3', name: 'Carla Ferreira', phone: '(11) 77777-3335' },
        { id: '4', name: 'Bruno Santos', phone: '(11) 66666-4449' },
        { id: '5', name: 'Carol Ferreira', phone: '(11) 55555-5545' },
        { id: '6', name: 'Diego Alameda', phone: '(11) 44444-6633' },
        { id: '7', name: 'Cristina Souza', phone: '(11) 33333-7754' },
        { id: '8', name: 'Eduardo Deivid', phone: '(11) 22222-8859' },
        { id: '9', name: 'Fernando Pereira', phone: '(11) 11111-9996' }
    ];
    
    const getContacts = () => {
        setLoading(true);
        
        // delay de carregamento
        setTimeout(() => {
            // Aplica a filtragem conforme  if (data.length > 0) { setContacts(data); }
            const data = allContacts.filter(contact => 
                contact.name.toLowerCase().startsWith('c')
            );
            
            if (data.length > 0) {
                setContacts(data);
                Alert.alert("Sucesso", `Encontrados ${data.length} contatos que começam com "C"`);
            } else {
                Alert.alert("Aviso", "Nenhum contato encontrado que comece com a letra C");
            }
            
            setLoading(false);
        }, 1000);
    };
    
    const renderContact = ({ item }: { item: Contact }) => (
        <View style={styles.contactItem}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactPhone}>📞 {item.phone}</Text>
        </View>
    );
    
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Exercício 4</Text>
                <Text style={styles.subtitle}>Contatos que começam com "C"</Text>
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={getContacts}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Carregando..." : "📋 Listar Contatos"}
                    </Text>
                </TouchableOpacity>
                
                {contacts.length > 0 && (
                    <View style={styles.listContainer}>
                        <Text style={styles.resultText}>
                            Encontrados {contacts.length} contato(s):
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
        marginBottom: 30,
        textAlign: "center"
    },
    button: {
        backgroundColor: "#2196F3",
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
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5
    },
    contactPhone: {
        fontSize: 14,
        color: "#666"
    }
})
