import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { IconButton } from "react-native-paper";
import SearchBarHome from "../components/SearchViewHome";
import FeaturedHouseCard from "../components/FeaturedHouseCard";
import HouseCarousel from "../components/HouseCarousel";
import FooterNavBar from "../components/FooterNavBar";
import { requestGetBookingByUser, requestGetHousesByBooking } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookingScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [inactiveBookings, setInactiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
            bookingStatus: booking.status,
            bookingName: booking.bookingName,
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
        // setBookings(activeBookingsList);
        // setInactiveBookings(inactiveBookingsList);
      } else {
        console.error("ID do usuário não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
    } finally {
      await console.log("bookings: ", bookings)
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
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ marginBottom: 20, fontSize: 16 }}>Carregando suas reservas...</Text>
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

        <Text style={styles.title}>Bookings</Text>

        <View style={styles.searchBarContainer}>
          <SearchBarHome />
        </View>

        <FeaturedHouseCard bookings={bookings} onPress={() => getBookings()} />

        <Text style={styles.subtitle}>Latest bookings</Text>

        <HouseCarousel bookings={inactiveBookings} />

        <View style={styles.bottomSpace} />
      </ScrollView>

      <FooterNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE",
    paddingTop: 30,
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
