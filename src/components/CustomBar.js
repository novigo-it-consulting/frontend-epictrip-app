import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomTabBar = ({ where }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: "Home", icon: "home", route: "Home" },
    { name: "Requests", icon: "bell", route: "RequestScreen" },
    { name: "Schedule", icon: "calendar", route: "ScheduleScreen" },
    { name: "Profile", icon: "user", route: "ProfileScreen" }
  ];

  const getTabBarHeight = () => {
    const baseHeight = 68;
    const extraHeight = where == "Profile" || where == "Product" || where == "Requests" ? 44 : 0;
    return baseHeight + extraHeight + insets.bottom;
  };

  const styles = StyleSheet.create({
    tabBar: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      height: getTabBarHeight(),
      paddingBottom: insets.bottom,
      paddingTop: 12,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#fff",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      shadowOffset: {
        height: -8,
        width: 4,
      },
      shadowColor: "#172B4D14",
      shadowRadius: 4,
      shadowOpacity: 1,
      elevation: 8,
    },
    tab: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      paddingVertical: 8,
    },
    tabLabel: {
      fontSize: 12,
      color: "#696969",
      marginTop: 4,
      textAlign: "center",
    },
    activeLabel: {
      color: "#007AFF",
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab, index) => {
        const isActive = route.name === tab.route;
        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.route)}
          >
            <Feather name={tab.icon} color={isActive ? "#007AFF" : "#696969"} size={24} />
            <Text style={[styles.tabLabel, isActive && styles.activeLabel]}>
              {t(`homeTabs.${tab.name.toLowerCase()}Button`)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;