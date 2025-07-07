import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../colors";
import ProfileHandleAccount from "../components/ProfileHandleAccount";
import ProfileHandleSettingsPassword from "../components/ProfileHandleSettingsPassword";
import ProfileHandleSettingsPayment from "../components/ProfileHandleSettingsPayment";
import ProfileHandleLogout from "../components/ProfileHandleLogout.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestChangePasswordToken, requestGetMethodsByUser } from "../services/api.js";
import { Dialog, Portal, Text, Button } from 'react-native-paper';
import CustomTabBar from "../components/CustomBar";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const hideDialog = () => setVisible(false);

  // 2. Criar um estado para armazenar os textos traduzidos
  const [t, setT] = useState({
    profile: "Profile",
    account: "Account",
    settings: "Settings",
    logoutConfirmTitle: "Do you really want to leave?",
    logoutConfirmBody: "When you leave, we will clear all your data and redirect you to the login.",
    no: "No",
    yes: "Yes",
    logoutError: "Error clearing data:",
  });

  // 3. useEffect para buscar as traduções
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [
          profile, account, settings, logoutConfirmTitle,
          logoutConfirmBody, no, yes, logoutError
        ] = await Promise.all([
          translate("Profile", "en"),
          translate("Account", "en"),
          translate("Settings", "en"),
          translate("Do you really want to leave?", "en"),
          translate("When you leave, we will clear all your data and redirect you to the login.", "en"),
          translate("No", "en"),
          translate("Yes", "en"),
          translate("Error clearing data:", "en"),
        ]);
        setT({
          profile, account, settings, logoutConfirmTitle,
          logoutConfirmBody, no, yes, logoutError
        });
      } catch (error) {
        console.error("Falha ao buscar traduções:", error);
      }
    };
    fetchTranslations();
  }, []);


  const handlePress = () => {
    navigation.navigate("ChangePersonalInfo");
  };

  const handlePressPaymentScreen = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await requestGetMethodsByUser(userId);
      // Navega para a tela da carteira independentemente da resposta,
      // a própria tela da carteira tratará se há cartões ou não.
      navigation.navigate("WalletScreen");
    } catch (error) {
      console.error("Erro ao verificar métodos de pagamento, navegando mesmo assim:", error);
      navigation.navigate("WalletScreen");
    }
  };

  const handlePressChangePassword = async () => {
    const userId = await AsyncStorage.getItem("userId");
    const response = await requestChangePasswordToken(userId);
    if (response.status === 200) {
      await AsyncStorage.setItem("changePasswordToken", response.data.token);
      navigation.navigate("SetNewPassword");
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
      Alert.alert(t.logoutError, error.message);
    }
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
          {/* 4. Usar os textos traduzidos */}
          <Text style={stylesProfile.headerTitle}>
            {t.profile}
          </Text>
        </View>

        {/* Content */}
        <View style={stylesProfile.content}>
          {/* Account Section */}
          <View style={stylesProfile.section}>
            <Text style={stylesProfile.sectionTitle}>
              {t.account}
            </Text>
            <TouchableOpacity style={stylesProfile.menuItem} onPress={handlePress}>
              <ProfileHandleAccount />
            </TouchableOpacity>
          </View>

          {/* Settings Section */}
          <View style={stylesProfile.section}>
            <Text style={stylesProfile.sectionTitle}>
              {t.settings}
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
              {t.logoutConfirmTitle}
            </Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogText} variant="bodyMedium">
                {t.logoutConfirmBody}
              </Text>
            </Dialog.Content>
            <Dialog.Actions style={styles.dialogActions}>
              <Button
                textColor="#fff"
                style={styles.actionButtonNo}
                onPress={() => setVisible(false)}
              >
                {t.no}
              </Button>
              <Button
                style={styles.actionButtonYes}
                onPress={handleConfirmLogout}
              >
                {t.yes}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>

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
    paddingBottom: 80, // Aumentar espaço para a tab bar
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