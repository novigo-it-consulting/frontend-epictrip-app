import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
  StyleSheet,
} from "react-native";
import {
  Button,
  Provider as PaperProvider,
  DefaultTheme,
  ActivityIndicator,
} from "react-native-paper";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel";
import colors from "../colors";
import styles from "../styles/globalScreen";
import { requestPayment, requestGetMethodsByUser } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { IconButton } from "react-native-paper";
import CustomTabBar from "../components/CustomBar";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const Payment = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState(null);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const formatCardNumber = (number) => {
    return "**** **** **** " + number.slice(-4);
  };


  const getRandomDarkColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    let c = color.substring(1);
    let rgb = parseInt(c, 16);
    let r = (rgb >> 16) & 0xff;
    let g = (rgb >> 8) & 0xff;
    let b = (rgb >> 0) & 0xff;

    r = Math.floor(r * 0.5);
    g = Math.floor(g * 0.5);
    b = Math.floor(b * 0.5);

    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  const fetchCards = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await requestGetMethodsByUser(userId);
      if (response.status === 200) {
        setCards(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedMethodId(response.data.data[0].methodId);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [navigation]);


  const handlePayment = async () => {
    if (!selectedMethodId) return;
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      const amount = "0.1";

      const response = await requestPayment(userId, selectedMethodId, amount);
      if (response.code === "CREATED" || response.status === 201) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Payment successful!",
        });
        setTimeout(() => {
          navigation.goBack();
        }, 4000);
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Payment failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

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
  return (
    <AlertNotificationRoot
      toastConfig={defaultToastConfig}
      colors={[lightColors]}
      theme={"light"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 23,
              fontWeight: "bold",
              color: colors.primary,
            }}
          >
            Payment
          </Text>

          <Text
            style={{
              textAlign: "center",
              fontSize: 50,
              fontWeight: "bold",
              color: colors.primary,
              marginTop: 50,
              marginBottom: 30,
            }}
          >
            U$ 0.1
          </Text>
          <View style={stylesCard.cardView}>
            {cards != null ? (
              <Carousel
                loop={cards.length > 1}
                width={width * 0.9}
                height={height * 0.35} // Adjust the height to ensure it fits both card and button
                data={cards}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) =>
                  setSelectedMethodId(cards[index].methodId)
                }
                renderItem={({ item, index }) => (
                  <View style={stylesCard.carouselContent}>
                    <View
                      style={[
                        stylesCard.creditCard,
                        { backgroundColor: getRandomDarkColor() },
                      ]}
                    >
                      <View style={stylesCard.creditAndVisaView}>
                        <Image
                          style={stylesCard.cardLogo}
                          source={
                            item.cardType === "visa"
                              ? require("../../assets/creditCard/visa.png")
                              : require("../../assets/creditCard/mastercard.png")
                          }
                        />
                      </View>
                      <View style={stylesCard.cardDetailsView}>
                        <Text style={stylesCard.creditText}>
                          {item.cardName || "No Name"}
                        </Text>
                        <Text style={stylesCard.cardDetailsText}>
                          {formatCardNumber(item.cardNumber) ||
                            "**** **** **** ****"}
                        </Text>
                      </View>
                      <Text style={stylesCard.expiryText}>
                        {item.cardExpiration || "MM/YY"}
                      </Text>
                    </View>
                  </View>
                )}
              />
            ) : null}
          </View>
          <Button
            mode="contained"
            onPress={handlePayment}
            style={stylesCard.addButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              "Make Payment"
            )}
          </Button>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <CustomTabBar />
    </AlertNotificationRoot>
  );
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
  },
};

const stylesCard = StyleSheet.create({
  cardView: {
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  containerBackButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    display: "flex",
    position: "relative",
    flexDirection: "row",
  },
  creditCard: {
    width: "95%",
    height: "70%", // Adjusted to allow space for the button
    borderRadius: 15,
    padding: 22,
    justifyContent: "space-between",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  creditAndVisaView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  creditText: {
    color: "#FFFFFF",
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: "bold",
  },
  cardLogo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  cardDetailsView: {
    flexDirection: "column",
  },
  cardDetailsText: {
    color: "#FFFFFF",
    fontSize: 14,
    letterSpacing: 2,
    paddingTop: "2.5%",
    fontWeight: "400",
  },
  expiryText: {
    color: "#FFFFFF",
    fontSize: 14,
    letterSpacing: 2,
    textAlign: "right",
  },
  carouselContent: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingBottom: 10,
  },
  addButton: {
    marginTop: -40,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
});

export default Payment;
