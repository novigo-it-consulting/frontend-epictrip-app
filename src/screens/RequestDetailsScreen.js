import React from "react";
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
import colors from "../colors";

const STATUS_MAPPING = {
    OPEN_N1: "In progress",
    OPEN_N2: "In progress",
    OPEN_N3: "In progress",
    SOLVED_N1: "Done",
    SOLVED_N2: "Done",
    PAYMENT_A: "Waiting payment",
    PAYMENT_D: "Paid",
    CLOSED: "Unrealized",
};

const STATUS_COLORS = {
    "In progress": "#0057FF",
    "Done": "#6C757D",
    "Waiting payment": "#FFA500",
    "Paid": "#28A745",
    "Unrealized": "#DC3545",
};

const STATUS_ICONS = {
    "In progress": "time-outline",
    "Done": "checkmark-circle-outline",
    "Waiting payment": "card-outline",
    "Paid": "cash-outline",
    "Unrealized": "close-circle-outline",
};

const RequestDetailsScreen = ({ route }) => {
    const request = route?.params?.request || {};
    const statusLabel = STATUS_MAPPING[request.status] || "Unknown";
    const statusColor = STATUS_COLORS[statusLabel] || "gray";
    const statusIcon = STATUS_ICONS[statusLabel] || "help-circle-outline";
    const showPaymentSection = request?.status === "PAYMENT_A";

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <GoBackArrow />
                    <Text style={styles.title}>{request.title || "Request Details"}</Text>
                    <Ionicons name="close" size={24} color="gray" />
                </View>

                <View style={styles.statusContainer}>
                    <View style={styles.statusWrapper}>
                        <Ionicons name={statusIcon} size={20} color={statusColor} style={styles.statusIcon} />
                        <Text style={[styles.status, { color: statusColor }]}>{statusLabel}</Text>
                    </View>
                    <Text style={styles.date}>{request.date || "Date not available"}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Request</Text>
                    <Text style={styles.subTitle}>My message</Text>
                    <Text style={styles.message}>We want barbecue for 6 people with utensils, proper grill and meat included.</Text>
                    <Text style={styles.subTitle}>Operator message</Text>
                    <Text style={styles.message}>Confirming the order, the grill and utensils will be prepared and sent to the house. Delivery forecast for June 25.</Text>
                    <Text style={styles.chatLink}>See in chat</Text>
                </View>

                {showPaymentSection && (
                    <View style={styles.paymentSection}>
                        <Text style={styles.sectionTitle}>Payment</Text>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>Total</Text>
                            <Text style={styles.totalAmount}>$ 65</Text>
                        </View>
                        <TouchableOpacity style={styles.paymentButton}>
                            <Text style={styles.paymentButtonText}>Select payment method</Text>
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
    subTitle: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 12,
    },
    message: {
        fontSize: 14,
        color: "gray",
    },
    chatLink: {
        color: "#0057FF",
        marginTop: 8,
    },
    paymentSection: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 16,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { height: 2 },
    },
    paymentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    paymentItem: {
        fontSize: 16,
    },
    paymentAmount: {
        fontSize: 16,
        fontWeight: "bold",
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
