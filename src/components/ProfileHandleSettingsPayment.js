import React from 'react';
import { StyleSheet, View, Text, Image } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { useTranslation } from 'react-i18next';
import Feather from "react-native-vector-icons/Feather";

export default function ProfileHandleSettingsPayment() {
  const { t } = useTranslation();


  return (
    <AlertNotificationRoot theme={"light"}>
      <View style={stylesProfile.container}>
        <View style={stylesProfile.boxProfile}>
          <View style={stylesProfile.rowContainer}>
            <Image
              source={require("../../assets/profile/PaymentIcon.png")}
              style={stylesProfile.icon}
            />
            <View style={stylesProfile.titleName}>
              <Text style={stylesProfile.text}>
                {t('Wallet')}
              </Text>
            </View>
            <View style={stylesProfile.boxNotification}>
              <View style={stylesProfile.boxColor}>
                <Feather name="chevron-right" color={"#172B4D"} size={15} />
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
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  text: {
    fontSize: 16,
    textAlign: "left",
    color: "#172B4D",
    fontWeight: '600',
  },
  boxNotification: {
    height: 32,
    width: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: 'center',
    marginLeft: "auto",
  },
  boxColor: {
    backgroundColor: "#F6F8FA",
    width: 25,
    height: 25,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  titleName: {
    marginLeft: 12,
  },
});
