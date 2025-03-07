import React, { useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GoBackArrow from "../components/GoBackArrow";

const savedCards = [
    { id: 1, name: "Polina personal", last4: "0123" },
    { id: 2, name: "Polina Nubank", last4: "0123" },
    { id: 3, name: "John Doe 1", last4: "0123" },
];

const SelectPaymentScreen = ({ navigation }) => {
    const [selectedCard, setSelectedCard] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const totalProducts = 100;
    const totalTax = 10;
    const totalAmount = totalProducts + totalTax;

    const handlePay = () => {
        setIsLoading(true);
        setModalVisible(true);

        // Simula um tempo de carregamento
        setTimeout(() => {
            setIsLoading(false);
            const isApproved = Math.random() > 0.5;
            setPaymentResult(isApproved ? "approved" : "rejected");
        }, 2000);
    };

    const closeModal = () => {
        setModalVisible(false);
        setPaymentResult(null);
    };

    const returnToRequestScreen = () => {
        setModalVisible(false);
        navigation.navigate("RequestScreen");
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <GoBackArrow />
                    <Text style={styles.title}>Select Payment</Text>
                    <View style={{ width: 24 }} />
                </View>

                <Text style={styles.sectionTitle}>Saved cards</Text>

                {savedCards.map((card) => (
                    <View key={card.id}>
                        <TouchableOpacity
                            style={styles.cardContainer}
                            onPress={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
                        >
                            <View style={styles.cardIconWrapper}>
                                <Ionicons name="card-outline" size={24} color="#6C757D" />
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardName}>{card.name}</Text>
                                <Text style={styles.cardLast4}>**** {card.last4}</Text>
                            </View>
                            <Ionicons
                                name={selectedCard === card.id ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="gray"
                            />
                        </TouchableOpacity>

                        {selectedCard === card.id && (
                            <View style={styles.paymentSummary}>
                                <View style={styles.paymentRow}>
                                    <Text style={styles.paymentLabel}>Total Products</Text>
                                    <Text style={styles.paymentAmount}>$ {totalProducts.toFixed(2)}</Text>
                                </View>
                                <View style={styles.paymentRow}>
                                    <Text style={styles.paymentLabel}>Total Tax</Text>
                                    <Text style={styles.paymentAmount}>$ {totalTax.toFixed(2)}</Text>
                                </View>
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalText}>Total Amount</Text>
                                    <Text style={styles.totalAmount}>$ {totalAmount.toFixed(2)}</Text>
                                </View>
                                <TouchableOpacity style={styles.payButton} onPress={handlePay}>
                                    <Text style={styles.payButtonText}>Pay</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}

                <TouchableOpacity style={styles.addCardButton}>
                    <Text style={styles.addCardText}>Add new card</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#0057FF" />
                        ) : (
                            <>
                                <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
                                    <Ionicons name="close" size={24} color="#6C757D" />
                                </TouchableOpacity>

                                <Ionicons
                                    name={paymentResult === "approved" ? "checkmark-circle" : "close-circle"}
                                    size={60}
                                    color={paymentResult === "approved" ? "#4CAF50" : "#FF3B30"}
                                    style={styles.resultIcon}
                                />

                                <Text style={styles.modalTitle}>
                                    {paymentResult === "approved" ? "Payment Approved!" : "Payment Rejected!"}
                                </Text>

                                <Text style={styles.modalText}>
                                    {paymentResult === "approved"
                                        ? "Your payment was successfully processed."
                                        : "Your payment could not be processed. Please try again."}
                                </Text>

                                <TouchableOpacity style={styles.returnButton} onPress={returnToRequestScreen}>
                                    <Text style={styles.returnButtonText}>Return to Requests</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 16,
    },
    cardContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8F9FC",
        padding: 16,
        borderRadius: 8,
        marginTop: 10,
    },
    cardIconWrapper: {
        backgroundColor: "#EDEFF2",
        borderRadius: 24,
        padding: 10,
        marginRight: 12,
    },
    cardInfo: {
        flex: 1,
    },
    cardName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    cardLast4: {
        fontSize: 14,
        color: "gray",
    },
    paymentSummary: {
        backgroundColor: "#F8F9FC",
        padding: 16,
        borderRadius: 8,
        marginTop: 10,
    },
    paymentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    paymentLabel: {
        fontSize: 16,
        color: "#6C757D",
    },
    paymentAmount: {
        fontSize: 16,
        fontWeight: "bold",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#D3D3D3",
        paddingTop: 8,
    },
    totalText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0057FF",
    },
    payButton: {
        backgroundColor: "#0057FF",
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 16,
        alignItems: "center",
    },
    payButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    addCardButton: {
        backgroundColor: "#0057FF",
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
    },
    addCardText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        padding: 24,
        borderRadius: 12,
        alignItems: "center",
        width: "90%",
        maxWidth: 400,
    },
    closeIcon: {
        alignSelf: "flex-end",
        padding: 8,
    },
    resultIcon: {
        marginVertical: 16,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    modalText: {
        fontSize: 16,
        color: "#6C757D",
        textAlign: "center",
        marginBottom: 24,
    },
    returnButton: {
        backgroundColor: "#0057FF",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
    },
    returnButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default SelectPaymentScreen;