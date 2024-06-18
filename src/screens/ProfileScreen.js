// screens/ProfileScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import {
  AlertNotificationRoot,
  Toast,
  ALERT_TYPE,
} from "react-native-alert-notification";
import { getDatabase, ref, set } from "firebase/database";
import app from "../firebase";
import { requestGetUser } from "../services/api";
import colors from "../colors";
import { useTranslation } from "react-i18next";
import ProfileHandleAccount from "../components/ProfileHandleAccount";
import ProfileHandleBooking from "../components/ProfileHandleBooking";
import ProfileHandleSettingsPassword from "../components/ProfileHandleSettingsPassword";
import ProfileHandleSettingsPayment from "../components/ProfileHandleSettingsPayment";
import ProfileHandleSettingsRewards from "../components/ProfileHandleSettingsRewards";
import ProfileHandleSettingsLanguage from "../components/ProfileHandleSettingsLanguage";

const ProfileScreen = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [displayCurrentAddress, setDisplayCurrentAddress] =
    useState("Localização....");
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const navigation = useNavigation();

  const { t } = useTranslation();

  const handlePress = () => {
    navigation.navigate("ChangePersonalInfo");
  };
  const handlePressEmBuild = () => {
    navigation.navigate("EmConstrucaoScreen");
  };

  const getUserToProfile = async () => {
    const userId = await AsyncStorage.getItem("userId");
    try {
      const response = await requestGetUser(userId);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserToProfile();
  }, []);

  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      Alert.alert("Location not enabled", "Please enable your Location", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      setLocationServicesEnabled(enabled);
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Allow the app to use the location services",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]
      );
    }

    const { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;
      console.log(latitude, longitude);

      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      for (let item of response) {
        let address = `${item.name} ${item.city} ${item.region} ${item.country}`;
        setDisplayCurrentAddress(address);
      }
    }
  };

  const updateLocationInFirebase = async (coords, user) => {
    try {
      const db = getDatabase(app);
      await set(ref(db, `users/${user}`), {
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: Date.now(),
      });
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: error.message,
      });
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permissão para acessar a localização foi negada");
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Permissão",
        textBody: errorMsg,
      });
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    updateLocationInFirebase(
      location.coords,
      await AsyncStorage.getItem("userId")
    );
  };

  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
    getLocation();
  }, []);

  return (
    <AlertNotificationRoot theme={"light"}>
      <View style={stylesProfile.containerAlpha}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-start",
            width: "85%",
            marginTop: 50,
          }}
        >
          <Text style={{ fontSize: 33, fontWeight: "bold" }}>Profile</Text>
        </View>
        <View style={stylesProfile.container}>
          <View
            style={{
              flex: 4,
              justifyContent: "center",
              alignItems: "flex-start",
              width: "85%",
              marginBottom: 10,
            }}
          >
            <Text
              style={{ fontSize: 18, marginBottom: 12, fontWeight: "bold" }}
            >
              Account
            </Text>
          </View>
          <TouchableOpacity
            style={stylesProfile.container}
            onPress={handlePress}
          >
            <ProfileHandleAccount />
          </TouchableOpacity>
          <View
            style={{
              flex: 3,
              justifyContent: "center",
              alignItems: "flex-start",
              width: "85%",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 14, opacity: 0.6, marginBottom: 12 }}>
              Sua Reserva
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
              flex: 3,
              justifyContent: "center",
              alignItems: "flex-start",
              width: "85%",
              marginBottom: 20,
            }}
          >
            <Text
              style={{ fontSize: 18, marginBottom: 12, fontWeight: "bold" }}
            >
              Settings
            </Text>
          </View>
          <TouchableOpacity
            style={stylesProfile.container}
            onPress={handlePressEmBuild}
          >
            <ProfileHandleSettingsPassword />
          </TouchableOpacity>
          <TouchableOpacity
            style={stylesProfile.container}
            onPress={handlePressEmBuild}
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
        </View>
      </View>
    </AlertNotificationRoot>
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
