import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Dimensions } from "react-native";

export default function Exercicio2(){
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

    return(
        <SafeAreaView style={[styles.container, { flexDirection: getFlexDirection() }]}>
            <View style={styles.topSection}>
                <Text style={styles.text}>Top</Text>
            </View>
            <View style={styles.middleSection}>
                <Text style={styles.text}>Middle</Text>
            </View>
            <View style={styles.bottomSection}>
                <Text style={styles.text}>Bottom</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topSection: {
        flex: 1,
        backgroundColor: '#FFB366', // Laranja claro
        alignItems: 'center',
        justifyContent: 'center',
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
    text: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 18,
    },
})