import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Dialog, Portal, Text, Button } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileHandleSettingsLanguage from "../components/ProfileHandleSettingsLanguage.js";
import colors from "../colors";
import ProfileHandleAccount from "../components/ProfileHandleAccount";
import ProfileHandleBooking from "../components/ProfileHandleBooking";
import ProfileHandleSettingsPassword from "../components/ProfileHandleSettingsPassword";
import ProfileHandleSettingsPayment from "../components/ProfileHandleSettingsPayment";
import ProfileHandleLogout from "../components/ProfileHandleLogout.js";
import { requestChangePasswordToken, requestGetMethodsByUser } from "../services/api.js";
import CustomTabBar from "../components/CustomBar";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const hideDialog = () => setVisible(false);

  const handlePress = () => {
    navigation.navigate("ChangePersonalInfo");
  };

  const handlePressPaymentScreen = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      // await requestGetMethodsByUser(userId);
      navigation.navigate("WalletScreen");
    } catch (error) {
      console.error("Erro ao verificar métodos de pagamento, navegando mesmo assim:", error);
      navigation.navigate("WalletScreen");
    }
  };

  const handlePressGoBooking = () => {
    navigation.navigate("BookingScreen");
  };

  const handlePressChangePassword = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await requestChangePasswordToken(userId);
      if (response.status === 200) {
        await AsyncStorage.setItem("changePasswordToken", response.data.token);
        navigation.navigate("SetNewPassword");
      }
    } catch (error) {
      console.error("Failed to get change password token:", error);
      // Adicionar um Toast de erro para o usuário aqui, se desejar
    }
  };

  const handleConfirmLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert(t('profileScreen.logoutErrorTitle'), error.message);
    }
  };

  const handlePressLanguage = () => {
    navigation.navigate("LanguageSelectionScreen", { fromProfile: true });
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
            {t('profileScreen.profileTitle')}
          </Text>
        </View>

        {/* Content */}
        <View style={stylesProfile.content}>
          {/* Account Section */}
          <View style={stylesProfile.section}>
            <Text style={stylesProfile.sectionTitle}>
              {t('profileScreen.subTitleAccount')}
            </Text>
            <TouchableOpacity style={stylesProfile.menuItem} onPress={handlePress}>
              <ProfileHandleAccount />
            </TouchableOpacity>
          </View>

          {/* Booking Section - CORRIGIDA */}
          <View style={stylesProfile.section}>
            <Text style={stylesProfile.sectionTitle}>
              {t("profileScreen.subTitleBooking")}
            </Text>
            <TouchableOpacity
              style={stylesProfile.menuItem}
              onPress={handlePressGoBooking}
            >
              <ProfileHandleBooking />
            </TouchableOpacity>
          </View>

          {/* Settings Section */}
          <View style={stylesProfile.section}>
            <Text style={stylesProfile.sectionTitle}>
              {t('profileScreen.subuTitleSettings')}
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
              onPress={handlePressLanguage}
            >
              <ProfileHandleSettingsLanguage />
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
                onPress={handleConfirmLogout}
              >
                {t('logoutDialog.yesButton')}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>

      <CustomTabBar where={t('homeTabs.profileButton')} />
    </SafeAreaView>
  );
};

// ... (O resto do seu código e estilos permanecem os mesmos)
const stylesProfile = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backGroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
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
    marginBottom: 24, // << AJUSTE: um pouco menos de margem para ficar mais coeso
  },
  sectionTitle: {
    fontSize: 16, // << AJUSTE: um pouco menor para dar mais destaque ao título principal
    fontWeight: '600', // << AJUSTE: semibold
    marginBottom: 16,
    color: colors.textPrimary || "#000",
    opacity: 0.8,
  },
  menuItem: {
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#fff', // Adicionei um fundo para melhor visualização
    padding: 12, // Adicionei padding
    // Removi overflow: 'hidden' pois pode não ser necessário
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