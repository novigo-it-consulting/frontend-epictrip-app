import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';


const { width: windowWidth } = Dimensions.get("window");

const FeaturedHouseCard = ({ bookings, onPress }) => {
    const cardWidth = windowWidth * 0.9; // 80% da largura da tela
    const cardMargin = 16; // Margem entre os cards
    const endPadding = 16; // Espaço no final

    const navigation = useNavigation();

    const handlePress = (booking) => {
        navigation.navigate("BookingDetails", { data: booking })
    }

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
                styles.scrollContainer,
                { paddingRight: endPadding }
            ]}
            snapToInterval={cardWidth + cardMargin}
            decelerationRate="fast"
            snapToAlignment="start"
        >
            {bookings.map((booking) => (
                <TouchableOpacity
                    key={booking.bookingId}
                    style={[styles.card, { width: cardWidth, marginRight: cardMargin }]}
                    onPress={() => handlePress(booking)}
                >
                    <Image source={{ uri: booking.housePhoto }} style={styles.image} />
                    <Text style={styles.name}>{booking.bookingName}</Text>
                    <Text style={styles.address}>
                        {booking.houseNumber} {booking.houseAddress}, {booking.houseCity}
                    </Text>
                </TouchableOpacity>
            ))}
            {/* Espaço adicional no final para melhor scroll */}
            <View style={{ width: endPadding }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingLeft: 16,
    },
    card: {
        borderRadius: 10,
        backgroundColor: "#F9F9F9",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    image: {
        width: "100%",
        height: 200,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#172B4D",
        marginHorizontal: 10,
        marginTop: 10,
    },
    address: {
        fontSize: 14,
        color: "#6B7280",
        marginHorizontal: 10,
        marginBottom: 10,
    },
});

export default FeaturedHouseCard;