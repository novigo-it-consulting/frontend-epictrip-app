import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { requestGetUser } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import { Badge } from "react-native-paper";
import SearchBarHome from "./SearchViewHome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SkeletonLoading from "expo-skeleton-loading";
import { useTranslation } from "react-i18next";
import ChatNotification from "../screens/ChatNotification";

export default function ProfileAccount() {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  const { t } = useTranslation();
  const navigation = useNavigation(); // Use navigation

  const getUserToProfile = async () => {
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
        setProfilePhoto(profilePic);
        console.error("Failed to fetch user profile:", response.status);        setLoading(false);
        setImageLoading(false);
      } else {

        setLoading(false);
        setImageLoading(false);
      }
    } catch (error) {
      console.error("An error occurred while fetching user profile:", error);
      setLoading(false);
      setImageLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUserToProfile();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!profilePhoto) {
      setImageLoading(false);
    }
  }, [profilePhoto]);

  const handleImageLoadEnd = () => {
    setTimeout(() => {
      setImageLoading(false);
    }, 5000); // 5 segundos de delay
  };

  if (loading || imageLoading) {
    return (
      <SkeletonLoading background={"#adadad"} highlight={"#ffffff"}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#adadad",
            }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View
              style={{
                backgroundColor: "#adadad",
                height: 16,
                marginBottom: 6,
                borderRadius: 8,
              }}
            />
            <View
              style={{
                backgroundColor: "#adadad",
                height: 16,
                borderRadius: 8,
              }}
            />
          </View>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: "#adadad",
            }}
          />
        </View>
      </SkeletonLoading>
    );
  }

  const navigateToNotifications = () => {
    navigation.navigate('ChatNotification');
  };

  return (
    <View style={stylesProfile.container}>
      <View style={stylesProfile.boxProfile}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "row",
          }}
        >
          <Image
            source={
              profilePhoto
                ? { uri: profilePhoto }
                : require("../../assets/profile/1.png")
            }
            style={{ width: 48, height: 48, borderRadius: 24 }}
            onLoadEnd={handleImageLoadEnd}
          />
          <View style={stylesProfile.titleName}>
            <Text style={{ fontSize: 12, textAlign: "left", color: "#364764" }}>
             {t("profileAccount.welcome")}
            </Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: "left",
                color: "#172B4D",
                fontWeight: "bold",
              }}
            >
              {profileName}👋
            </Text>
          </View>
          <TouchableOpacity style={{ marginLeft: 100 }} onPress={navigateToNotifications}>
            <View style={stylesProfile.boxNotification}>
              <View style={stylesProfile.boxColor}>
                <Feather name="bell" color={"#172B4D"} size={15} />
                <Badge
                  style={{ position: "absolute", top: 5, right: 5 }}
                  size={15}
                >
                  3
                </Badge>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <SearchBarHome />
      </View>
    </View>
  );
}

const stylesProfile = StyleSheet.create({
  container: {
    flex: 0.5,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    width: "85%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  boxProfile: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  boxNotification: {
    height: 48,
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  boxColor: {
    backgroundColor: "#F1F5F6",
    width: 50,
    height: 50,
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
