import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { requestGetUser } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from "@react-native-async-storage/async-storage";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";


export default function ProfileAccount() {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [loading, setLoading] = useState(true);

  // 2. Criar um estado para armazenar os textos traduzidos
  const [t, setT] = useState({
    loading: "Loading...",
    hello: "Hello",
    searchPlaceholder: "Try Disney, food or tickets"
  });

  const navigation = useNavigation();

  // 3. useEffect para buscar as traduções
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [loading, hello, searchPlaceholder] = await Promise.all([
          translate("Loading...", "en"),
          translate("Hello", "en"),
          translate("Try Disney, food or tickets", "en")
        ]);
        setT({ loading, hello, searchPlaceholder });
      } catch (error) {
        console.error("Falha ao buscar traduções:", error);
      }
    };
    fetchTranslations();
  }, []);

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
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(true); // Mostra o loading ao focar na tela
      getUserToProfile();
    });
    return unsubscribe;
  }, [navigation]);


  if (loading) {
    return (
      <View style={stylesProfile.loadingContainer}>
        {/* 4. Usar os textos traduzidos */}
        <ActivityIndicator size="small" color="#172B4D" />
        <Text style={{ marginLeft: 10 }}>{t.loading}</Text>
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
          />
          <View style={stylesProfile.titleName}>
            <Text style={stylesProfile.welcomeText}>{t.hello}</Text>
            <Text style={stylesProfile.profileNameText}>{profileName}</Text>
          </View>
          <TouchableOpacity style={stylesProfile.boxNotification} onPress={() => navigation.navigate('RequestScreen')}>
            <View style={stylesProfile.boxColor}>
              <Entypo name="mail" size={19} color="#172B4D" />
              <View style={stylesProfile.customBadge}>
                <Text style={stylesProfile.badgeText}>2</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={stylesProfile.searchContainer}>
          <View style={stylesProfile.searchBar}>
            <Entypo name="magnifying-glass" size={20} color="#172B4D" style={stylesProfile.searchIcon} />
            <TextInput
              style={stylesProfile.searchInput}
              placeholder={t.searchPlaceholder}
              placeholderTextColor="#7D8A99"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const stylesProfile = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 48,
    paddingHorizontal: 20
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
    width: "100%", // Ajustado para 100%
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