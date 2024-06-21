import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { useTranslation } from "react-i18next";

export default function ProfileHandleSettingsLanguage() {
  const { t } = useTranslation();

  return (
    <AlertNotificationRoot theme={"light"}>
      <View style={stylesProfile.container}>
        <View style={stylesProfile.boxProfile}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Image
              source={require("../../assets/profile/WorldIcon.png")}
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
                {t("profileHandleSettingsLanguage.titleLanguage")}
              </Text>
            </View>
            <View style={stylesProfile.boxNotification}>
              <View style={stylesProfile.boxColor}>
                <Feather name="arrow-right" color={"#172B4D"} size={15} />
              </View>
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
