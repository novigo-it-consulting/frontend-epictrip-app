import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestGetMethodsByUser, requestDeletePaymentMethod } from "../services/api";
import { useTranslation } from "react-i18next";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const PaymentScreen = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();
  const navigation = useNavigation();

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

  const handleEditPress = async (cardId) => {
    await AsyncStorage.setItem("cardId", cardId);
    navigation.navigate("UpdateCard");
  };

  const fetchCards = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await requestGetMethodsByUser(userId);
      if (response.status == 200 || response.status == 201) {
        setCards(response.data.data);
      } else {
        console.error("Unexpected response format:", response.data);
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Unexpected response format. Please try again.",
        });
      }
    } catch (error) {
      if (error == 'AxiosError: Request failed with status code 404') {
        await setCards([])
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t("paymentScreen.noCardsFound"),
          textBody: t("paymentScreen.noCardsFound"),
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t("paymentScreen.errorNotification"),
          textBody: t("paymentScreen.errorCards"),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getRandomDarkColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    // Darken the color by reducing the brightness
    let c = color.substring(1); // strip #
    let rgb = parseInt(c, 16); // convert rrggbb to decimal
    let r = (rgb >> 16) & 0xff; // extract red
    let g = (rgb >> 8) & 0xff; // extract green
    let b = (rgb >> 0) & 0xff; // extract blue

    r = Math.floor(r * 0.5);
    g = Math.floor(g * 0.5);
    b = Math.floor(b * 0.5);

    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  const handleGoBack = () => {
    navigation.navigate("ProfileScreen");
  };

  const handleDeleteCard = async (cardId) => {
    try {
      const response = await requestDeletePaymentMethod(cardId);
      if (response.status === 200) {
        setCards((prevCards) => prevCards.filter((card) => card.methodId !== cardId));
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: t("paymentScreen.cardDeleted"),
          textBody: t("paymentScreen.cardDeletedSuccessfully"),
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t("paymentScreen.deleteError"),
          textBody: t("paymentScreen.errorDeletingCard"),
        });
      }
    } catch (error) {
      console.error("Erro ao deletar o cartão:", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t("paymentScreen.deleteError"),
        textBody: t("paymentScreen.errorDeletingCard"),
      });
    }
  };

  const formatCardNumber = (number) => {
    return "**** **** **** " + number.slice(-4);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCards();
    });
    return unsubscribe;
  }, [navigation, cards, console.log(cards)]);

  return (
    <AlertNotificationRoot
      toastConfig={defaultToastConfig}
      colors={[lightColors]}
      theme={"light"}
    >
      <View style={styles.containerAlpha}>
        {loading ? (
          <ActivityIndicator size="medium" color={colors.primary} />
        ) : (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleGoBack}>
                <IconButton
                  style={{ marginLeft: -15 }}
                  icon={"arrow-left-thin"}
                  size={30}
                />
              </TouchableOpacity>
              <Text style={styles.title}>{t("paymentScreen.title")}</Text>
            </View>
            {/* Comentario apenas para ver se a mudança sobe */}
            {cards == [] || cards.length <= 0  ? (
              <View style={styles.noCardsView}>
                <Text style={styles.noCardsText}>{t("paymentScreen.yourCards")}</Text>
                <TouchableOpacity
                  
                  style={styles.addButton}
                  onPress={() => navigation.navigate("ChangePaymentScreen")}
                >
                  <Text style={styles.addButtonText}>{t("paymentScreen.addCard")}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Carousel
                  loop={cards.length > 1}
                  width={width * 0.9}
                  height={height * 0.3}
                  data={cards}
                  scrollAnimationDuration={1000}
                  renderItem={({ index }) => (
                    <View style={styles.carouselContent}>
                      <View
                        style={[
                          styles.creditCard,
                          { backgroundColor: getRandomDarkColor() },
                        ]}
                      >
                        <View style={styles.creditAndVisaView}>
                          <Image
                            style={styles.cardLogo}
                            source={
                              cards[index].cardType === "visa"
                                ? require("../../assets/creditCard/visa.png")
                                : require("../../assets/creditCard/mastercard.png")
                            }
                          />
                          <View style={styles.optionsView}>
                            <TouchableOpacity
                              onPress={() => handleEditPress(cards[index].methodId)}
                            >
                              <IconButton
                                iconColor={"#fff"}
                                icon={"credit-card-edit-outline"}
                                size={20}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleDeleteCard(cards[index].methodId)}
                            >
                              <IconButton
                                iconColor={"#fff"}
                                icon={"trash-can-outline"}
                                size={20}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={styles.cardDetailsView}>
                          <Text style={styles.creditText}>
                            {cards[index].cardName || "No Name"}
                          </Text>
                          <Text style={styles.cardDetailsText}>
                            {formatCardNumber(cards[index].cardNumber) || "**** **** **** ****"}
                          </Text>
                        </View>
                        <Text style={styles.expiryText}>
                          {cards[index].cardExpiration || "MM/YY"}
                        </Text>
                      </View>
                    </View>
                  )}
                />
                <View style={styles.noCardsView}>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate("ChangePaymentScreen")}
                  >
                    <Text style={styles.addButtonText}>Adicionar Cartão</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        )}
      </View>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  containerAlpha: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginRight: "auto",
    marginLeft: "auto",
    backgroundColor: colors.backGroundLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "85%",
    marginTop: 50,
    marginBottom: 50,
  },
  title: {
    fontSize: 33,
    fontWeight: "bold",
  },
  creditCard: {
    width: "100%",
    height: height * 0.25,
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
  containerBackButton: {
    backgroundColor: "red",
    width: 100,
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
  optionsView: {
    flexDirection: "row",
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
    height: "100%",
  },
  noCardsView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
    marginTop: "100%"
  },
  noCardsText: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: "10%",
  },
  addButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    width: "80%",
    flexDirection: "column",
    alignItems: "center",
    bottom: 0,
    position: "relative",
    justifyContent: "flex-end"
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default PaymentScreen;
