import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { IconButton } from "react-native-paper";
import SearchBarHome from "../components/SearchViewHome";
import FeaturedHouseCard from "../components/FeaturedHouseCard";
import CustomTabBar from "../components/CustomBar";
import HouseCarousel from "../components/HouseCarousel";
import { requestGetBookingByUser, requestGetHousesByBooking } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
// 1. Importar o hook de tradução
import { useTranslation } from "react-i18next";

const BookingScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [inactiveBookings, setInactiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  // 2. Inicializar o hook para obter a função 't'
  const { t } = useTranslation();

  const getBookings = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const activeBookingsList = [];
        const inactiveBookingsList = [];
        const userBookings = await requestGetBookingByUser(userId);

        for (const booking of userBookings) {
          const houseBooking = await requestGetHousesByBooking(booking.houseId);
          const listObj = {
            bookingId: booking.bookingId,
            // ATENÇÃO: Status mantido original para a lógica funcionar corretamente
            bookingStatus: booking.status,
            bookingName: booking.bookingName, // Nome também mantido original
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            shareNumber: booking.shareNumber,
            houseName: houseBooking.houseName,
            housePhoto: houseBooking.housePhoto,
            houseAddress: houseBooking.address,
            houseNumber: houseBooking.number,
            houseNeighbourhood: houseBooking.neighbourhood,
            houseCity: houseBooking.city,
            houseState: houseBooking.state,
            houseCountry: houseBooking.country,
            houseZip: houseBooking.zipCode,
            houseDoorCode: houseBooking.houseDoorCode,
            condoGateCode: houseBooking.condoGateCode,
          };

          // A lógica agora compara com o valor original vindo da API
          if (listObj.bookingStatus === "Active" || listObj.bookingStatus === "Incoming") {
            activeBookingsList.push(listObj);
          } else {
            inactiveBookingsList.push(listObj);
          }
        }
        return {
          active: activeBookingsList,
          inactive: inactiveBookingsList
        };
      } else {
        console.error("ID do usuário não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      const bks = await getBookings();
      if (bks) {
        setBookings(bks.active);
        setInactiveBookings(bks.inactive);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* 3. Usar a função 't' com a chave de tradução */}
        <Text style={styles.loadingText}>{t('bookingScreen.loading')}</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <IconButton
          icon="arrow-left"
          size={24}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />

        {/* 3. Usar a função 't' com a chave de tradução */}
        <Text style={styles.title}>{t('bookingScreen.title')}</Text>

        <View style={styles.searchBarContainer}>
          <SearchBarHome />
        </View>

        <FeaturedHouseCard bookings={bookings} onPress={() => getBookings()} />

        {/* 3. Usar a função 't' com a chave de tradução */}
        <Text style={styles.subtitle}>{t('bookingScreen.latestBookings')}</Text>

        <HouseCarousel bookings={inactiveBookings} />

        <View style={styles.bottomSpace} />
      </ScrollView>

      <CustomTabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE",
    paddingTop: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loadingText: {
    marginBottom: 20,
    fontSize: 16
  },
  scrollContent: {
    paddingBottom: 100,
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 10,
    marginLeft: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#172B4D",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#172B4D",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  searchBarContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  bottomSpace: {
    height: 80,
  },
});

export default BookingScreen;