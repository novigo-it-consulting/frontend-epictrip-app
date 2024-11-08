// FeaturedHouseCard.js
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const FeaturedHouseCard = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image
                source={{ uri: "https://as2.ftcdn.net/v2/jpg/08/47/86/71/1000_F_847867133_DTWN3PO7iHI6XyDJx7yWgyUgJWdxO4Jk.jpg" }}
                style={styles.image}
            />
            <Text style={styles.name}>Santa Apartments</Text>
            <Text style={styles.address}>7007 Sea World Drive, Orlando</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "90%", 
        alignSelf: "center", 
        borderRadius: 10,
        backgroundColor: "#F9F9F9",
        overflow: "hidden",
        marginBottom: 20,
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
