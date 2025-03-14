import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
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
            <Text style={styles.title}>Selecione seu idioma</Text>
            <FlatList
                data={languages}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.languageButton}
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    languageButton: {
        padding: 15,
        backgroundColor: '#007bff',
        borderRadius: 5,
        marginVertical: 5,
        width: '80%',
        alignItems: 'center',
    },
    languageText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default LanguageSelectionScreen;
