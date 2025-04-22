import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { useTranslation } from "react-i18next";

export default function ProfileHandleLogout() {
  const { t } = useTranslation();
  return (
    <AlertNotificationRoot theme={"light"}>
      <View style={stylesProfile.container}>
        <View style={stylesProfile.boxProfile}>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Image
              source={require("../../assets/profile/Disconect.png")}
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
            <View style={stylesProfile.titleName}>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: "left",
                  color: "#172B4D",
                  fontWeight: "light",
                }}
              >
                {t("profileHandleLogout.titleHandleLogout")}
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
    width: "85%"
  },
  boxProfile: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  boxNotification: {
    height: 32,
    width: "auto",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginLeft: "auto",
  },
  boxColor: {
    backgroundColor: "#F6F8FA",
    width: 25,
    height: 25,
    borderRadius: 24,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  titleName: {
    marginLeft: 12,
  },
});
