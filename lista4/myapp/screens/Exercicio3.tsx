import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Dimensions } from "react-native";

export default function Exercicio3(){
    const [orientation, setOrientation] = useState('portrait');

    useEffect(() => {
        const updateOrientation = () => {
            const { width, height } = Dimensions.get('window');
            setOrientation(width > height ? 'landscape' : 'portrait');
        };

        // orientação inicial
        updateOrientation();

        // mudanças de orientação
        const subscription = Dimensions.addEventListener('change', updateOrientation);

        return () => subscription?.remove();
    }, []);

    // Determina a flexDirection baseada na orientação
    const getFlexDirection = () => {
        return orientation === 'portrait' ? 'column' : 'row';
    };

    // Estilos para modo Portrait 
    const portraitStyles = StyleSheet.create({
        topSection: {
            flex: 1,
            backgroundColor: '#FFB366', 
            alignItems: 'center',
            justifyContent: 'center',
        },
        middleSection: {
            flex: 1,
            backgroundColor: '#FF8A8A', 
            alignItems: 'center',
            justifyContent: 'center',
        },
        bottomSection: {
            flex: 1,
            backgroundColor: '#FF6B47', 
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    // Estilos para modo Landscape 
    const landscapeStyles = StyleSheet.create({
        topSection: {
            flex: 1,
            backgroundColor: '#F5F5DC', // Bege claro
            alignItems: 'center',
            justifyContent: 'center',
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

    // Seleciona o conjunto de estilos na orientação
    const currentStyles = orientation === 'portrait' ? portraitStyles : landscapeStyles;

    return(
        <SafeAreaView style={[styles.container, { flexDirection: getFlexDirection() }]}>
            <View style={currentStyles.topSection}>
                <Text style={styles.text}>Top</Text>
            </View>
            <View style={currentStyles.middleSection}>
                <Text style={styles.text}>Middle</Text>
            </View>
            <View style={currentStyles.bottomSection}>
                <Text style={styles.text}>Bottom</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
