import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import Carousel from "react-native-reanimated-carousel";
import "react-native-gesture-handler";
import colors from "../colors";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Card, Title, Paragraph, Searchbar } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import { requestGetBookingByUser, requestGetHousesByBooking } from "../services/api";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTabBar from "../components/CustomBar";
import ExploreCategories from "../components/ExploreCategories";
import { categorieData } from "../data/categorieData";
import ExperiencesCategorie from "../components/ExperiencesCategorie";
import SearchBarHome from "../components/SearchViewHome";


const PlacesScreen = () => {

    const { t } = useTranslation();
    const navigation = useNavigation();




    const handleGoBack = () => {
        navigation.goBack();
    };
    const latestHouse = [
        { housePhoto: 'https://example.com/house1.jpg', houseName: 'House 1', address: '123 Main St', number: '1', neighbourhood: 'Downtown', city: 'City', country: 'Country' },
        { housePhoto: 'https://example.com/house2.jpg', houseName: 'House 2', address: '456 Elm St', number: '2', neighbourhood: 'Uptown', city: 'City', country: 'Country' },
    ];

    const renderCardItem = (item) => (
        <View style={stylesPayment.cardContainer}>
            <Card style={stylesPayment.card}>
                <Card.Cover source={{ uri: item.housePhoto }} style={stylesPayment.cardImage} />
                <Card.Content>
                    <Title style={stylesPayment.cardTitle}>{item.houseName}</Title>
                    <Paragraph style={stylesPayment.cardParagraph}>
                        <Icon name="location-outline" size={15} color="#000" />{' '}
                        ${item.address}, ${item.number}, ${item.neighbourhood}, ${item.city}, ${item.country}
                    </Paragraph>
                </Card.Content>
            </Card>
        </View>
    );


    return (

        <View style={stylesPayment.header}>
            <TouchableOpacity onPress={handleGoBack}>
                <IconButton
                    style={{ marginLeft: -15 }}
                    icon={"arrow-left-thin"}
                    size={30}
                />
            </TouchableOpacity>
            <Text style={stylesPayment.title}>{t("Experiences")}</Text>
            <SearchBarHome />
            <ExperiencesCategorie />
            <View style={stylesPayment.verticalContainer}>
                {latestHouse.map((house, index) => (
                    <View key={index} style={stylesPayment.cardWrapper}>
                        {renderCardItem(house)}
                    </View>
                ))}
            </View>
        </View>
        

    );
};

const stylesPayment = StyleSheet.create({
    
    containerAlpha: {
        flex: 0.9,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        marginRight: "auto",
        marginLeft: "auto",
        backgroundColor: colors.backGroundLight,
    },
    header: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
        marginTop: 30,
        marginBottom: 20,
    },
    title: {
        fontSize: 33,
        fontWeight: "bold",
    },
    carouselContent: {
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
    },
    containerBooking: {
        width: "100%",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
        flex: 1,
    },
    noCardsView: {
        justifyContent: "center",
        alignItems: "center",
        flex: 0.3,
        width: "100%",
    },
    noCardsText: {
        fontSize: 18,
        fontWeight: "400",
    },
    addButton: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 10,
        width: "50%",
        alignItems: "center",
        marginTop: 50
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
        width: "100%",
        marginRight: 10,
    },
    image: {
        height: 120,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderEndStartRadius: 0,
        borderEndEndRadius: 0,
    },
    titleCard: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "left",
        color: "#172B4D",
    },
    description: {
        textAlign: "left",
        color: "#6C798F",
        fontSize: 14,
    },
    noBookingsText: {
        fontSize: 33,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
    },
    latestBookingsText: {
        fontSize: 18,
        flex: 0.1,
        width: "100%",
        fontWeight: "bold",
    },
});

export default PlacesScreen;
