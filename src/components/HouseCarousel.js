// HouseCarousel.js
import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { IconButton } from "react-native-paper";

const HouseCarousel = () => {
    const houses = [
        {
            id: 1,
            name: "House of Targeryan no. III",
            location: "North End",
            rating: 4.5,
            reviews: 342,
            imageUrl: "https://img.freepik.com/fotos-gratis/arvores-perto-de-casas-brancas_417767-97.jpg?t=st=1731096396~exp=1731099996~hmac=c902541f1047fc7eeb16561d3d9ff1eff339940dad2d787585d219ab88a84909&w=996",
        },
        {
            id: 2,
            name: "House of Targeryan no. III",
            location: "North End",
            rating: 4.5,
            reviews: 342,
            imageUrl: "https://img.freepik.com/fotos-gratis/arvores-perto-de-casas-brancas_417767-97.jpg?t=st=1731096396~exp=1731099996~hmac=c902541f1047fc7eeb16561d3d9ff1eff339940dad2d787585d219ab88a84909&w=996",
        },
    ];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainer}
            contentContainerStyle={styles.contentContainer}
        >
            {houses.map((house) => (
                <View key={house.id} style={styles.card}>
                    <Image source={{ uri: house.imageUrl }} style={styles.image} />
                    <View style={styles.textContainer}>
                        <View style={styles.header}>
                            <Text style={styles.name}>{house.name}</Text>
                            <IconButton icon="heart-outline" size={20} color="#6B7280" />
                        </View>
                        <Text style={styles.location}>{house.location}</Text>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.rating}>{house.rating}</Text>
                            <IconButton icon="star" color="#FFD700" size={18} />
                            <Text style={styles.reviews}>({house.reviews})</Text>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexDirection: "row",
        paddingLeft: 20,
    },
    contentContainer: {
        paddingRight: 20,
    },
    card: {
        width: "240pt",
        height: "256pt",
        marginRight: 15,
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
        height: 120,
    },
    textContainer: {
        padding: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#172B4D",
    },
    location: {
        fontSize: 12,
        color: "#6B7280",
        marginVertical: 5,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rating: {
        fontSize: 14,
        color: "#FFD700",
        marginRight: 5,
    },
    reviews: {
        fontSize: 12,
        color: "#6B7280",
    },
});

export default HouseCarousel;
