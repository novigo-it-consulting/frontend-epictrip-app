import React from "react";
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
import colors from "../colors";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Entypo from '@expo/vector-icons/Entypo';

const { width } = Dimensions.get("window");

const BookingDetails = ({ route }) => {
    const { data } = route.params;
    const { t } = useTranslation();
    const navigation = useNavigation();

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

            {/* Header com imagem e botão de voltar */}
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

            {/* Conteúdo principal */}
            <View style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Seção de endereço */}
                    <View style={styles.addressSection}>
                        <View style={styles.addressTextContainer}>
                            <Text style={styles.houseName}>{data.houseName}</Text>
                            <Text style={styles.houseAddress}>
                                {data.houseNumber} {data.houseAddress}, {data.houseCity}
                            </Text>
                        </View>
                        <Entypo name="location-pin" size={24} color="#6C798F" />
                    </View>

                    {/* Seção de detalhes da reserva */}
                    <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>
                            {t("bookingScreen.aboutReservation")}
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            {t("bookingScreen.reservationDate")}
                        </Text>

                        <View style={styles.dateContainer}>
                            <View style={styles.dateRow}>
                                <Text style={styles.dateLabel}>Check-in:</Text>
                                <View style={styles.dateBox}>
                                    <Text style={styles.dateText}>
                                        {formatDate(data.checkIn)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.dateRow}>
                                <Text style={styles.dateLabel}>Check-out:</Text>
                                <View style={styles.dateBox}>
                                    <Text style={styles.dateText}>
                                        {formatDate(data.checkOut)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.reservationNumberSection}>
                            <Text style={styles.sectionSubtitle}>
                                {t("bookingScreen.reservationNumber")}
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