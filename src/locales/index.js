import i18n from "i18next";
import { Platform, NativeModules } from "react-native";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Importar os arquivos de tradução
import ptBR from "./translations/pt_BR.json";
import enUS from "./translations/en_US.json";
import esES from "./translations/es_ES.json";

// Função para obter o idioma do dispositivo
const getDeviceLanguage = () => {
  let locale = "pt_BR"; // Idioma padrão

  if (Platform.OS === "ios") {
    const { SettingsManager } = NativeModules;
    const settings = SettingsManager?.settings;
    locale = settings?.AppleLocale || settings?.AppleLanguages[0] || locale;
  } else if (Platform.OS === "android") {
    const { I18nManager } = NativeModules;
    locale = I18nManager?.localeIdentifier || locale;
  }

  return locale.replace("_", "-"); // Substitui underscore por hífen
};

i18n
  .use(initReactI18next) // Integrar com React
  .init({
    lng: getDeviceLanguage(), // Define o idioma inicial
    fallbackLng: "pt-BR", // Idioma de fallback
    resources: {
      "en-US": {
        translation: enUS,
      },
      "pt-BR": {
        translation: ptBR,
      },
      "es-ES": {
        translation: esES,
      },
    },
    interpolation: {
      escapeValue: false, // Não escapar strings traduzidas
    },
  });

// Verifica se há um idioma salvo no AsyncStorage
AsyncStorage.getItem("language").then((language) => {
  if (language) {
    i18n.changeLanguage(language);
  }
});

export default i18n;
