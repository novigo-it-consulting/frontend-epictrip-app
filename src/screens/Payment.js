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
  ActivityIndicator,
} from "react-native";
import {
  Button,
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import colors from "../colors";
import styles from "../styles/globalScreen";
import { requestPayment, requestGetMethodsByUser } from "../services/api";
import CustomTabBar from "../components/CustomBar";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const formatCardNumber = (number) => {
    if (!number) return "**** **** **** ****";
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

  useEffect(() => {
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
          title: t('payment.successTitle'),
          textBody: t('payment.successMessage'),
        });
        setTimeout(() => {
          navigation.goBack();
        }, 4000);
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('payment.errorTitle'),
        textBody: t('payment.errorMessage'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertNotificationRoot theme={"light"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={stylesCard.keyboardAvoidingView}
        >
          <Text style={stylesCard.title}>
            {t('payment.titlePayment')}
          </Text>

          <Text style={stylesCard.amount}>
            U$ 0.1
          </Text>
          <View style={stylesCard.cardView}>
            {cards && cards.length > 0 ? (
              <Carousel
                loop={cards.length > 1}
                width={width * 0.9}
                height={height * 0.35}
                data={cards}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) =>
                  setSelectedMethodId(cards[index].methodId)
                }
                renderItem={({ item }) => (
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
                          {item.cardName || t('payment.noName')}
                        </Text>
                        <Text style={stylesCard.cardDetailsText}>
                          {formatCardNumber(item.cardNumber)}
                        </Text>
                      </View>
                      <Text style={stylesCard.expiryText}>
                        {item.cardExpiration || t('payment.expiryPlaceholder')}
                      </Text>
                    </View>
                  </View>
                )}
              />
            ) : (
              <View style={stylesCard.noCardContainer}>
                <Text style={stylesCard.noCardText}>{t('payment.noCards')}</Text>
              </View>
            )}
          </View>
          <Button
            mode="contained"
            onPress={handlePayment}
            style={stylesCard.addButton}
            disabled={loading || !cards || cards.length === 0}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              t('payment.buttonPayment')
            )}
          </Button>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <CustomTabBar />
    </AlertNotificationRoot>
  );
};

const stylesCard = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  amount: {
    textAlign: "center",
    fontSize: 50,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 50,
    marginBottom: 30,
  },
  cardView: {
    width: "100%",
    height: "40%", // Ajustado para melhor visualização
    justifyContent: "center",
    alignItems: "center",
  },
  creditCard: {
    width: "95%",
    height: "70%",
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
  },
  addButton: {
    marginTop: 20, // Ajustado para não sobrepor
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  noCardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  noCardText: {
    fontSize: 18,
    color: '#666'
  }
});

export default Payment;