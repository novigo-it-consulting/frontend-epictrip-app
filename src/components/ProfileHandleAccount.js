import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { AlertNotificationRoot } from "react-native-alert-notification";

import { requestGetUser } from "../services/api";
import colors from "../colors";

export default function ProfileHandleAccount() {
  const [profileName, setProfileName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true); // Inicia como true para mostrar o loading
  const navigation = useNavigation();
  const { t } = useTranslation();

  const getUserToProfile = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in AsyncStorage");
        return;
      }
      const response = await requestGetUser(userId);
      if (response.status === 200) {
        const { fullName, profilePic } = response.data.data;
        setProfileName(fullName);
        setProfilePhoto(profilePic);
      } else {
        console.error("Failed to fetch user profile:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect é mais adequado para re-buscar dados quando a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      getUserToProfile();
    }, [])
  );

  return (
    <AlertNotificationRoot theme={"light"}>
      <View style={stylesProfile.container}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <View style={stylesProfile.boxProfile}>
            <Image
              source={
                profilePhoto
                  ? { uri: profilePhoto }
                  : require("../../assets/profile/profileIcon.png")
              }
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
            <View style={stylesProfile.titleName}>
              <Text style={stylesProfile.profileNameText}>
                {profileName || t('profileHandleAccount.loadingError')}
              </Text>
              <Text style={stylesProfile.descriptionText}>
                {t('profileHandleAccount.titleHandleAccount')}
              </Text>
            </View>
          </View>
        )}
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
    alignItems: "center", // Alinha itens verticalmente
  },
  titleName: {
    marginLeft: 12,
    flex: 1, // Permite que o texto quebre a linha se necessário
  },
  profileNameText: {
    fontSize: 14,
    textAlign: "left",
    color: "#172B4D",
    fontWeight: "bold",
  },
  descriptionText: {
    fontSize: 16,
    textAlign: "left",
    color: "#364764",
    marginTop: 6,
  },
});
