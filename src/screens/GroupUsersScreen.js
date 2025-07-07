import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  StyleSheet
} from "react-native";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import styles from "../styles/globalScreen";
import { AlertNotificationRoot } from "react-native-alert-notification";
import colors from "../colors";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const GroupUsersScreen = () => {
  // 2. Criar um estado para armazenar o texto traduzido
  const [title, setTitle] = useState("Group Users Screen");

  // 3. useEffect para buscar a tradução
  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const result = await translate("Group Users Screen", "en");
        setTitle(result);
      } catch (error) {
        console.error("Falha ao buscar tradução:", error);
      }
    };
    fetchTranslation();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <AlertNotificationRoot>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardAvoidingView}
            >
              <View style={styles.container}>
                {/* 4. Usar o estado com o texto traduzido */}
                <Text style={styles.link}>{title}</Text>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </AlertNotificationRoot>
      </SafeAreaView>
    </PaperProvider>
  );
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
  },
};

// Adicionei um estilo para o KeyboardAvoidingView para garantir o comportamento correto
const combinedStyles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Centraliza o conteúdo
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
});


export default GroupUsersScreen;