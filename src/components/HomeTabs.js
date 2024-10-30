// HomeTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Entypo from '@expo/vector-icons/Entypo';
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/ProfileScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import RequestsScreen from "../screens/RequestsScreen";
import GroupUsersScreen from "../screens/GroupUsersScreen";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 88,
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
        tabBarInactiveTintColor: "#696969",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t("homeTabs.homeButton"),
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="GroupUsersScreen"
        component={GroupUsersScreen}
        options={{
          tabBarLabel: t("homeTabs.groupsButton"),
          tabBarIcon: ({ color }) => (
            <Entypo name="users" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="RequestsScreen"
        component={RequestsScreen}
        options={{
          tabBarLabel: t("homeTabs.requestsButton"),
          tabBarIcon: ({ color }) => (
            <Entypo name="bell" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
        options={{
          tabBarLabel: t("homeTabs.scheduleButton"),
          tabBarIcon: ({ color }) => (
            <Entypo name="calendar" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={SettingsScreen}
        options={{
          tabBarLabel: t("homeTabs.profileButton"),
          tabBarIcon: ({ color }) => (
            <Entypo name="v-card" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabs;
