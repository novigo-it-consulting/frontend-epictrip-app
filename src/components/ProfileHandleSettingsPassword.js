import React from 'react';
import { StyleSheet, View, Text, Image } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { useTranslation } from 'react-i18next';

export default function ProfileHandleSettingsPassword() {
  const { t } = useTranslation();

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
              <Text style={stylesProfile.text}>
                {t('profileHandleChangePassword.titleChangePassword')}
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
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  boxProfile: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  rowContainer: {
    flex: 1,
    justifyContent: "flex-start", // Alinhado à esquerda
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  text: {
    fontSize: 16,
    textAlign: "left",
    color: "#172B4D",
    fontWeight: '600',
  },
  titleName: {
    marginLeft: 12,
  },
});
