// screens/ProfileScreen.js
import React from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../colors";
import { useTranslation } from "react-i18next";
import ProfileHandleAccount from "../components/ProfileHandleAccount";
import ProfileHandleBooking from "../components/ProfileHandleBooking";
import ProfileHandleSettingsPassword from "../components/ProfileHandleSettingsPassword";
import ProfileHandleSettingsPayment from "../components/ProfileHandleSettingsPayment";
import ProfileHandleSettingsRewards from "../components/ProfileHandleSettingsRewards";
import ProfileHandleSettingsLanguage from "../components/ProfileHandleSettingsLanguage";
import ProfileHandleLogout from "../components/ProfileHandleLogout.js";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const { t } = useTranslation();

  const handlePress = () => {
    navigation.navigate("ChangePersonalInfo");
  };
  const handlePressEmBuild = () => {
    navigation.navigate("EmConstrucaoScreen");
  };
  const handlePressPaymentScreen = () => {
    navigation.navigate("PaymentScreen");
  };
  const handlePressChangePassword = () => {
    navigation.navigate("FogotPassword");
  };

  return (
    <View style={stylesProfile.containerAlpha}>
      <View
        style={{
          flex: 0.8,
          justifyContent: "center",
          alignItems: "flex-start",
          width: "85%",
          marginTop: 30,
        }}
      >
        <Text style={{ fontSize: 33, fontWeight: "bold" }}>
          {t("profileScreen.profileTitle")}
        </Text>
      </View>
      <View style={stylesProfile.container}>
        <View
          style={{
            flex: 4,
            justifyContent: "center",
            alignItems: "flex-start",
            width: "85%",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 14, fontWeight: "bold" }}>
            {t("profileScreen.subTitleAccount")}
          </Text>
        </View>
        <TouchableOpacity style={stylesProfile.container} onPress={handlePress}>
          <ProfileHandleAccount />
        </TouchableOpacity>
        <View
          style={{
            flex: 2,
            justifyContent: "center",
            alignItems: "flex-start",
            width: "85%",
            marginBottom: 0,
          }}
        >
          <Text style={{ fontSize: 14, opacity: 0.6, marginBottom: 0 }}>
            {t("profileScreen.subTitleBooking")}
          </Text>
        </View>
        <TouchableOpacity
          style={stylesProfile.container}
          onPress={handlePressEmBuild}
        >
          <ProfileHandleBooking />
        </TouchableOpacity>
        <View
          style={{
            flex: 4,
            justifyContent: "center",
            alignItems: "flex-start",
            width: "85%",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 12, fontWeight: "bold" }}>
            {t("profileScreen.subuTitleSettings")}
          </Text>
        </View>
        <TouchableOpacity
          style={stylesProfile.container}
          onPress={handlePressChangePassword}
        >
          <ProfileHandleSettingsPassword />
        </TouchableOpacity>
        <TouchableOpacity
          style={stylesProfile.container}
          onPress={handlePressPaymentScreen}
        >
          <ProfileHandleSettingsPayment />
        </TouchableOpacity>
        <TouchableOpacity
          style={stylesProfile.container}
          onPress={handlePressEmBuild}
        >
          <ProfileHandleSettingsRewards />
        </TouchableOpacity>
        <TouchableOpacity
          style={stylesProfile.container}
          onPress={handlePressEmBuild}
        >
          <ProfileHandleSettingsLanguage />
        </TouchableOpacity>
        <TouchableOpacity
          style={stylesProfile.container}
          onPress={handlePressEmBuild}
        >
          <ProfileHandleLogout />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const stylesProfile = StyleSheet.create({
  containerAlpha: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginRight: "auto",
    marginLeft: "auto",
    backgroundColor: colors.backGroundLight,
  },
  container: {
    flex: 5,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});

export default ProfileScreen;
