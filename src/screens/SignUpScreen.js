import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal, // Importar Modal
  FlatList, // Importar FlatList
  TextInput as NativeTextInput, // Renomear para evitar conflito
} from "react-native";
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
  ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import logo from "../../assets/logo.png";
import { useForm, Controller } from "react-hook-form";
import styles from "../styles/globalScreen.js";
import screenNumberStyles from "../styles/ScreenNumberStyles";
import colors from "../colors";
import { requestSignUpGuest } from "../services/api";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { translate } from "../services/translations/translateServices";

// --- Dados e Funções de Idioma (Reutilizados da tela anterior) ---
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

const getFlagEmoji = (countryCode) => {
  if (countryCode === 'EO') return '🌍';
  const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};


const SignUpScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  // Estado para o modal de idiomas
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allLanguages, setAllLanguages] = useState([]);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: 'en',
    label: 'English',
    countryCode: 'US'
  });

  const [t, setT] = useState({
    signUp: "Sign Up",
    fullName: "Full Name",
    email: "E-mail",
    shareNumber: "Share Number",
    phone: "Phone",
    language: "Language",
    bySigningUp: "By signing up, you agree to our",
    privacyPolicy: " Privacy Policy ",
    andOur: "and our",
    terms: " Terms and Conditions ",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign In",
    errorCreatingAccount: "Error creating your account. Please try again later.",
    searchPlaceholder: "Search for a language"
  });

  useEffect(() => {
    const fetchAndTranslateData = async () => {
      // Traduz textos estáticos da UI
      const [signUp, fullName, email, ...rest] = await Promise.all([
        translate("Sign Up", "en"),
        translate("Full Name", "en"),
        translate("E-mail", "en"),
        // ... outras traduções estáticas
      ]);
      setT(prev => ({ ...prev, signUp, fullName, email, ...rest })); // Atualiza o estado t

      // Traduz a lista de idiomas
      const translatedLangs = await Promise.all(
        ALL_LANGUAGES.map(async (lang) => {
          const translatedName = await translate(lang.name, 'en');
          return { ...lang, label: translatedName };
        })
      );
      setAllLanguages(translatedLangs);
      setFilteredLanguages(translatedLangs);
    };

    fetchAndTranslateData();
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // Lógica de submit
  };

  useEffect(() => {
    setValue("language", selectedLanguage.code);
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => Toast.hide()
    );
    return () => {
      keyboardDidHideListener.remove();
    };
  }, [selectedLanguage]);

  const handleGoToSignIn = () => {
    navigation.navigate("Login");
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = allLanguages.filter((lang) =>
        lang.label.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLanguages(filtered);
    } else {
      setFilteredLanguages(allLanguages);
    }
  };

  const handleSelectLanguage = (lang) => {
    setSelectedLanguage(lang);
    setValue('language', lang.code);
    setIsModalVisible(false);
    setSearchQuery(''); // Limpa a busca
  };


  return (
    <PaperProvider theme={theme}>
      <AlertNotificationRoot>
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={combinedStyles.keyboardAvoidingView}
            >
              <View style={styles.containerBackButton}>
                <Image source={logo} style={styles.imageLogo} />
              </View>
              <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                <View style={styles.container}>
                  <Text style={styles.textTitle}>{t.signUp}</Text>

                  {/* Inputs do Formulário */}
                  <Controller name="fullName" control={control} rules={{ required: true }} render={({ field: { onChange, onBlur, value } }) => (<TextInput label={t.fullName} mode="flat" left={<TextInput.Icon icon="account-outline" />} onBlur={onBlur} onChangeText={onChange} value={value} autoCapitalize="words" style={styles.textEmail} error={!!errors.fullName} />)} />
                  <Controller name="email" control={control} rules={{ required: true }} render={({ field: { onChange, onBlur, value } }) => (<TextInput label={t.email} mode="flat" left={<TextInput.Icon icon="at" />} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="email-address" autoCapitalize="none" style={styles.textEmail} error={!!errors.email} />)} />
                  <Controller name="shareNumber" control={control} rules={{ required: true }} render={({ field: { onChange, onBlur, value } }) => (<TextInput label={t.shareNumber} mode="flat" left={<TextInput.Icon icon="account-group-outline" />} onBlur={onBlur} onChangeText={onChange} value={value} autoCapitalize="none" style={styles.textEmail} error={!!errors.shareNumber} />)} />
                  <Controller name="phone" control={control} rules={{ required: true }} render={({ field: { onChange, onBlur, value } }) => (<TextInput label={t.phone} mode="flat" left={<TextInput.Icon icon="phone-outline" />} onBlur={onBlur} onChangeText={onChange} value={value} style={styles.textPassword} error={!!errors.phone} keyboardType="phone-pad" />)} />

                  {/* Campo de Seleção de Idioma */}
                  <Text style={styles.textLabel}>{t.language}</Text>
                  <TouchableOpacity style={combinedStyles.languageInput} onPress={() => setIsModalVisible(true)}>
                    <Text style={combinedStyles.languageInputFlag}>{getFlagEmoji(selectedLanguage.countryCode)}</Text>
                    <Text style={combinedStyles.languageInputText}>{selectedLanguage.label}</Text>
                    <Ionicons name="chevron-down" size={20} color="#6B7280" />
                  </TouchableOpacity>

                  {/* Botão de Submit e Termos */}
                  <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button} disabled={loading}>
                    {loading ? <ActivityIndicator color={colors.white} /> : t.signUp}
                  </Button>
                  <Text style={styles.linkPrivacy}>
                    {t.bySigningUp}
                    <Text style={styles.link} onPress={() => navigation.navigate("Terms")}>{t.privacyPolicy}</Text>
                    {t.andOur}
                    <Text style={styles.link} onPress={() => navigation.navigate("Terms")}>{t.terms}</Text>
                  </Text>
                </View>
              </ScrollView>

              <View style={styles.containerText}>
                <Text>{t.alreadyHaveAccount}</Text>
                <Button onPress={handleGoToSignIn} style={styles.link}>{t.signIn}</Button>
                <Text style={screenNumberStyles.numberStyle}>03</Text>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </AlertNotificationRoot>

      {/* Modal de Seleção de Idioma */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={combinedStyles.modalContainer}>
          <View style={combinedStyles.modalHeader}>
            <Text style={combinedStyles.modalTitle}>{t.language}</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Ionicons name="close" size={28} color="#111827" />
            </TouchableOpacity>
          </View>

          <View style={combinedStyles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={combinedStyles.searchIcon} />
            <NativeTextInput
              style={combinedStyles.searchInput}
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <FlatList
            data={filteredLanguages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={combinedStyles.languageRow}
                onPress={() => handleSelectLanguage(item)}
              >
                <Text style={combinedStyles.flagEmoji}>{getFlagEmoji(item.countryCode)}</Text>
                <Text style={combinedStyles.languageLabel}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>

    </PaperProvider>
  );
};

// --- Estilos ---
const combinedStyles = StyleSheet.create({
  keyboardAvoidingView: { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', width: '85%', marginLeft: 'auto', marginRight: 'auto' },
  languageInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 58,
    backgroundColor: 'rgba(230, 230, 230, 0.5)',
    borderRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#6B7280',
    paddingHorizontal: 14,
    marginTop: 10,
    marginBottom: 20,
  },
  languageInputText: { flex: 1, fontSize: 16, color: '#1F2937' },
  languageInputFlag: { fontSize: 24, marginRight: 12 },
  // Estilos do Modal
  modalContainer: { flex: 1, backgroundColor: '#F8F9FC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, margin: 20, paddingHorizontal: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 50, fontSize: 16, color: '#111827' },
  languageRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  flagEmoji: { fontSize: 24, marginRight: 15 },
  languageLabel: { fontSize: 18, color: '#1F2937' },
});

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: colors.primary } };

export default SignUpScreen;