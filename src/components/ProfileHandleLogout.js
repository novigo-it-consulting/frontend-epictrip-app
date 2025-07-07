import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

export default function ProfileHandleLogout() {
  // 2. Criar estado para o texto traduzido
  const [logoutText, setLogoutText] = useState("Logout");

  // useEffect para buscar a tradução
  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const result = await translate("Logout", "en");
        setLogoutText(result);
      } catch (error) {
        console.error("Falha ao traduzir 'Logout':", error);
      }
    };

    fetchTranslation();
  }, []); // Array vazio [] garante que rode apenas uma vez

  return (
    <AlertNotificationRoot theme={"light"}>
      <View style={stylesProfile.container}>
        <View style={stylesProfile.boxProfile}>
          <View style={stylesProfile.rowContainer}>
            <Image
              source={require("../../assets/profile/Disconect.png")}
              style={stylesProfile.icon}
            />
            <View style={stylesProfile.titleName}>
              {/* 3. Usar o estado com o texto traduzido */}
              <Text style={stylesProfile.logoutText}>
                {logoutText}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </AlertNotificationRoot>
  );
}

const stylesProfile = StyleSheet.create({
  container: {
    flex: 0.1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
  },
  boxProfile: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  rowContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  titleName: {
    marginLeft: 12,
  },
  logoutText: {
    fontSize: 14,
    textAlign: "left",
    color: "#172B4D",
  },
});