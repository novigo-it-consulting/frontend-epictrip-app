import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { AlertNotificationRoot } from "react-native-alert-notification";
import ExploreCategories from "../components/ExploreCategories";
import PopularEvents from "../components/PopularEvents";
import ProfileAccount from "../components/ProfileAccount";
import FooterNavBar from "../components/FooterNavBar";
import colors from "../colors";

const HomeScreen = () => {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        {/* <AlertNotificationRoot> */}
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* <ProfileAccount /> */}
          <ExploreCategories />
          {/* <PopularEvents /> */}
        </ScrollView>
        {/* <FooterNavBar /> */}
        {/* </AlertNotificationRoot> */}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backGroundLight,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: colors.backGroundLight,
  },
});

export default HomeScreen;
