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
  Modal,
  FlatList,
  TextInput as NativeTextInput,
  ActivityIndicator,
} from "react-native";
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Ionicons } from '@expo/vector-icons';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

import logo from "../../assets/logo.png";
import styles from "../styles/globalScreen.js";
import screenNumberStyles from "../styles/ScreenNumberStyles";
import colors from "../colors";
import { requestSignUpGuest } from "../services/api";

// Lista de idiomas agora contém apenas os que possuem arquivos de tradução
const AVAILABLE_LANGUAGES = [
  { code: 'en', nameKey: 'english', countryCode: 'US' },
  { code: 'de', nameKey: 'german', countryCode: 'DE' },
  { code: 'es', nameKey: 'spanish', countryCode: 'ES' },
  { code: 'fr', nameKey: 'french', countryCode: 'FR' },
  { code: 'it', nameKey: 'italian', countryCode: 'IT' },
  { code: 'pt-BR', nameKey: 'portuguese_brazil', countryCode: 'BR' },
  { code: 'ru', nameKey: 'russian', countryCode: 'RU' },
  { code: 'zh-Hans', nameKey: 'chinese_simplified', countryCode: 'CN' },
];

const getFlagEmoji = (countryCode) => {
  if (countryCode === 'EO') return '🌍';
  const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

const SignUpScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const initialLang = AVAILABLE_LANGUAGES.find(l => l.code === i18n.language) || AVAILABLE_LANGUAGES.find(l => l.code === 'en');
  const [selectedLanguage, setSelectedLanguage] = useState({
    ...initialLang,
    label: t(`signUpScreen.languages.${initialLang.nameKey}`)
  });

  const allLanguages = AVAILABLE_LANGUAGES.map(lang => ({
    ...lang,
    label: t(`signUpScreen.languages.${lang.nameKey}`)
  })).sort((a, b) => a.label.localeCompare(b.label));

  const [filteredLanguages, setFilteredLanguages] = useState(allLanguages);

  const schema = yup.object().shape({
    fullName: yup.string().required(t('signUpScreen.errorRequired')),
    email: yup.string().email(t('loginScreen.invalidEmailAdress')).required(t('signUpScreen.errorRequired')),
    shareNumber: yup.string().required(t('signUpScreen.errorRequired')),
    phone: yup.string().required(t('signUpScreen.errorRequired')),
    language: yup.string().required(),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      language: selectedLanguage.code
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await requestSignUpGuest(data);
      if (response.status === 201) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: t('signUpScreen.successTitle'),
          textBody: t('signUpScreen.successMessage'),
        });
        setTimeout(() => navigation.navigate("Login"), 2000);
      } else {
        throw new Error(response?.data?.message || t('signUpScreen.errorCreate'));
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('signUpScreen.errorTitle'),
        textBody: error.message || t('signUpScreen.errorCreate'),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => Toast.hide());
    return () => keyboardDidHideListener.remove();
  }, []);

  const handleGoToSignIn = () => navigation.navigate("Login");

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
    i18n.changeLanguage(lang.code);
    setIsModalVisible(false);
    setSearchQuery('');
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
                  <Text style={styles.textTitle}>{t('signUpScreen.title')}</Text>

                  <Controller name="fullName" control={control} render={({ field: { onChange, onBlur, value } }) => (<TextInput label={t('signUpScreen.nameLabel')} mode="flat" left={<TextInput.Icon icon="account-outline" />} onBlur={onBlur} onChangeText={onChange} value={value} autoCapitalize="words" style={styles.textEmail} error={!!errors.fullName} />)} />
                  {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

                  <Controller name="email" control={control} render={({ field: { onChange, onBlur, value } }) => (<TextInput label={t('signUpScreen.emailLabel')} mode="flat" left={<TextInput.Icon icon="at" />} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="email-address" autoCapitalize="none" style={styles.textEmail} error={!!errors.email} />)} />
                  {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                  <Controller name="shareNumber" control={control} render={({ field: { onChange, onBlur, value } }) => (<TextInput label={t('signUpScreen.shareNumberLabel')} mode="flat" left={<TextInput.Icon icon="account-group-outline" />} onBlur={onBlur} onChangeText={onChange} value={value} autoCapitalize="none" style={styles.textEmail} error={!!errors.shareNumber} />)} />
                  {errors.shareNumber && <Text style={styles.errorText}>{errors.shareNumber.message}</Text>}

                  <Controller name="phone" control={control} render={({ field: { onChange, onBlur, value } }) => (<TextInput label={t('signUpScreen.phoneLabel')} mode="flat" left={<TextInput.Icon icon="phone-outline" />} onBlur={onBlur} onChangeText={onChange} value={value} style={styles.textPassword} error={!!errors.phone} keyboardType="phone-pad" />)} />
                  {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

                  <Text style={styles.textLabel}>{t('signUpScreen.languageLabel')}</Text>
                  <TouchableOpacity style={combinedStyles.languageInput} onPress={() => setIsModalVisible(true)}>
                    <Text style={combinedStyles.languageInputFlag}>{getFlagEmoji(selectedLanguage.countryCode)}</Text>
                    <Text style={combinedStyles.languageInputText}>{selectedLanguage.label}</Text>
                    <Ionicons name="chevron-down" size={20} color="#6B7280" />
                  </TouchableOpacity>

                  <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button} disabled={loading}>
                    {loading ? <ActivityIndicator color={colors.white} /> : t('signUpScreen.signUpButton')}
                  </Button>
                  <Text style={styles.linkPrivacy}>
                    {t('signUpScreen.privacyPolicy')}
                    <Text style={styles.link} onPress={() => navigation.navigate("Terms")}>{t('signUpScreen.privacyPolicyLink')}</Text>
                    {t('signUpScreen.andOur')}
                    <Text style={styles.link} onPress={() => navigation.navigate("Terms")}>{t('signUpScreen.termsAndConditionsLink')}</Text>
                  </Text>
                </View>
              </ScrollView>

              <View style={styles.containerText}>
                <Text>{t('signUpScreen.alreadyHaveAccount')}</Text>
                <Button onPress={handleGoToSignIn} style={styles.link}>{t('signUpScreen.signIn')}</Button>
                <Text style={screenNumberStyles.numberStyle}>03</Text>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </AlertNotificationRoot>

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={combinedStyles.modalContainer}>
          <View style={combinedStyles.modalHeader}>
            <Text style={combinedStyles.modalTitle}>{t('signUpScreen.languageLabel')}</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Ionicons name="close" size={28} color="#111827" />
            </TouchableOpacity>
          </View>

          <View style={combinedStyles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={combinedStyles.searchIcon} />
            <NativeTextInput
              style={combinedStyles.searchInput}
              placeholder={t('languageSelectionScreen.searchPlaceholder')}
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

const combinedStyles = StyleSheet.create({
  keyboardAvoidingView: { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', width: '85%', marginLeft: 'auto', marginRight: 'auto' },
  languageInput: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 58, backgroundColor: 'rgba(230, 230, 230, 0.5)', borderRadius: 4, borderBottomWidth: 1, borderBottomColor: '#6B7280', paddingHorizontal: 14, marginTop: 10, marginBottom: 20 },
  languageInputText: { flex: 1, fontSize: 16, color: '#1F2937' },
  languageInputFlag: { fontSize: 24, marginRight: 12 },
  modalContainer: { flex: 1, backgroundColor: '#F8F9FC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, margin: 20, paddingHorizontal: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 50, fontSize: 16, color: '#111827', backgroundColor: 'transparent' },
  languageRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  flagEmoji: { fontSize: 24, marginRight: 15 },
  languageLabel: { fontSize: 18, color: '#1F2937' },
});

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: colors.primary } };

export default SignUpScreen;
