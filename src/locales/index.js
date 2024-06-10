import i18n from "i18next";
import { Platform, NativeModules } from "react-native";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Importar os arquivos de tradução
import ptBR from "./translations/pt_BR.json";
import enUS from "./translations/en_US.json";
import esES from "./translations/es_ES.json";

i18n
  .use(initReactI18next) // Use initReactI18next
  .init({
    lng:
      Platform.OS === "ios"
        ? NativeModules.SettingsManager.settings.AppleLocale // Adquire o idioma no dispositivo iOS
        : NativeModules.I18nManager.localeIdentifier, // Idioma padrão
    fallbackLng: "pt_BR", // Se a tradução não estiver disponível para o idioma atual, fallback para este idioma
    resources: {
      en: {
        translation: enUS,
      },
      pt: {
        translation: ptBR,
      },
      es: {
        translation: esES,
      },
    },
    interpolation: {
      escapeValue: false, // Não escapar strings traduzidas
    },
  });

AsyncStorage.getItem("language").then((language) => {
  if (language) {
    i18n.changeLanguage(language);
  }
});

export default i18n;
