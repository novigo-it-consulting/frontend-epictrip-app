import React from 'react';
import { StyleSheet, View, Text, Image } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { useTranslation } from 'react-i18next';

export default function ProfileHandleLogout() {
  const { t } = useTranslation();

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
              <Text style={stylesProfile.logoutText}>
                {t('profileHandleLogout.titleHandleLogout')}
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
    flex: 1, // Ajustado para ocupar o espaço necessário
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8, // Adicionado padding vertical
  },
  boxProfile: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
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
    fontSize: 16, // Aumentado para melhor legibilidade
    textAlign: "left",
    color: "#172B4D",
    fontWeight: '600', // Adicionado peso para destaque
  },
});
