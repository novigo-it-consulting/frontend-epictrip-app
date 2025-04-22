import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const languages = [
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Português' },
    { code: 'es', label: 'Español' },
    // Adicione outros idiomas conforme necessário
];

const LanguageSelectionScreen = () => {
    const { navigate } = useNavigation();

    const onSelectLanguage = async (language) => {
        try {
            await AsyncStorage.setItem("language", language);
            navigate("Login");
            console.log(`Idioma selecionado: ${language}`);
        } catch (error) {
            console.error("Erro ao salvar o idioma:", error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Text style={styles.title}>Selecione seu idioma</Text>
            <FlatList
                data={languages}
                keyExtractor={(item) => item.code}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.languageButton}
                        activeOpacity={0.8}
                        onPress={() => onSelectLanguage(item.code)}
                    >
                        <Text style={styles.languageText}>{item.label}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 100,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 30,
    },
    listContainer: {
        paddingBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    languageButton: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        backgroundColor: '#4A90E2',
        borderRadius: 16,
        marginVertical: 8,
        width: '80%',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    languageText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

export default LanguageSelectionScreen;
