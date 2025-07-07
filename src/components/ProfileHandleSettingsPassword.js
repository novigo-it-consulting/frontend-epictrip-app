import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

export default function ProfileHandleSettingsPassword() {
  // 2. Criar estado para o texto traduzido
  const [changePasswordText, setChangePasswordText] = useState("Change Password");

  // useEffect para buscar a tradução
  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const result = await translate("Change Password", "en");
        setChangePasswordText(result);
      } catch (error) {
        console.error("Falha ao traduzir 'Change Password':", error);
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
              source={require("../../assets/profile/SettingsIcon.png")}
              style={stylesProfile.icon}
            />
            <View style={stylesProfile.titleName}>
              {/* 3. Usar o estado com o texto traduzido */}
              <Text style={stylesProfile.text}>
                {changePasswordText}
              </Text>
            </View>
            <View style={stylesProfile.boxNotification}>
              {/* <View style={stylesProfile.boxColor}>
                <Feather name="arrow-right" color={"#172B4D"} size={15} />
              </View> */}
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
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  text: {
    fontSize: 14,
    textAlign: "left",
    color: "#172B4D",
  },
  boxNotification: {
    height: 32,
    width: "auto",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginLeft: "auto",
  },
  titleName: {
    marginLeft: 12,
  },
});