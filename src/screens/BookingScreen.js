import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { IconButton } from "react-native-paper";
import SearchBarHome from "../components/SearchViewHome";
import ContactCard from "../components/ContactCard";
import FeaturedHouseCard from "../components/FeaturedHouseCard";
import HouseCarousel from "../components/HouseCarousel";
import FooterNavBar from "../components/FooterNavBar";

const BookingScreen = ({ navigation }) => {
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

        <FeaturedHouseCard onPress={() => navigation.navigate("BookingDetails")} />

        <Text style={styles.subtitle}>Latest bookings</Text>
        <HouseCarousel />

        <View style={styles.bottomSpace} />
      </ScrollView>

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
