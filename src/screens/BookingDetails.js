import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    ScrollView,
} from "react-native";
import {
    AlertNotificationRoot,
} from "react-native-alert-notification";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Entypo from '@expo/vector-icons/Entypo';
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const BookingDetails = ({ route }) => {
    const { data } = route.params;
    const navigation = useNavigation();

    // 2. Criar estados para todos os textos que precisam de tradução
    const [aboutText, setAboutText] = useState("About Your Reservation");
    const [reservationDateText, setReservationDateText] = useState("Reservation Date");
    const [checkinText, setCheckinText] = useState("Check-in:");
    const [checkoutText, setCheckoutText] = useState("Check-out:");
    const [reservationNumberText, setReservationNumberText] = useState("Reservation Number");

    // 3. useEffect para buscar todas as traduções de uma vez
    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const [
                    translatedAbout,
                    translatedReservationDate,
                    translatedCheckin,
                    translatedCheckout,
                    translatedReservationNumber,
                ] = await Promise.all([
                    translate("About Your Reservation", "en"),
                    translate("Reservation Date", "en"),
                    translate("Check-in:", "en"),
                    translate("Check-out:", "en"),
                    translate("Reservation Number", "en"),
                ]);

                setAboutText(translatedAbout);
                setReservationDateText(translatedReservationDate);
                setCheckinText(translatedCheckin);
                setCheckoutText(translatedCheckout);
                setReservationNumberText(translatedReservationNumber);

            } catch (error) {
                console.error("Falha ao buscar traduções:", error);
            }
        };
        fetchTranslations();
    }, []); // Array vazio [] garante que rode apenas uma vez

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <AlertNotificationRoot>
            <StatusBar barStyle={"light-content"} />

            <View style={styles.headerContainer}>
                <ImageBackground
                    source={{ uri: data.housePhoto }}
                    resizeMode="cover"
                    style={styles.headerImage}
                >
                    <TouchableOpacity
                        onPress={handleGoBack}
                        style={styles.backButtonContainer}
                    >
                        <IconButton
                            icon="arrow-left"
                            size={28}
                            iconColor="#fff"
                            style={styles.backButton}
                        />
                    </TouchableOpacity>
                </ImageBackground>
            </View>

            <View style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.addressSection}>
                        <View style={styles.addressTextContainer}>
                            <Text style={styles.houseName}>{data.houseName}</Text>
                            <Text style={styles.houseAddress}>
                                {data.houseNumber} {data.houseAddress}, {data.houseCity}
                            </Text>
                        </View>
                        <Entypo name="location-pin" size={24} color="#6C798F" />
                    </View>

                    <View style={styles.detailsSection}>
                        {/* 4. Usar os estados com os textos traduzidos */}
                        <Text style={styles.sectionTitle}>
                            {aboutText}
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            {reservationDateText}
                        </Text>

                        <View style={styles.dateContainer}>
                            <View style={styles.dateRow}>
                                <Text style={styles.dateLabel}>{checkinText}</Text>
                                <View style={styles.dateBox}>
                                    <Text style={styles.dateText}>
                                        {formatDate(data.checkIn)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.dateRow}>
                                <Text style={styles.dateLabel}>{checkoutText}</Text>
                                <View style={styles.dateBox}>
                                    <Text style={styles.dateText}>
                                        {formatDate(data.checkOut)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.reservationNumberSection}>
                            <Text style={styles.sectionSubtitle}>
                                {reservationNumberText}
                            </Text>
                            <Text style={styles.reservationNumber}>
                                {data.shareNumber}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </AlertNotificationRoot>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 300,
        width: '100%',
    },
    headerImage: {
        flex: 1,
        width: '100%',
    },
    backButtonContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    backButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 20,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        paddingTop: 30,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    addressSection: {
        flexDirection: "row",
        paddingHorizontal: 30,
        paddingBottom: 30,
        borderBottomColor: "#F1F5F6",
        borderBottomWidth: 6,
        alignItems: 'flex-end',
    },
    addressTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    houseName: {
        color: "#000",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 6,
    },
    houseAddress: {
        color: "#000",
        fontSize: 16,
    },
    detailsSection: {
        paddingHorizontal: 30,
        marginTop: 30,
    },
    sectionTitle: {
        color: "#000",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    sectionSubtitle: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    dateContainer: {
        marginTop: 10,
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    dateLabel: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
        width: 100,
    },
    dateBox: {
        backgroundColor: "#F1F5F6",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flex: 1,
    },
    dateText: {
        color: "#364764",
        fontSize: 16,
    },
    reservationNumberSection: {
        marginTop: 30,
    },
    reservationNumber: {
        color: "#6C798F",
        fontSize: 16,
        marginTop: 5,
    },
});

export default BookingDetails;