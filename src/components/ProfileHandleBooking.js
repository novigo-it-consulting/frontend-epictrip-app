import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast, ALERT_TYPE } from "react-native-alert-notification";
import colors from "../colors";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

export default function ProfileHandleBooking() {
  const [bookingNumber, setBookingNumber] = useState("");
  // 2. Criar estados para os textos que serão traduzidos
  const [noBookingsText, setNoBookingsText] = useState("No Bookings");
  const [loadingText, setLoadingText] = useState("Loading...");

  // useEffect para buscar as traduções quando o componente montar
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        // Busca as traduções em paralelo para otimizar
        const [translatedNoBookings, translatedLoading] = await Promise.all([
          translate("No Bookings", "en"),
          translate("Loading...", "en"),
        ]);
        setNoBookingsText(translatedNoBookings);
        setLoadingText(translatedLoading);
      } catch (error) {
        console.error("Falha ao buscar traduções:", error);
      }
    };
    fetchTranslations();
  }, []); // Array vazio [] garante que rode apenas uma vez

  const getBookingByUser = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: "Failed to load user ID",
      });
      return;
    }

    try {
      const response = await requestGetBookingByUser(userId);
      if (response.status === 200) {
        const inProgressBooking = response.data.data.find(booking => booking.status === "Active");
        if (inProgressBooking) {
          setBookingNumber(inProgressBooking.shareNumber);
        } else {
          // 3. Usar o estado com o texto traduzido
          setBookingNumber(noBookingsText);
        }
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: "Failed to load user ID",
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: "An error occurred while loading your information",
      });
    }
  };

  // useEffect para buscar os dados do usuário
  useEffect(() => {
    // Adicionamos noBookingsText como dependência para garantir que,
    // se a tradução chegar depois da API, o valor correto seja usado.
    getBookingByUser();
  }, [noBookingsText]);

  return (
    <View style={stylesProfile.container}>
      <View style={stylesProfile.boxProfile}>
        <View style={stylesProfile.rowContainer}>
          <Image
            source={require("../../assets/profile/ShareIcon.png")}
            style={stylesProfile.icon}
          />
          <View style={stylesProfile.titleName}>
            <Text style={stylesProfile.bookingText}>
              {/* 4. Usar o estado com o texto traduzido para o loading */}
              {bookingNumber || loadingText}
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
  rowContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    opacity: 0.7,
  },
  bookingText: {
    fontSize: 14,
    textAlign: "left",
    color: colors.primary,
    fontWeight: "bold",
    opacity: 0.8,
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