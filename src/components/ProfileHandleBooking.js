import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestGetUser } from "../services/api";
import { AlertNotificationRoot } from "react-native-alert-notification";

export default function ProfileHandleBooking() {
  const [bookingNumber, setBookingNumber] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const getUserToProfile = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in AsyncStorage");
      return;
    }

    try {
      const response = await requestGetUser(userId);
      if (response.status === 200) {
        setBookingNumber(response.data.data.shareNumber); // Assuming the response has a profilePic field for the user's photo
      } else {
        console.error("Failed to fetch user profile:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while fetching user profile:", error);
    }
  };

  useEffect(() => {
    getUserToProfile();
  }, []);

  return (
    <AlertNotificationRoot theme={"light"}>
      <View style={stylesProfile.container}>
        <View style={stylesProfile.boxProfile}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Image
              source={require("../../assets/profile/ShareIcon.png")}
              style={{ width: 48, height: 48, borderRadius: 24, opacity: 0.7 }}
            />
            <View style={stylesProfile.titleName}>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: "left",
                  color: "#172B4D",
                  fontWeight: "light",
                }}
              >
                {bookingNumber || "Carregando..."}
              </Text>
            </View>
            <View style={stylesProfile.boxNotification}>
              <View style={stylesProfile.boxColor}>
                <Feather name="arrow-right" color={"#172B4D"} size={15} />
              </View>
            </View>
          </View>
        </View>
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
