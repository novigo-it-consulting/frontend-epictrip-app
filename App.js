import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Navigation from "./src/routes/Navigation";
import colors from "./src/colors";
import { I18nextProvider } from "react-i18next";
import i18n from "./src/locales/index";
import { AlertNotificationRoot } from "react-native-alert-notification";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
  },
};

const defaultToastConfig = {
  autoClose: 5000, // ou um booleano conforme necessário
  titleStyle: { fontSize: 16, fontWeight: "bold" },
  textBodyStyle: { fontSize: 54 },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <AlertNotificationRoot>
          <AlertNotificationRoot toastConfig={defaultToastConfig}>
            <Navigation />
          </AlertNotificationRoot>
        </AlertNotificationRoot>
      </I18nextProvider>
    </PaperProvider>
  );
};

export default App;
