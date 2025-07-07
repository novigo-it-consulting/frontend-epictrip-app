import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GoBackArrow from "../components/GoBackArrow";
import { useNavigation } from "@react-navigation/native";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

// Mapeia o status da API para uma chave consistente
const STATUS_KEYS = {
    OPEN_N1: "inProgress",
    OPEN_N2: "inProgress",
    OPEN_N3: "inProgress",
    SOLVED_N1: "done",
    SOLVED_N2: "done",
    PAYMENT_A: "waitingPayment",
    PAYMENT_D: "paid",
    CLOSED: "unrealized",
};

// Usa as chaves consistentes para cores e ícones
const STATUS_STYLES = {
    inProgress: { color: "#0057FF", icon: "time-outline" },
    done: { color: "#6C757D", icon: "checkmark-circle-outline" },
    waitingPayment: { color: "#FFA500", icon: "card-outline" },
    paid: { color: "#28A745", icon: "cash-outline" },
    unrealized: { color: "#DC3545", icon: "close-circle-outline" },
    unknown: { color: "gray", icon: "help-circle-outline" },
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", weekday: "short" };
    return date.toLocaleDateString("en-US", options).replace(",", "");
};

const RequestDetailsScreen = ({ route }) => {
    const request = route?.params?.request || {};
    const navigation = useNavigation();

    // 2. Criar um estado para armazenar os textos traduzidos
    const [t, setT] = useState({
        requestDetails: "Request Details",
        dateNotAvailable: "Date not available",
        requestTitle: "Request",
        paymentTitle: "Payment",
        total: "Total",
        selectPaymentMethod: "Select payment method",
        // Statuses
        inProgress: "In progress",
        done: "Done",
        waitingPayment: "Waiting payment",
        paid: "Paid",
        unrealized: "Unrealized",
        unknown: "Unknown",
    });

    // 3. useEffect para buscar as traduções
    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const [
                    requestDetails, dateNotAvailable, requestTitle, paymentTitle, total, selectPaymentMethod,
                    inProgress, done, waitingPayment, paid, unrealized, unknown
                ] = await Promise.all([
                    translate("Request Details", "en"),
                    translate("Date not available", "en"),
                    translate("Request", "en"),
                    translate("Payment", "en"),
                    translate("Total", "en"),
                    translate("Select payment method", "en"),
                    translate("In progress", "en"),
                    translate("Done", "en"),
                    translate("Waiting payment", "en"),
                    translate("Paid", "en"),
                    translate("Unrealized", "en"),
                    translate("Unknown", "en"),
                ]);
                setT({
                    requestDetails, dateNotAvailable, requestTitle, paymentTitle, total, selectPaymentMethod,
                    inProgress, done, waitingPayment, paid, unrealized, unknown
                });
            } catch (error) {
                console.error("Falha ao buscar traduções:", error);
            }
        };
        fetchTranslations();
    }, []);

    const statusKey = STATUS_KEYS[request.status] || "unknown";
    const statusStyle = STATUS_STYLES[statusKey];
    const statusLabel = t[statusKey];
    const showPaymentSection = request?.status === "PAYMENT_A";

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <GoBackArrow />
                    {/* 4. Usar os textos traduzidos */}
                    <Text style={styles.title}>{request.title || t.requestDetails}</Text>
                    <Ionicons name="close" size={24} color="gray" />
                </View>

                <View style={styles.statusContainer}>
                    <View style={styles.statusWrapper}>
                        <Ionicons name={statusStyle.icon} size={20} color={statusStyle.color} style={styles.statusIcon} />
                        <Text style={[styles.status, { color: statusStyle.color }]}>{statusLabel}</Text>
                    </View>
                    <Text style={styles.date}>{formatDate(request.created_at) || t.dateNotAvailable}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t.requestTitle}</Text>
                    <Text style={styles.message}>{request.ai_resume}</Text>
                </View>

                {showPaymentSection && (
                    <View style={styles.paymentSection}>
                        <Text style={styles.sectionTitle}>{t.paymentTitle}</Text>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>{t.total}</Text>
                            <Text style={styles.totalAmount}>$ 65</Text>
                        </View>
                        <TouchableOpacity style={styles.paymentButton} onPress={() => navigation.navigate("SelectPaymentScreen")}>
                            <Text style={styles.paymentButtonText}>{t.selectPaymentMethod}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
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
        fontSize: 22,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
    statusContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    statusWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    statusIcon: {
        marginRight: 6,
    },
    status: {
        fontSize: 16,
        fontWeight: "600",
    },
    date: {
        fontSize: 14,
        color: "gray",
    },
    section: {
        backgroundColor: "#F8F9FC",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: "gray",
        lineHeight: 20,
    },
    paymentSection: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 16,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { height: 2, width: 0 },
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: "#EDEDED",
    },
    totalText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: "bold",
    },
    paymentButton: {
        backgroundColor: "#0057FF",
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 16,
        alignItems: "center",
    },
    paymentButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default RequestDetailsScreen;