import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Navigation from "./src/routes/Navigation";
import colors from "./src/colors";
import { I18nextProvider } from "react-i18next";
import i18n from "./src/locales/index"; // Importa a instância do i18n que você configurou

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
  },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <Navigation />
      </I18nextProvider>
    </PaperProvider>
  );
};

export default App;
