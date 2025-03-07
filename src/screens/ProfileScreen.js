// screens/ProfileScreen.js
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestChangePasswordToken, requestGetMethodsByUser } from "../services/api.js";
import { Dialog, Portal, Text, Button } from 'react-native-paper';
import FooterNavBar from "../components/FooterNavBar.js";
import CustomTabBar from "../components/CustomBar";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);

  const hideDialog = () => setVisible(false);

  const { t } = useTranslation();

  const handlePress = () => {
    navigation.navigate("ChangePersonalInfo");
  };
  const handlePressEmBuild = () => {
    navigation.navigate("EmConstrucaoScreen");
  };
  const handlePressGoBooking = () => {
    navigation.navigate("BookingScreen");
  };
  const handlePressLogout = async () => {
    setVisible(true);
    try {
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      alert("Error clearing AsyncStorage:", error);
    }
  };


  const handlePressPaymentScreen = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId")
      const response = await requestGetMethodsByUser(userId);
      if (response.status === 200) {
        navigation.navigate("ChangePaymentScreen");
      } else {
        navigation.navigate("PaymentScreen");
      }
    } catch (error) {
      throw error;
    }
  };

  const handlePressPayment = () => {
    navigation.navigate("Payment");
  };
  const handlePressChangePassword = async () => {
    const userId = await AsyncStorage.getItem("userId")
    const response = await requestChangePasswordToken(userId)
    if (response.status === 200) {
      await AsyncStorage.setItem("changePasswordToken", response.data.token)
      navigation.navigate("SetNewPassword");
    }
  };

  const defaultToastConfig = {
    autoClose: 3000,
    titleStyle: { fontSize: 16, fontWeight: "bold" },
  };

  const lightColors = {
    label: "#000",
    card: "red",
    overlay: "#f0f0f0",
    success: "#28a745",
    danger: "rgba(255, 0, 0, 1)",
    warning: "#fff",
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
          onPress={handlePressGoBooking}
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
          onPress={() => setVisible(true)}
        >
          <ProfileHandleLogout />
        </TouchableOpacity>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
            <Dialog.Icon icon="alert" />
            <Dialog.Title style={styles.title}>
              {t('logoutDialog.title')}
            </Dialog.Title>
            <Dialog.Content>
              <Text style={{ textAlign: "center" }} variant="bodyMedium">
                {t('logoutDialog.content')}
              </Text>
            </Dialog.Content>
            <Dialog.Actions style={{ marginLeft: "auto", marginRight: "auto" }}>
              <Button
                textColor="#fff"
                background={"#0065ff"}
                style={styles.actionButtonNo}
                onPress={() => setVisible(false)}
              >
                {t('logoutDialog.noButton')}
              </Button>
              <Button onPress={() => handlePressLogout()}>
                {t('logoutDialog.yesButton')}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <CustomTabBar />
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

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
  dialog: {
    backgroundColor: colors.backGroundLight
  },
  actionButtonNo: {
    textAlign: "center",
    backgroundColor: colors.primary,
    paddingRight: 12,
    paddingLeft: 12
  }
})


export default ProfileScreen;
