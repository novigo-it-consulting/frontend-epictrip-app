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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../colors";
import { requestGetMethodsByUser, requestDeletePaymentMethod } from "../services/api";
import CustomTabBar from "../components/CustomBar";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const PaymentScreen = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const fetchCards = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      const response = await requestGetMethodsByUser(userId);
      if (response.status === 200 || response.status === 201) {
        setCards(response.data.data);
      }
    } catch (error) {
      if (error.message.includes('404')) {
        setCards([]);
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t('paymentScreen.errorNotification'),
          textBody: t('paymentScreen.errorCards'),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCards();
    }, [])
  );

  const handleEditPress = async (cardId) => {
    await AsyncStorage.setItem("cardId", cardId);
    navigation.navigate("UpdateCard");
  };

  const handleDeleteCard = async (cardId) => {
    try {
      const response = await requestDeletePaymentMethod(cardId);
      if (response.status === 200) {
        setCards((prevCards) => prevCards.filter((card) => card.methodId !== cardId));
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: t('paymentScreen.cardDeleted'),
        });
      } else {
        throw new Error('Deletion failed');
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('paymentScreen.deleteError'),
        textBody: t('paymentScreen.errorDeletingCard'),
      });
    }
  };

  const formatCardNumber = (number) => {
    return number ? "**** **** **** " + number.slice(-4) : "**** **** **** ****";
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

  const handleGoBack = () => {
    navigation.navigate("ProfileScreen");
  };

  return (
    <AlertNotificationRoot theme={"light"}>
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
              <Text style={styles.title}>{t('paymentScreen.title')}</Text>
            </View>

            {!cards || cards.length === 0 ? (
              <View style={styles.noCardsView}>
                <Text style={styles.noCardsText}>{t('paymentScreen.yourCards')}</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => navigation.navigate("ChangePaymentScreen")}
                >
                  <Text style={styles.addButtonText}>{t('paymentScreen.addCard')}</Text>
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
                  renderItem={({ item }) => (
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
                              item.cardType === "visa"
                                ? require("../../assets/creditCard/visa.png")
                                : require("../../assets/creditCard/mastercard.png")
                            }
                          />
                          <View style={styles.optionsView}>
                            <TouchableOpacity
                              onPress={() => handleEditPress(item.methodId)}
                            >
                              <IconButton
                                iconColor={"#fff"}
                                icon={"credit-card-edit-outline"}
                                size={20}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleDeleteCard(item.methodId)}
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
                            {item.cardName || t('payment.noName')}
                          </Text>
                          <Text style={styles.cardDetailsText}>
                            {formatCardNumber(item.cardNumber)}
                          </Text>
                        </View>
                        <Text style={styles.expiryText}>
                          {`${item.cardExpiration.split("-")[1]}/${item.cardExpiration.split("-")[0]}` || t('payment.expiryPlaceholder')}
                        </Text>
                      </View>
                    </View>
                  )}
                />
                <View style={styles.addButtonContainer}>
                  <TouchableOpacity
                    style={styles.addButtonAbsolute}
                    onPress={() => navigation.navigate("ChangePaymentScreen")}
                  >
                    <Text style={styles.addButtonText}>{t('paymentScreen.addCard')}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        )}
      </View>
      <CustomTabBar />
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  containerAlpha: {
    flex: 1,
    backgroundColor: colors.backGroundLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 50,
  },
  title: {
    fontSize: 33,
    fontWeight: "bold",
    marginLeft: 10,
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
    alignItems: 'center',
    height: "100%",
  },
  noCardsView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noCardsText: {
    fontSize: 18,
    fontWeight: "400",
    textAlign: 'center',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  addButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  addButtonAbsolute: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default PaymentScreen;
