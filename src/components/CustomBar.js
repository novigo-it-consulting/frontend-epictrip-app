// CustomTabBar.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const CustomTabBar = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const tabs = [
    { name: "Home", icon: "home", route: "Home" },
    { name: "Groups", icon: "users", route: "GroupUsersScreen" },
    { name: "Requests", icon: "bell", route: "RequestsScreen" },
    { name: "Schedule", icon: "calendar", route: "ScheduleScreen" },
    { name: "Profile", icon: "user", route: "ProfileScreen" },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={styles.tab}
          onPress={() => navigation.navigate(tab.route)}
        >
          <Feather name={tab.icon} color="#696969" size={20} />
          <Text style={styles.tabLabel}>{t(`homeTabs.${tab.name.toLowerCase()}Button`)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 88,
    position: "absolute", 
    bottom: 10,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOffset: {
      height: -4,
      width: 1,
    },
    shadowColor: "#172B4D14",
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    color: "#696969",
  },
});

export default CustomTabBar;
