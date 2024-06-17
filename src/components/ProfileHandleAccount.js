import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, ActivityIndicator } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestGetUser } from "../services/api";
import {
  ALERT_TYPE,
  Toast,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import { useNavigation } from "@react-navigation/native";

export default function ProfileHandleAccount(alert) {
  const [profileName, setProfileName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const { t } = useTranslation();

  const getUserToProfile = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in AsyncStorage");
      setLoading(false);
      return;
    }

    try {
      const response = await requestGetUser(userId);
      if (response.status === 200) {
        const { fullName, profilePic } = response.data.data;
        setProfileName(fullName);
        setProfilePhoto(profilePic); // Correção aplicada aqui
      } else {
        console.error("Failed to fetch user profile:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while fetching user profile:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUserToProfile();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <AlertNotificationRoot theme={"light"}>
      <View style={stylesProfile.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={stylesProfile.boxProfile}>
            <Image
              source={
                profilePhoto
                  ? { uri: profilePhoto }
                  : require("../../assets/profile/1.png")
              }
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
            <View style={stylesProfile.titleName}>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: "left",
                  color: "#172B4D",
                  fontWeight: "bold",
                }}
              >
                {profileName || "Nome do Usuário"}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "left",
                  color: "#364764",
                  marginTop: 6,
                }}
              >
                Change your personal info
              </Text>
            </View>
            <View style={stylesProfile.boxNotification}>
              <Feather name="arrow-right" color={"#172B4D"} size={15} />
            </View>
          </View>
        )}
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
