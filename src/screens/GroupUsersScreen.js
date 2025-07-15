import React from 'react';
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
import { AlertNotificationRoot } from "react-native-alert-notification";
import { useTranslation } from 'react-i18next';

import styles from "../styles/globalScreen";
import colors from "../colors";

const GroupUsersScreen = () => {
  const { t } = useTranslation();

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <AlertNotificationRoot>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={combinedStyles.keyboardAvoidingView}
            >
              <View style={styles.container}>
                <Text style={styles.link}>{t('groupUsersScreen.title')}</Text>
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

const combinedStyles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
});

export default GroupUsersScreen;
