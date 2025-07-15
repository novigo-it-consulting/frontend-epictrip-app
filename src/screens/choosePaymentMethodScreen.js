import React, { useState, useEffect } from "react";
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
import { useTranslation } from "react-i18next";
import GoBackArrow from "../components/GoBackArrow";
import { requestGetPaymentMethodsByUser } from "../services/api"; // Supondo que exista essa função
import AsyncStorage from "@react-native-async-storage/async-storage";

const SelectPaymentScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaying, setIsPaying] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Valores de exemplo, você pode recebê-los via props ou estado
    const totalProducts = 100;
    const totalTax = 10;
    const totalAmount = totalProducts + totalTax;

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                if (userId) {
                    const response = await requestGetPaymentMethodsByUser(userId);
                    if (response.status === 200) {
                        setCards(response.data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch cards:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCards();
    }, []);

    const handlePay = () => {
        setIsPaying(true);
        setModalVisible(true);

        setTimeout(() => {
            setIsPaying(false);
            const isApproved = Math.random() > 0.5; // Simulação de aprovação/rejeição
            setPaymentResult(isApproved ? "approved" : "rejected");
        }, 2000);
    };

    const closeModal = () => {
        setModalVisible(false);
        setPaymentResult(null);
    };

    const returnToRequestScreen = () => {
        closeModal();
        navigation.navigate("RequestScreen");
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0057FF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <GoBackArrow />
                    <Text style={styles.title}>{t('selectPaymentScreen.title')}</Text>
                    <View style={{ width: 24 }} />
                </View>

                <Text style={styles.sectionTitle}>{t('selectPaymentScreen.savedCards')}</Text>

                {cards.map((card) => (
                    <View key={card.id}>
                        <TouchableOpacity
                            style={styles.cardContainer}
                            onPress={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
                        >
                            <View style={styles.cardIconWrapper}>
                                <Ionicons name="card-outline" size={24} color="#6C757D" />
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardName}>{card.cardName}</Text>
                                <Text style={styles.cardLast4}>**** {card.cardNumber.slice(-4)}</Text>
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
                                    <Text style={styles.paymentLabel}>{t('selectPaymentScreen.totalProducts')}</Text>
                                    <Text style={styles.paymentAmount}>$ {totalProducts.toFixed(2)}</Text>
                                </View>
                                <View style={styles.paymentRow}>
                                    <Text style={styles.paymentLabel}>{t('selectPaymentScreen.totalTax')}</Text>
                                    <Text style={styles.paymentAmount}>$ {totalTax.toFixed(2)}</Text>
                                </View>
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalText}>{t('selectPaymentScreen.totalAmount')}</Text>
                                    <Text style={styles.totalAmount}>$ {totalAmount.toFixed(2)}</Text>
                                </View>
                                <TouchableOpacity style={styles.payButton} onPress={handlePay}>
                                    <Text style={styles.payButtonText}>{t('selectPaymentScreen.payButton')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}

                <TouchableOpacity style={styles.addCardButton} onPress={() => navigation.navigate('ChangePaymentCard')}>
                    <Text style={styles.addCardText}>{t('selectPaymentScreen.addCardButton')}</Text>
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
                        {isPaying ? (
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
                                    {paymentResult === "approved"
                                        ? t('selectPaymentScreen.modal.approvedTitle')
                                        : t('selectPaymentScreen.modal.rejectedTitle')}
                                </Text>

                                <Text style={styles.modalText}>
                                    {paymentResult === "approved"
                                        ? t('selectPaymentScreen.modal.approvedMessage')
                                        : t('selectPaymentScreen.modal.rejectedMessage')}
                                </Text>

                                <TouchableOpacity style={styles.returnButton} onPress={returnToRequestScreen}>
                                    <Text style={styles.returnButtonText}>{t('selectPaymentScreen.modal.returnButton')}</Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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