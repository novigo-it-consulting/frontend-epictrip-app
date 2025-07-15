import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    StatusBar,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import colors from '../colors';

// Lista completa de idiomas com seus códigos e nomes em inglês (para tradução)
const ALL_LANGUAGES = [
    { code: 'ar', nameKey: 'arabic', countryCode: 'SA' },
    { code: 'az', nameKey: 'azerbaijani', countryCode: 'AZ' },
    { code: 'bg', nameKey: 'bulgarian', countryCode: 'BG' },
    { code: 'bn', nameKey: 'bengali', countryCode: 'BD' },
    { code: 'ca', nameKey: 'catalan', countryCode: 'ES-CT' },
    { code: 'cs', nameKey: 'czech', countryCode: 'CZ' },
    { code: 'da', nameKey: 'danish', countryCode: 'DK' },
    { code: 'de', nameKey: 'german', countryCode: 'DE' },
    { code: 'el', nameKey: 'greek', countryCode: 'GR' },
    { code: 'en', nameKey: 'english', countryCode: 'US' },
    { code: 'eo', nameKey: 'esperanto', countryCode: 'EO' },
    { code: 'es', nameKey: 'spanish', countryCode: 'ES' },
    { code: 'et', nameKey: 'estonian', countryCode: 'EE' },
    { code: 'eu', nameKey: 'basque', countryCode: 'ES-PV' },
    { code: 'fa', nameKey: 'persian', countryCode: 'IR' },
    { code: 'fi', nameKey: 'finnish', countryCode: 'FI' },
    { code: 'fr', nameKey: 'french', countryCode: 'FR' },
    { code: 'ga', nameKey: 'irish', countryCode: 'IE' },
    { code: 'gl', nameKey: 'galician', countryCode: 'ES-GA' },
    { code: 'he', nameKey: 'hebrew', countryCode: 'IL' },
    { code: 'hi', nameKey: 'hindi', countryCode: 'IN' },
    { code: 'hu', nameKey: 'hungarian', countryCode: 'HU' },
    { code: 'id', nameKey: 'indonesian', countryCode: 'ID' },
    { code: 'it', nameKey: 'italian', countryCode: 'IT' },
    { code: 'ja', nameKey: 'japanese', countryCode: 'JP' },
    { code: 'ko', nameKey: 'korean', countryCode: 'KR' },
    { code: 'ky', nameKey: 'kyrgyz', countryCode: 'KG' },
    { code: 'lt', nameKey: 'lithuanian', countryCode: 'LT' },
    { code: 'lv', nameKey: 'latvian', countryCode: 'LV' },
    { code: 'ms', nameKey: 'malay', countryCode: 'MY' },
    { code: 'nb', nameKey: 'norwegian', countryCode: 'NO' },
    { code: 'nl', nameKey: 'dutch', countryCode: 'NL' },
    { code: 'pl', nameKey: 'polish', countryCode: 'PL' },
    { code: 'pt', nameKey: 'portuguese', countryCode: 'PT' },
    { code: 'pt-BR', nameKey: 'portuguese_brazil', countryCode: 'BR' },
    { code: 'ro', nameKey: 'romanian', countryCode: 'RO' },
    { code: 'ru', nameKey: 'russian', countryCode: 'RU' },
    { code: 'sk', nameKey: 'slovak', countryCode: 'SK' },
    { code: 'sl', nameKey: 'slovenian', countryCode: 'SI' },
    { code: 'sq', nameKey: 'albanian', countryCode: 'AL' },
    { code: 'sv', nameKey: 'swedish', countryCode: 'SE' },
    { code: 'tl', nameKey: 'filipino', countryCode: 'PH' },
    { code: 'zh-Hans', nameKey: 'chinese_simplified', countryCode: 'CN' },
    { code: 'zh-Hant', nameKey: 'chinese_traditional', countryCode: 'TW' }
];

const getFlagEmoji = (countryCode) => {
    if (countryCode === 'EO') return '🌍';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

const LanguageSelectionScreen = () => {
    const { navigate } = useNavigation();
    const { t, i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLanguages, setFilteredLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const processedLanguages = ALL_LANGUAGES.map(lang => ({
            ...lang,
            label: t(`languageSelectionScreen.languages.${lang.nameKey}`)
        })).sort((a, b) => a.label.localeCompare(b.label)); // Ordena alfabeticamente

        setFilteredLanguages(processedLanguages);
        setIsLoading(false);
    }, [t]);

    const onSelectLanguage = async (language) => {
        try {
            setSelectedLanguage(language.code);
            await AsyncStorage.setItem("language", language.code);
            i18n.changeLanguage(language.code); // Muda o idioma globalmente
            setTimeout(() => {
                navigate("Login");
            }, 300);
        } catch (error) {
            console.error("Erro ao salvar o idioma:", error);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const lowercasedQuery = query.toLowerCase();
        const currentLanguages = ALL_LANGUAGES.map(lang => ({
            ...lang,
            label: t(`languageSelectionScreen.languages.${lang.nameKey}`)
        }));

        if (query) {
            const filtered = currentLanguages.filter((lang) =>
                lang.label.toLowerCase().includes(lowercasedQuery)
            );
            setFilteredLanguages(filtered);
        } else {
            setFilteredLanguages(currentLanguages.sort((a, b) => a.label.localeCompare(b.label)));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FC" />
            <Text style={styles.title}>{t('languageSelectionScreen.title')}</Text>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={t('languageSelectionScreen.searchPlaceholder')}
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
                            <Text style={[styles.languageText, selectedLanguage === item.code && styles.selectedText]}>{item.label}</Text>
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
        backgroundColor: 'transparent',
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
    selectedText: {
        color: '#FFFFFF',
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
