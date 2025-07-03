import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
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
        navigation.navigate("WalletScreen");
      } else {
        navigation.navigate("WalletScreen");
      }
    } catch (error) {
      throw error;
    }
  };

  const handlePressPayment = () => {
    navigation.navigate("WalletScreen");
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
    <SafeAreaView style={stylesProfile.safeArea}>
      <ScrollView
        style={stylesProfile.scrollView}
        contentContainerStyle={stylesProfile.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={stylesProfile.header}>
          <Text style={stylesProfile.headerTitle}>
            {t("profileScreen.profileTitle")}
          </Text>
        </View>

        {/* Content */}
        <View style={stylesProfile.content}>
          {/* Account Section */}
          <View style={stylesProfile.section}>
            <Text style={stylesProfile.sectionTitle}>
              {t("profileScreen.subTitleAccount")}
            </Text>
            <TouchableOpacity style={stylesProfile.menuItem} onPress={handlePress}>
              <ProfileHandleAccount />
            </TouchableOpacity>
          </View>

          {/* Settings Section */}
          <View style={stylesProfile.section}>
            <Text style={stylesProfile.sectionTitle}>
              {t("profileScreen.subuTitleSettings")}
            </Text>

            <TouchableOpacity
              style={stylesProfile.menuItem}
              onPress={handlePressChangePassword}
            >
              <ProfileHandleSettingsPassword />
            </TouchableOpacity>

            <TouchableOpacity
              style={stylesProfile.menuItem}
              onPress={handlePressPaymentScreen}
            >
              <ProfileHandleSettingsPayment />
            </TouchableOpacity>

            <TouchableOpacity
              style={stylesProfile.menuItem}
              onPress={() => setVisible(true)}
            >
              <ProfileHandleLogout />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Dialog */}
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
            <Dialog.Icon icon="alert" />
            <Dialog.Title style={styles.title}>
              {t('logoutDialog.title')}
            </Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogText} variant="bodyMedium">
                {t('logoutDialog.content')}
              </Text>
            </Dialog.Content>
            <Dialog.Actions style={styles.dialogActions}>
              <Button
                textColor="#fff"
                style={styles.actionButtonNo}
                onPress={() => setVisible(false)}
              >
                {t('logoutDialog.noButton')}
              </Button>
              <Button
                style={styles.actionButtonYes}
                onPress={() => handlePressLogout()}
              >
                {t('logoutDialog.yesButton')}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>

      {/* Bottom Navigation */}
      <CustomTabBar where={"Profile"} />
    </SafeAreaView>
  );
};

const stylesProfile = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backGroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.textPrimary || "#000",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: colors.textPrimary || "#000",
  },
  menuItem: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dialog: {
    backgroundColor: colors.backGroundLight,
    borderRadius: 16,
    margin: 20,
  },
  dialogText: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
  dialogActions: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonNo: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    minWidth: 100,
  },
  actionButtonYes: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 20,
    minWidth: 100,
  }
});

export default ProfileScreen;