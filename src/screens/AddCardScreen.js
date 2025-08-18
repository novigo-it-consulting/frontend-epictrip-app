import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { requestCreatePaymentMethod, requestUpdatePaymentMethod } from "../services/api";

const AddCardScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const editingCard = route.params?.card;

    const [cardNumber, setCardNumber] = useState(editingCard?.cardNumber || "");
    const [cardName, setCardName] = useState(editingCard?.cardName || "");
    const [cardExpiration, setCardExpiration] = useState(editingCard?.cardExpiration || "");
    const [cardCvv, setCardCvv] = useState(editingCard?.cardCvv || "");

    const handleAddCard = async () => {
        if (!cardNumber || !cardName || !cardExpiration || !cardCvv) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        const newCard = {
            cardNumber,
            cardName,
            cardExpiration,
            cardCvv,
        };

        try {
            if (editingCard) {
                // Edição
                await requestUpdatePaymentMethod({
                    ...editingCard,
                    ...newCard,
                });
                Alert.alert("Success", "Card updated successfully!");
            } else {
                // Adição
                await requestCreatePaymentMethod(newCard);
                Alert.alert("Success", "Card added successfully!");
            }
            navigation.navigate("WalletScreen", { refresh: true }); // <-- Troque goBack por navigate
        } catch (error) {
            console.error("Error saving card:", error);
            Alert.alert("Error", "Failed to save card. Please try again.");
        }
    };

    // Função para formatar número do cartão
    const formatCardNumber = (num) => {
        return num.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header com X à esquerda e título centralizado */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Ionicons name="close" size={28} color="#222" />
                </TouchableOpacity>
                <View style={styles.headerTitleWrapper}>
                    <Text style={styles.headerTitle}>{editingCard ? "Edit card" : "Add card"}</Text>
                </View>
            </View>

            {/* Card Modal */}
            <View style={styles.cardModal}>
                <View style={styles.cardModalContent}>
                    <Text style={styles.cardNameModal} numberOfLines={1}>
                        {cardName || "Polina J S Amaro"}
                    </Text>
                    <View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Number</Text>
                        <Text style={styles.cardNumberModal}>
                            {cardNumber
                                ? formatCardNumber(cardNumber.padEnd(16, "•"))
                                : "1234 5678 9101 2345"}
                        </Text>
                    </View>
                    <View style={styles.cardRow}>
                        <View style={styles.cardCol}>
                            <Text style={styles.cardLabel}>Month/Year</Text>
                            <Text style={styles.cardValue}>
                                {cardExpiration || "01/23"}
                            </Text>
                        </View>
                        <View style={styles.cardCol}>
                            <Text style={styles.cardLabel}>CVV</Text>
                            <Text style={styles.cardValue}>
                                {cardCvv || "123"}
                            </Text>
                        </View>
                        <View style={styles.cardCol}>
                            {/* Mastercard logo */}
                            <View style={styles.mastercardLogo}>
                                <View style={styles.mcRed} />
                                <View style={styles.mcYellow} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Card Info Form */}
            <View style={styles.formSection}>
                <Text style={styles.formTitle}>Card info</Text>
                {/* Name */}
                <View style={styles.inputWrapper}>
                    <MaterialIcons name="person-outline" size={22} color="#A0A4A8" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={cardName}
                        onChangeText={setCardName}
                        placeholderTextColor="#A0A4A8"
                    />
                </View>
                {/* Card Number */}
                <View style={styles.inputWrapper}>
                    <FontAwesome name="credit-card" size={20} color="#A0A4A8" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Card number"
                        value={cardNumber}
                        onChangeText={text => setCardNumber(text.replace(/[^0-9]/g, ""))}
                        keyboardType="numeric"
                        maxLength={16}
                        placeholderTextColor="#A0A4A8"
                    />
                </View>
                {/* Month/Year & Code */}
                <View style={styles.rowInputs}>
                    <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                        <MaterialIcons name="date-range" size={20} color="#A0A4A8" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Month/Year"
                            value={cardExpiration}
                            onChangeText={setCardExpiration}
                            placeholderTextColor="#A0A4A8"
                            maxLength={5}
                        />
                    </View>
                    <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                        <Ionicons name="lock-closed-outline" size={20} color="#A0A4A8" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Code"
                            value={cardCvv}
                            onChangeText={text => setCardCvv(text.replace(/[^0-9]/g, ""))}
                            keyboardType="numeric"
                            maxLength={4}
                            placeholderTextColor="#A0A4A8"
                        />
                    </View>
                </View>
                {/* Add Card Button */}
                <TouchableOpacity style={styles.addCardButton} onPress={handleAddCard}>
                    <Text style={styles.addCardButtonText}>
                        {editingCard ? "Save changes" : "Add card"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        marginTop: 25,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 18,
        height: 40,
        position: "relative",
    },
    closeButton: {
        width: 40,
        justifyContent: "center",
        alignItems: "flex-start",
        zIndex: 2,
    },
    headerTitleWrapper: {
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        height: "100%",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#222",
        textAlign: "center",
    },
    cardModal: {
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingVertical: 28, // aumentado
        paddingHorizontal: 22, // aumentado
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#E6E8EC",
    },
    cardModalContent: {
        width: "100%",
    },
    cardNameModal: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 18, // aumentado
    },
    cardRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18, // aumentado
    },
    cardLabel: {
        fontSize: 13,
        color: "#A0A4A8",
        marginRight: 8,
    },
    cardNumberModal: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#222",
        letterSpacing: 1,
    },
    cardCol: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
    cardValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#222",
    },
    mastercardLogo: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
    },
    mcRed: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#ED1C24",
        marginRight: -8,
        zIndex: 2,
    },
    mcYellow: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#F9B233",
        zIndex: 1,
    },
    formSection: {
        marginTop: 10,
    },
    formTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 18,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F6F7FB",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E6E8EC",
        marginBottom: 14,
        paddingHorizontal: 12,
        height: 48,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#222",
        backgroundColor: "transparent",
        paddingVertical: 0,
    },
    rowInputs: {
        flexDirection: "row",
        marginBottom: 14,
    },
    addCardButton: {
        backgroundColor: "#E9EFFF",
        borderRadius: 10,
        alignItems: "center",
        paddingVertical: 16,
        marginTop: 10,
    },
    addCardButtonText: {
        color: "#0057FF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AddCardScreen;