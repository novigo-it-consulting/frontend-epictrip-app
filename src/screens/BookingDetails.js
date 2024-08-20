import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  ScrollView,
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
import Feather from "react-native-vector-icons/Feather";
import { requestGetBookingByUser, requestGetHousesByBooking } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomTabBar from "../components/CustomBar";

const { height, width } = Dimensions.get("window");

const BookingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState("");
  const [latestHouse, setLatestHouse] = useState([]);
  const [house, setHouse] = useState([]);
  const [extendBooking, setExtendBooking] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

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

  const handleExtendBooking = () => {
    setExtendBooking(!extendBooking);
    if (!extendBooking) {
      setShowStartPicker(true);
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(false);
    setStartDate(currentDate);
    setShowEndPicker(true);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(false);
    setEndDate(currentDate);
  };

  const showDatePicker = () => {
    setShowStartPicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    if (showStartPicker) {
      const currentDate = selectedDate || startDate;
      setStartDate(currentDate);
      setShowStartPicker(false);
      setShowEndPicker(true);
    } else if (showEndPicker) {
      const currentDate = selectedDate || endDate;
      setEndDate(currentDate);
      setShowEndPicker(false);
    }
  };

  return (
    <AlertNotificationRoot
      toastConfig={defaultToastConfig}
      colors={[lightColors]}
      theme={"light"}
    >
      <StatusBar barStyle={"light-content"} />
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
            {house.map((item, index) => (
              <Carousel
                loop={true}
                key={index}
                width={width * 1.5}
                height={width / 1}
                data={latestHouse}
                mode="parallax"
                modeConfig={{
                  parallaxScrollingScale: 1,
                  parallaxScrollingOffset: 100,
                }}
                renderItem={({ item, index }) => (
                  <View key={index} style={stylesPayment.containerBooking}>
                    <ImageBackground
                      source={{ uri: item.housePhoto }}
                      resizeMode="cover"
                      style={{ height: 300, width: 600 }}
                    >
                      <View
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity onPress={handleGoBack}>
                          <IconButton
                            style={{ position: "absolute", left: -170, top: -100 }}
                            icon={"arrow-left-thin"}
                            size={30}
                            iconColor="#fff"
                          />
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                  </View>
                )}
              />
            ))}
          </>
        )}
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          width: "100%",
          flexDirection: "column",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 18,
        }}
      >
        <ScrollView contentContainerStyle={{ height: "120%" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
              alignItems: "baseline",
              paddingBottom: 50,
              borderBottomColor: "#F1F5F6",
              borderBottomWidth: 6,
              marginTop: 30,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: "80%",
                justifyContent: "flex-start",
              }}
            >
              <Text style={{ color: "#000", fontSize: 16, fontWeight: "regular" }}>
                7007 Sea World Drive, Orlando
              </Text>
            </View>
            <Feather name="map" color={"#000"} size={22} />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "80%",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                color: "#000",
                fontSize: 24,
                fontWeight: "bold",
                marginTop: 22,
                marginLeft: 30,
              }}
            >
              {t("bookingScreen.aboutReservation")}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "80%",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                color: "#000",
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 22,
                marginLeft: 30,
              }}
            >
              {t("bookingScreen.reservationDate")}
            </Text>
          </View>
          <TouchableOpacity onPress={showDatePicker}>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: "88%",
                marginLeft: 28,
                marginRight: "auto",
                justifyContent: "flex-start",
              }}
            >
              <Text
                style={{
                  paddingBottom: 16,
                  paddingTop: 16,
                  paddingLeft: 8,
                  paddingRight: 8,
                  backgroundColor: "#F1F5F6",
                  marginTop: 12,
                  borderRadius: 12,
                  color: "#364764",
                }}
              >
                {startDate.toDateString()} - {endDate.toDateString()} - 3 Guests
              </Text>
            </View>
          </TouchableOpacity>

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "80%",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                color: "#000",
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 42,
                marginLeft: 30,
              }}
            >
              {t("bookingScreen.reservationNumber")}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "80%",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                color: "#6C798F",
                fontSize: 16,
                fontWeight: "500",
                marginTop: 10,
                marginLeft: 30,
              }}
            >
              38741592
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "80%",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                color: "#000",
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 42,
                marginLeft: 30,
              }}
            >
              {t("bookingScreen.mainGroup")}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "80%",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                color: "#6C798F",
                fontSize: 16,
                fontWeight: "500",
                marginTop: 12,
                marginLeft: 30,
              }}
            >
              {t("bookingScreen.noLinkedGroup")}
            </Text>
          </View>
        </ScrollView>
        <CustomTabBar />
      </View>

      {showStartPicker && (
        <DateTimePicker
          testID="dateTimePickerStart"
          value={startDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          testID="dateTimePickerEnd"
          value={endDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </AlertNotificationRoot>
  );
};

const stylesPayment = StyleSheet.create({
  containerAlpha: {
    flex: 0.4,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginRight: "auto",
    marginLeft: "auto",
    backgroundColor: colors.backGroundLight,
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
    flex: 0.7,
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
    marginTop: 50,
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