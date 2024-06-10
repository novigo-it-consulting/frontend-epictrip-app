import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Navigation from "./src/routes/Navigation";
import colors from "./src/colors";
import { I18nextProvider } from "react-i18next";
import i18n from "./src/locales/index";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { StatusBar } from "react-native";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
  },
};

const defaultToastConfig = {
  autoClose: 3000,
  titleStyle: { fontSize: 16, fontWeight: "bold" },
};

const lightColors = {
  label: "#000",
  card: "#fcfcfc",
  overlay: "#f0f0f0",
  success: "#28a745",
  danger: "rgba(255, 0, 0, 1)",
  warning: "#ffc107",
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <StatusBar backgroundColor={"#000"} />
      <I18nextProvider i18n={i18n}>
        <AlertNotificationRoot
          toastConfig={defaultToastConfig}
          colors={[lightColors]}
          theme={"light"}
        >
          <Navigation />
        </AlertNotificationRoot>
      </I18nextProvider>
    </PaperProvider>
  );
};

export default App;
