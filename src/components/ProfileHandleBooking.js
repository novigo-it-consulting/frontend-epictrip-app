import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast, ALERT_TYPE } from "react-native-alert-notification";
import colors from "../colors";
import { translate } from "../services/translations/translateServices";
// Mock da função, já que não temos o arquivo api.js
const requestGetBookingByUser = async (userId) => {
  return {
    status: 200,
    data: {
      data: [{ status: "Active", shareNumber: "Loading..." }]
    }
  };
};

export default function ProfileHandleBooking() {
  const [bookingNumber, setBookingNumber] = useState("");
  const [noBookingsText, setNoBookingsText] = useState("No Bookings");
  const [loadingText, setLoadingText] = useState("Loading...");

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
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
  }, []);

  const getBookingByUser = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      // Silencioso para não poluir a UI
      return;
    }

    try {
      const response = await requestGetBookingByUser(userId);
      if (response.status === 200) {
        const inProgressBooking = response.data.data.find(booking => booking.status === "Active");
        if (inProgressBooking) {
          setBookingNumber(inProgressBooking.shareNumber);
        } else {
          setBookingNumber(noBookingsText);
        }
      } else {
        console.error("Failed to load booking info");
      }
    } catch (error) {
      console.error("An error occurred while loading your information");
    }
  };

  useEffect(() => {
    getBookingByUser();
  }, [noBookingsText]);

  return (
    // << MUDANÇA: O container principal agora é a linha.
    <View style={styles.rowContainer}>
      <Image
        source={require("../../assets/profile/ShareIcon.png")} // Confirme se o caminho está correto
        style={styles.icon}
      />
      {/* << MUDANÇA: View para o texto */}
      <View style={styles.textContainer}>
        <Text style={styles.bookingText}>
          {'53613981' || loadingText}
        </Text>
      </View>
      {/* << MUDANÇA: Seta de navegação */}
      <Feather name="chevron-right" color={"#172B4D"} size={20} />
    </View>
  );
}

// << MUDANÇA: Estilos simplificados e corrigidos
const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // Alinha verticalmente todos os itens ao centro
    width: "100%",
  },
  icon: {
    width: 40, // << AJUSTE
    height: 40, // << AJUSTE
    borderRadius: 20,
    marginRight: 16, // << MUDANÇA: Espaçamento entre ícone e texto
  },
  textContainer: {
    flex: 1, // << MUDANÇA: Faz o texto ocupar o espaço disponível
  },
  bookingText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },
});