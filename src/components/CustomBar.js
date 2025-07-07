import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { translate } from "../services/translations/translateServices";

// Mova o array de abas para fora do componente para evitar recriação a cada renderização.
const TABS_CONFIG = [
  { name: "Home", icon: "home", route: "Home" },
  { name: "Requests", icon: "bell", route: "RequestScreen" },
  { name: "Schedule", icon: "calendar", route: "ScheduleScreen" },
  { name: "Profile", icon: "user", route: "ProfileScreen" }
];

const CustomTabBar = ({ where }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  // 1. Crie um estado para armazenar as abas com os nomes já traduzidos.
  // Comece com os nomes originais como padrão.
  const [tabs, setTabs] = useState(TABS_CONFIG);

  // 2. Use useEffect para traduzir os nomes apenas uma vez.
  useEffect(() => {
    const translateTabs = async () => {
      try {
        // Traduz todos os nomes de uma vez para melhor performance
        const translatedNames = await Promise.all(
          TABS_CONFIG.map(tab => translate(tab.name, "en")) // Assumindo "en"
        );

        // Cria o novo array de abas com os nomes traduzidos
        const translatedTabs = TABS_CONFIG.map((tab, index) => ({
          ...tab,
          name: translatedNames[index],
        }));

        setTabs(translatedTabs);
      } catch (error) {
        console.error("Falha ao traduzir as abas:", error);
        // Em caso de erro, os nomes originais serão mantidos.
      }
    };

    translateTabs();
  }, []); // O array vazio [] garante que isso execute apenas na montagem.


  // A lógica de estilos permanece a mesma.
  const getTabBarHeight = () => {
    const baseHeight = 68;
    const extraHeight = where === "Profile" || where === "Product" || where === "Requests" ? 44 : 0;
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
      {/* 3. Mapeie o array do estado que contém as traduções */}
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
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;