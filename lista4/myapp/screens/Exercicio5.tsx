import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Dimensions, TextInput, FlatList } from "react-native";

export default function Exercicio5(){
    const [orientation, setOrientation] = useState('portrait');
    const [inputText, setInputText] = useState('');
    const [nomes, setNomes] = useState([
        'Ffqghtvgh',
        'Brhrhrbrhtr',
        'Gfcv',
        'Hcfg',
        'Hgfy',
        'Ggfv',
        'Nhub',
        'Gfhqc',
        'Qhqp',
        'Hyfc',
        'Vqctv'
    ]);

    useEffect(() => {
        const updateOrientation = () => {
            const { width, height } = Dimensions.get('window');
            setOrientation(width > height ? 'landscape' : 'portrait');
        };

        // Verificar orientação inicial
        updateOrientation();

        // Listener para mudanças de orientação
        const subscription = Dimensions.addEventListener('change', updateOrientation);

        return () => subscription?.remove();
    }, []);

    // Determina a flexDirection baseada na orientação
    const getFlexDirection = () => {
        return orientation === 'portrait' ? 'column' : 'row';
    };

    // Função chamada quando pressionar OK/Enter no teclado
    const onSubmitEditing = () => {
        if (inputText.trim() !== '') {
            setNomes([...nomes, inputText.trim()]);
            setInputText('');
        }
    };

    // Estilos para modo Portrait (cores laranjas/vermelhas)
    const portraitStyles = StyleSheet.create({
        container: {
            backgroundColor: '#FF8A8A', // Rosa/salmão
        },
        header: {
            backgroundColor: '#FFB366', // Laranja claro
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 15,
        },
        inputContainer: {
            backgroundColor: '#FF8A8A',
            padding: 15,
        },
        listContainer: {
            backgroundColor: '#FF6B47', // Laranja escuro/vermelho
        },
    });

    // Estilos para modo Landscape (cores amarelas/douradas)
    const landscapeStyles = StyleSheet.create({
        container: {
            backgroundColor: '#F0E68C', // Amarelo claro
        },
        header: {
            backgroundColor: '#F5F5DC', // Bege claro
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 15,
        },
        inputContainer: {
            backgroundColor: '#F0E68C',
            padding: 15,
        },
        listContainer: {
            backgroundColor: '#DAA520', // Dourado
        },
    });

    // Seleciona o conjunto de estilos baseado na orientação
    const currentStyles = orientation === 'portrait' ? portraitStyles : landscapeStyles;

    const renderItem = ({ item }: { item: string }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
        </View>
    );

    return(
        <SafeAreaView style={[styles.container, currentStyles.container]}>
            {/* Cabeçalho */}
            <View style={currentStyles.header}>
                <Text style={styles.headerText}>Exercício 5</Text>
            </View>

            <View style={[styles.content, { flexDirection: getFlexDirection() }]}>
                {/* Seção do Input */}
                <View style={[
                    orientation === 'portrait' ? styles.inputSectionPortrait : styles.inputSectionLandscape, 
                    currentStyles.inputContainer
                ]}>
                    <Text style={styles.inputLabel}>Nome:</Text>
                    <TextInput
                        style={styles.textInput}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Nome completo"
                        onSubmitEditing={onSubmitEditing}
                        returnKeyType="done"
                    />
                </View>

                {/* Seção da Lista */}
                <View style={[styles.listSection, currentStyles.listContainer]}>
                    <FlatList
                        data={nomes}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    headerText: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 18,
    },
    inputSectionPortrait: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    inputSectionLandscape: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    inputLabel: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    listSection: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    itemContainer: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    itemText: {
        color: '#333',
        fontSize: 16,
    },
});
