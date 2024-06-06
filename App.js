import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Navigation from "./src/routes/Navigation";
import colors from "./src/colors";
import { I18nextProvider } from "react-i18next";
import i18n from "./src/locales/index";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View, SafeAreaView } from "react-native";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
  },
};

const IOSStatusBar = ({ backgroundColor, barStyle, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        style={barStyle}
        {...props}
      />
    </SafeAreaView>
  </View>
);

const App = () => {
  const isIOS = Platform.OS === "ios";
  return (
    <PaperProvider theme={theme}>
      {isIOS && (
        <IOSStatusBar backgroundColor="#fff" barStyle="light-content" />
      )}
      <View style={styles.container}>
        <I18nextProvider i18n={i18n}>
          <Navigation />
        </I18nextProvider>
      </View>
    </PaperProvider>
  );
};

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === "ios" ? 44 : 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: "#fff",
    height: APPBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
