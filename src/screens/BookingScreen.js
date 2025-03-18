import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { IconButton } from "react-native-paper";
import SearchBarHome from "../components/SearchViewHome";
import FeaturedHouseCard from "../components/FeaturedHouseCard";
import HouseCarousel from "../components/HouseCarousel";
import FooterNavBar from "../components/FooterNavBar";
import { requestGetBookingByUser } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookingScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);

  // Função para buscar as reservas do usuário
  const getBookings = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId"); // Obtém o ID do usuário
      if (userId) {
        const userBookings = await requestGetBookingByUser(userId); // Chama a API
        console.log("Reservas do usuário:", userBookings);
        setBookings(userBookings); // Atualiza o estado com as reservas
      } else {
        console.error("ID do usuário não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
    }
  };

  // UseEffect para carregar as reservas quando a tela for montada
  useEffect(() => {
    getBookings();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Botão de voltar */}
        <IconButton
          icon="arrow-left"
          size={24}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />

        {/* Título da tela */}
        <Text style={styles.title}>Bookings</Text>

        {/* Barra de pesquisa */}
        <View style={styles.searchBarContainer}>
          <SearchBarHome />
        </View>

        {/* Card de destaque com ação para buscar reservas */}
        <FeaturedHouseCard onPress={() => getBookings()} />

        {/* Subtítulo para as últimas reservas */}
        <Text style={styles.subtitle}>Latest bookings</Text>

        {/* Carrossel de casas */}
        <HouseCarousel data={bookings} />

        {/* Espaço extra no final para evitar cortes */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Barra de navegação inferior */}
      <FooterNavBar />
    </View>
  );
};

// Estilos da tela
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
  searchBarContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#172B4D",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  bottomSpace: {
    height: 100,
  },
});

export default BookingScreen;