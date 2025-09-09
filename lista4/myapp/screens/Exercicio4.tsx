import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Dimensions } from "react-native";

export default function Exercicio4(){
    const [orientation, setOrientation] = useState('portrait');

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

    // Estilos para modo Portrait (cores laranjas/vermelhas)
    const portraitStyles = StyleSheet.create({
        header: {
            backgroundColor: '#FFB366', // Laranja claro
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 20,
        },
        middleSection: {
            flex: 1,
            backgroundColor: '#FF8A8A', // Rosa/salmão
            alignItems: 'center',
            justifyContent: 'center',
        },
        bottomSection: {
            flex: 1,
            backgroundColor: '#FF6B47', // Laranja escuro/vermelho
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    // Estilos para modo Landscape (cores amarelas/douradas)
    const landscapeStyles = StyleSheet.create({
        header: {
            backgroundColor: '#F5F5DC', // Bege claro
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 20,
        },
        middleSection: {
            flex: 1,
            backgroundColor: '#F0E68C', // Amarelo claro
            alignItems: 'center',
            justifyContent: 'center',
        },
        bottomSection: {
            flex: 1,
            backgroundColor: '#DAA520', // Dourado
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    // Seleciona o conjunto de estilos baseado na orientação
    const currentStyles = orientation === 'portrait' ? portraitStyles : landscapeStyles;

    return(
        <SafeAreaView style={styles.container}>
            {/* Cabeçalho fixo */}
            <View style={currentStyles.header}>
                <Text style={styles.headerText}>Exercício 4</Text>
            </View>
            
            {/* Conteúdo principal com flexDirection dinâmica */}
            <View style={[styles.content, { flexDirection: getFlexDirection() }]}>
                <View style={currentStyles.middleSection}>
                    <Text style={styles.text}>Middle</Text>
                </View>
                <View style={currentStyles.bottomSection}>
                    <Text style={styles.text}>Bottom</Text>
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
        fontSize: 20,
    },
    text: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
