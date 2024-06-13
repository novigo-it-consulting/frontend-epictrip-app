import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestGetUser } from "../services/api";
import colors from "../colors";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { useTranslation } from "react-i18next";

export default function ProfileHandleAccount() {
  const [profileName, setProfileName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const { t } = useTranslation();

  const getUserToProfile = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in AsyncStorage");
      return;
    }

    try {
      const response = await requestGetUser(userId);
      if (response.status === 200) {
        const { fullName, profilePic } = response.data.data;
        console.log("response: ", response.data);
        setProfileName(fullName);
        setProfilePhoto(profilePic);
      } else {
        throw new Error(
          "Ocorreu um erro ao atualizar as informações do usuario, por favor tente novamente mais tarde."
        );
      }
    } catch (error) {
      if (error.response.data.message === 500) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: t("profileHandleAccount.errorUpdating"),
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: t("profileHandleAccount.errorUpdating"),
        });
      }
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
