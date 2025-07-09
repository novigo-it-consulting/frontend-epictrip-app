import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    TextInput,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { translate } from "../services/translations/translateServices";
import colors from '../colors'; // Supondo que você tenha um arquivo de cores

// Lista completa de idiomas com seus códigos e nomes em inglês (para tradução)
const ALL_LANGUAGES = [
    { code: 'ar', name: 'Arabic', countryCode: 'SA' },
    { code: 'az', name: 'Azerbaijani', countryCode: 'AZ' },
    { code: 'bg', name: 'Bulgarian', countryCode: 'BG' },
    { code: 'bn', name: 'Bengali', countryCode: 'BD' },
    { code: 'ca', name: 'Catalan', countryCode: 'ES-CT' },
    { code: 'cs', name: 'Czech', countryCode: 'CZ' },
    { code: 'da', name: 'Danish', countryCode: 'DK' },
    { code: 'de', name: 'German', countryCode: 'DE' },
    { code: 'el', name: 'Greek', countryCode: 'GR' },
    { code: 'en', name: 'English', countryCode: 'US' },
    { code: 'eo', name: 'Esperanto', countryCode: 'EO' },
    { code: 'es', name: 'Spanish', countryCode: 'ES' },
    { code: 'et', name: 'Estonian', countryCode: 'EE' },
    { code: 'eu', name: 'Basque', countryCode: 'ES-PV' },
    { code: 'fa', name: 'Persian', countryCode: 'IR' },
    { code: 'fi', name: 'Finnish', countryCode: 'FI' },
    { code: 'fr', name: 'French', countryCode: 'FR' },
    { code: 'ga', name: 'Irish', countryCode: 'IE' },
    { code: 'gl', name: 'Galician', countryCode: 'ES-GA' },
    { code: 'he', name: 'Hebrew', countryCode: 'IL' },
    { code: 'hi', name: 'Hindi', countryCode: 'IN' },
    { code: 'hu', name: 'Hungarian', countryCode: 'HU' },
    { code: 'id', name: 'Indonesian', countryCode: 'ID' },
    { code: 'it', name: 'Italian', countryCode: 'IT' },
    { code: 'ja', name: 'Japanese', countryCode: 'JP' },
    { code: 'ko', name: 'Korean', countryCode: 'KR' },
    { code: 'ky', name: 'Kyrgyz', countryCode: 'KG' },
    { code: 'lt', name: 'Lithuanian', countryCode: 'LT' },
    { code: 'lv', name: 'Latvian', countryCode: 'LV' },
    { code: 'ms', name: 'Malay', countryCode: 'MY' },
    { code: 'nb', name: 'Norwegian', countryCode: 'NO' },
    { code: 'nl', name: 'Dutch', countryCode: 'NL' },
    { code: 'pl', name: 'Polish', countryCode: 'PL' },
    { code: 'pt', name: 'Portuguese', countryCode: 'PT' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)', countryCode: 'BR' },
    { code: 'ro', name: 'Romanian', countryCode: 'RO' },
    { code: 'ru', name: 'Russian', countryCode: 'RU' },
    { code: 'sk', name: 'Slovak', countryCode: 'SK' },
    { code: 'sl', name: 'Slovenian', countryCode: 'SI' },
    { code: 'sq', name: 'Albanian', countryCode: 'AL' },
    { code: 'sv', name: 'Swedish', countryCode: 'SE' },
    { code: 'tl', name: 'Filipino', countryCode: 'PH' },
    { code: 'zh-Hans', name: 'Chinese (Simplified)', countryCode: 'CN' },
    { code: 'zh-Hant', name: 'Chinese (Traditional)', countryCode: 'TW' }
];


// Função para converter código de país em emoji de bandeira
const getFlagEmoji = (countryCode) => {
    if (countryCode === 'EO') return '🌍'; // Emoji para Esperanto
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

const LanguageSelectionScreen = () => {
    const { navigate } = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [languages, setLanguages] = useState([]);
    const [filteredLanguages, setFilteredLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [t, setT] = useState({
        title: 'Select your language',
        searchPlaceholder: 'Search for a language'
    });

    // Efeito para traduzir os textos estáticos e os nomes dos idiomas
    useEffect(() => {
        const fetchAndTranslate = async () => {
            try {
                // Traduz o título e o placeholder
                const [translatedTitle, translatedPlaceholder] = await Promise.all([
                    translate('Select your language', 'en'),
                    translate('Search for a language', 'en')
                ]);
                setT({ title: translatedTitle, searchPlaceholder: translatedPlaceholder });

                // Traduz o nome de cada idioma
                const translatedLangs = await Promise.all(
                    ALL_LANGUAGES.map(async (lang) => {
                        const translatedName = await translate(lang.name, 'en');
                        return { ...lang, label: translatedName };
                    })
                );

                setLanguages(translatedLangs);
                setFilteredLanguages(translatedLangs);

            } catch (error) {
                console.error("Falha ao buscar ou traduzir idiomas:", error);
                // Fallback para os nomes em inglês em caso de erro
                const fallbackLangs = ALL_LANGUAGES.map(lang => ({ ...lang, label: lang.name }));
                setLanguages(fallbackLangs);
                setFilteredLanguages(fallbackLangs);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAndTranslate();
    }, []);

    const onSelectLanguage = async (language) => {
        try {
            setSelectedLanguage(language.code);
            await AsyncStorage.setItem("language", language.code);
            // Adiciona um pequeno delay para o feedback visual antes de navegar
            setTimeout(() => {
                navigate("Login");
            }, 300);
        } catch (error) {
            console.error("Erro ao salvar o idioma:", error);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query) {
            const filtered = languages.filter((lang) =>
                lang.label.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredLanguages(filtered);
        } else {
            setFilteredLanguages(languages);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FC" />
            <Text style={styles.title}>{t.title}</Text>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholderTextColor="#9CA3AF"
                />
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
            ) : (
                <FlatList
                    data={filteredLanguages}
                    keyExtractor={(item) => item.code}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.languageButton, selectedLanguage === item.code && styles.selectedButton]}
                            activeOpacity={0.7}
                            onPress={() => onSelectLanguage(item)}
                        >
                            <Text style={styles.flagEmoji}>{getFlagEmoji(item.countryCode)}</Text>
                            <Text style={styles.languageText}>{item.label}</Text>
                            {selectedLanguage === item.code ? (
                                <Ionicons name="checkmark-circle" size={24} color="white" />
                            ) : (
                                <View style={styles.radioCircle} />
                            )}
                        </TouchableOpacity>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FC',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        marginVertical: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginHorizontal: 20,
        marginBottom: 20,
        paddingHorizontal: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#111827',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectedButton: {
        backgroundColor: colors.primary || '#0057FF',
        borderColor: colors.primary || '#0057FF',
    },
    flagEmoji: {
        fontSize: 24,
        marginRight: 15,
    },
    languageText: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    radioCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
    },
});

export default LanguageSelectionScreen;