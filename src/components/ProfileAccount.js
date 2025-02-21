import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { requestGetUser } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

export default function ProfileAccount() {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profileName, setProfileName] = useState("Polina Fernandes");
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  const { t } = useTranslation();
  const navigation = useNavigation();

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
      }
    } catch (error) {
      console.error("An error occurred while fetching user profile:", error);
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", getUserToProfile);
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
    }, 5000);
  };

  if (loading || imageLoading) {
    return (
      <View style={stylesProfile.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={stylesProfile.container}>
      <View style={stylesProfile.boxProfile}>
        <View style={stylesProfile.profileRow}>
          <Image
            source={profilePhoto ? { uri: profilePhoto } : require("../../assets/profile/1.png")}
            style={stylesProfile.profileImage}
            onLoadEnd={handleImageLoadEnd}
          />
          <View style={stylesProfile.titleName}>
            <Text style={stylesProfile.welcomeText}>{t("profileAccount.welcome")}</Text>
            <Text style={stylesProfile.profileNameText}>{profileName}</Text>
          </View>
          <TouchableOpacity style={stylesProfile.boxNotification} onPress={() => navigation.navigate('ChatAmico')}>
            <View style={stylesProfile.boxColor}>
              <Entypo name="bell" size={24} color="#172B4D" />
              <View style={stylesProfile.customBadge}>
                <Text style={stylesProfile.badgeText}>3</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* Barra de pesquisa centralizada e com placeholder */}
        <View style={stylesProfile.searchContainer}>
          <View style={stylesProfile.searchBar}>
            <Entypo name="magnifying-glass" size={20} color="#172B4D" style={stylesProfile.searchIcon} />
            <TextInput
              style={stylesProfile.searchInput}
              placeholder="Try Disney, food or tickets"
              placeholderTextColor="#7D8A99"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const stylesProfile = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  boxProfile: {
    width: "100%",
    alignItems: "center",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    width: "100%",
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  titleName: {
    marginLeft: 12,
    flex: 1,
  },
  welcomeText: {
    fontSize: 12,
    color: "#364764",
  },
  profileNameText: {
    fontSize: 16,
    color: "#172B4D",
    fontWeight: "bold",
  },
  boxNotification: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  boxColor: {
    backgroundColor: "#F1F5F6",
    width: 50,
    height: 50,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  customBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  searchContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F6",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "90%",
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#172B4D",
  },
});
