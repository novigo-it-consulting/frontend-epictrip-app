import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { AlertNotificationRoot } from "react-native-alert-notification";
import ExploreCategories from "../components/ExploreCategories";
import PopularEvents from "../components/PopularEvents";
import ProfileAccount from "../components/ProfileAccount";
import colors from "../colors";
import CustomTabBar from "../components/CustomBar";
import PullToRefreshWrapper from "../components/PullToRefreshWrapper";

const HomeScreen = () => {
  const handleRefresh = async () => {
    console.log("Refreshing data...");
  };
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        <AlertNotificationRoot>
          <PullToRefreshWrapper onRefresh={handleRefresh} contentContainerStyle={styles.scrollView}>
            <ProfileAccount />
            <ExploreCategories />
            <PopularEvents />
          </PullToRefreshWrapper>
          <CustomTabBar />
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backGroundLight,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: colors.backGroundLight,
  },
  styleFilter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "90%",
  },
});

export default HomeScreen;
