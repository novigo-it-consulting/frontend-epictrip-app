import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

// Mantém apenas os códigos dos idiomas, que não mudam
const languageCodes = [
    { code: 'en', key: 'english' },
    { code: 'pt', key: 'portuguese' },
    { code: 'es', key: 'spanish' },
];

const LanguageSelectionScreen = () => {
    const { navigate } = useNavigation();

    // 2. Criar um estado para armazenar os textos traduzidos
    const [t, setT] = useState({
        selectLanguage: 'Select your language',
        english: 'English',
        portuguese: 'Português',
        spanish: 'Español',
    });

    // 3. useEffect para buscar as traduções
    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const [
                    selectLanguage, english, portuguese, spanish
                ] = await Promise.all([
                    translate("Select your language", "en"),
                    translate("English", "en"),
                    translate("Português", "en"),
                    translate("Español", "en"),
                ]);
                setT({ selectLanguage, english, portuguese, spanish });
            } catch (error) {
                console.error("Falha ao buscar traduções:", error);
            }
        };
        fetchTranslations();
    }, []);


    const onSelectLanguage = async (language) => {
        try {
            await AsyncStorage.setItem("language", language);
            navigate("Login");
        } catch (error) {
            console.error("Erro ao salvar o idioma:", error);
        }
    };

    // Mapeia os códigos para os nomes traduzidos
    const translatedLanguages = languageCodes.map(lang => ({
        ...lang,
        label: t[lang.key]
    }));

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* 4. Usar os textos traduzidos */}
            <Text style={styles.title}>{t.selectLanguage}</Text>
            <FlatList
                data={translatedLanguages}
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