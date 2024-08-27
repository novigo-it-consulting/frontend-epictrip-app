import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  AlertNotificationRoot,
  Toast,
  ALERT_TYPE,
} from "react-native-alert-notification";
import Carousel from "react-native-reanimated-carousel";
import "react-native-gesture-handler";
import colors from "../colors";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Card, Title, Paragraph, Searchbar } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import { requestGetBookingByUser, requestGetHousesByBooking} from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTabBar from "../components/CustomBar";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const BookingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState("");
  const [latestHouse, setLatestHouse] = useState([]);
  const [house, setHouse] = useState([]);
  
  const { t } = useTranslation();
  const navigation = useNavigation();

  const getBookingByUser = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: t("profileHandleBooking.errorUserID"),
      });
      setLoading(false);
      return;
    }

    try {
      const response = await requestGetBookingByUser(userId);
      if (response.status === 200) {
        const inProgressBooking = response.data.data.filter(statusBooking => statusBooking.status === "In progress");
        const latestBookings = response.data.data.filter(statusBooking => statusBooking.status === "Finished");

        if (inProgressBooking.length > 0 && inProgressBooking[0].houseId.length > 0) {
          const houseId = inProgressBooking[0].houseId;
          setBookingId(houseId);
          if (houseId) {
            const responseHouse = await requestGetHousesByBooking(houseId);
            if (responseHouse.status === 200) {
              setHouse([responseHouse.data.data]);
            } else {
              setHouse([]);
            }
          }
        } else {
          setHouse([]);
        }

        if (latestBookings.length > 0) {
          const latestHouseData = [];
          for (const booking of latestBookings) {
            if (booking.houseId) {
              const responseHouse = await requestGetHousesByBooking(booking.houseId);
              if (responseHouse.status === 200) {
                latestHouseData.push(responseHouse.data.data);
              }
            }
          }
          setLatestHouse(latestHouseData);
        } else {
          setLatestHouse([]);
        }
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: t("profileHandleBooking.errorUserID"),
        });
        setHouse([]);
        setLatestHouse([]);
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: t("profileHandleBooking.errorProfileScreenGetUserInfo"),
      });
      setHouse([]);
      setLatestHouse([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getBookingByUser();
  }, []);

  const defaultToastConfig = {
    autoClose: 3000,
    titleStyle: { fontSize: 16, fontWeight: "bold" },
  };

  const lightColors = {
    label: "#000",
    card: "#fcfcfc",
    overlay: "#f0f0f0",
    success: "#28a745",
    danger: "rgba(255, 0, 0, 1)",
    warning: "#ffc107",
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AlertNotificationRoot
      toastConfig={defaultToastConfig}
      colors={[lightColors]}
      theme={"light"}
    >
      <View style={stylesPayment.containerAlpha}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : house === null || house.length === 0 ? (
          <View style={stylesPayment.noCardsView}>
            <Text style={stylesPayment.noBookingsText}>{t("bookingScreen.yourReservations")}</Text>
            <TouchableOpacity
              style={stylesPayment.addButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={stylesPayment.addButtonText}>{t("bookingScreen.bookButton")}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={stylesPayment.header}>
              <TouchableOpacity onPress={handleGoBack}>
                <IconButton
                  style={{ marginLeft: -15 }}
                  icon={"arrow-left-thin"}
                  size={30}
                />
              </TouchableOpacity>
              <Text style={stylesPayment.title}>{t("Booking")}</Text>
            </View>
            <Searchbar
              style={{
                width: "100%",
                backgroundColor: "#F1F5F6",
                borderRadius: 12,
              }}
              placeholder={t("searchViewHome.searchEvents")}
              onChangeText={setSearchQuery}
              value={searchQuery}
              clearIcon
            />
            {house.map((item, index) => (
              <View key={index} style={stylesPayment.containerBooking}>
                <TouchableOpacity onPress={() => navigation.navigate("BookingDetails")}>
                  <Card style={stylesPayment.card}>
                    <Card.Cover source={{uri: item.housePhoto}} style={stylesPayment.image} />
                    <Card.Content>
                      <Title style={stylesPayment.titleCard}>{item.houseName}</Title>
                      <Paragraph style={stylesPayment.neighbourhood}>
                        <Feather name="map-pin" color={"#000"} size={15} />{" "}
                        {`${item.address}, ${item.number}, ${item.neighbourhood}, ${item.city}, ${item.country}`}
                      </Paragraph>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              </View>
            ))}
            <Text style={stylesPayment.latestBookingsText}>
              {t("Latest Bookings")}
            </Text>
            <Carousel
              loop={false}
              width={width * 0.9}
              height={width / 2}
              data={latestHouse}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: 35,
              }}
              renderItem={({ item, index }) => (
                <View key={index} style={stylesPayment.containerBooking}>
                <Card style={stylesPayment.card}>
                  <Card.Cover source={{uri: item.housePhoto}} style={stylesPayment.image} />
                  <Card.Content>
                    <Title style={stylesPayment.titleCard}>{item.houseName}</Title>
                    <Paragraph style={stylesPayment.neighbourhood}>
                      <Feather name="map-pin" color={"#000"} size={15} />{" "}
                      {`${item.address}, ${item.number}, ${item.neighbourhood}, ${item.city}, ${item.country}`}
                    </Paragraph>
                  </Card.Content>
                </Card>
              </View>
              )}
            />
          </>
        )}
      </View>
      <CustomTabBar />
    </AlertNotificationRoot>
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

export default BookingScreen;
