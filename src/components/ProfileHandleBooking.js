import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestGetBookingByUser } from "../services/api";
import { Toast, ALERT_TYPE } from "react-native-alert-notification";
import colors from "../colors";
import { useTranslation } from "react-i18next";

export default function ProfileHandleBooking() {
  const [bookingNumber, setBookingNumber] = useState("");

  const { t } = useTranslation();

  const getBookingByUser = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: t("profileHandleBooking.errorUserID"),
      });
      return;
    }

    try {
      const response = await requestGetBookingByUser(userId);
      if (response.status === 200) {
        const inProgressBooking = await response.data.data.find(booking => booking.status === "Active");
        if (inProgressBooking) {
          setBookingNumber(inProgressBooking.shareNumber);
          return
        }
        setBookingNumber(t("profileHandleBooking.reservas"))
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: t("profileHandleBooking.errorUserID"),
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: t("profileHandleBooking.errorProfileScreenGetUserInfo"),
      });
    }
  };

  useEffect(() => {
    getBookingByUser();
  }, []);

  return (
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
                color: colors.primary,
                fontWeight: "bold",
                opacity: 0.8,
              }}
            >
              {bookingNumber || t("profileHandleBooking.loadingBookingNumber")}
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
