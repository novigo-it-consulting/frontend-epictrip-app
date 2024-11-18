import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { IconButton } from "react-native-paper";
import SearchBarHome from "../components/SearchViewHome";
import ContactCard from "../components/ContactCard";
import FeaturedHouseCard from "../components/FeaturedHouseCard";
import HouseCarousel from "../components/HouseCarousel";

const BookingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Bookings</Text>
        </View>

        <View style={styles.searchBarContainer}>
          <SearchBarHome />
        </View>

        <View style={styles.featuredContainer}>
          <FeaturedHouseCard onPress={() => navigation.navigate("BookingDetails")} />
        </View>

        <Text style={styles.subtitle}>Latest bookings</Text>
        <HouseCarousel />

        <View style={styles.bottomSpace} />
      </ScrollView>

      <ContactCard />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#172B4D",
  },
  searchBarContainer: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  featuredContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#172B4D",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  bottomSpace: {
    height: 100,
  },
});

export default BookingScreen;
