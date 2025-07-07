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
import CustomTabBar from "../components/CustomBar";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const PaymentScreen = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // 2. Criar um estado para armazenar os textos traduzidos
  const [t, setT] = useState({
    wallet: "Wallet",
    noCards: "No cards...",
    addCard: "Add Card",
    noName: "No Name",
    errorTitle: "Error",
    unexpectedFormatError: "Unexpected response format. Please try again.",
    noCardsFoundError: "No cards found for this user",
    fetchError: "Failed to fetch cards. Please try again.",
    deleteSuccess: "Card deleted successfully.",
    deleteErrorTitle: "Error deleting card",
    genericError: "An error occurred",
  });

  // 3. useEffect para buscar as traduções
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [
          wallet, noCards, addCard, noName, errorTitle, unexpectedFormatError,
          noCardsFoundError, fetchError, deleteSuccess, deleteErrorTitle, genericError
        ] = await Promise.all([
          translate("Wallet", "en"),
          translate("No cards...", "en"),
          translate("Add Card", "en"),
          translate("No Name", "en"),
          translate("Error", "en"),
          translate("Unexpected response format. Please try again.", "en"),
          translate("No cards found for this user", "en"),
          translate("Failed to fetch cards. Please try again.", "en"),
          translate("Card deleted successfully.", "en"),
          translate("Error deleting card", "en"),
          translate("An error occurred", "en"),
        ]);
        setT({
          wallet, noCards, addCard, noName, errorTitle, unexpectedFormatError,
          noCardsFoundError, fetchError, deleteSuccess, deleteErrorTitle, genericError
        });
      } catch (error) {
        console.error("Falha ao buscar traduções:", error);
      }
    };
    fetchTranslations();
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

  const handleEditPress = async (cardId) => {
    await AsyncStorage.setItem("cardId", cardId);
    navigation.navigate("UpdateCard");
  };

  const fetchCards = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await requestGetMethodsByUser(userId);
      if (response.status === 200 || response.status === 201) {
        setCards(response.data.data);
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t.errorTitle,
          textBody: t.unexpectedFormatError,
        });
      }
    } catch (error) {
      if (error.message.includes('404')) { // Verificação mais robusta do erro
        setCards([]); // Garante que a lista de cartões esteja vazia
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t.errorTitle,
          textBody: t.fetchError,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getRandomDarkColor = () => {
    // ... (lógica existente sem alterações)
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
          title: t.deleteSuccess,
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t.deleteErrorTitle,
          textBody: t.genericError,
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t.deleteErrorTitle,
        textBody: t.genericError,
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
  }, [navigation]); // Dependência corrigida para evitar loops

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
              {/* 4. Usar os textos traduzidos */}
              <Text style={styles.title}>{t.wallet}</Text>
            </View>

            {!cards || cards.length === 0 ? (
              <View style={styles.noCardsView}>
                <Text style={styles.noCardsText}>{t.noCards}</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => navigation.navigate("ChangePaymentScreen")}
                >
                  <Text style={styles.addButtonText}>{t.addCard}</Text>
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
                  renderItem={({ item, index }) => ( // Usando 'item' para clareza
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
                            {item.cardName || t.noName}
                          </Text>
                          <Text style={styles.cardDetailsText}>
                            {formatCardNumber(item.cardNumber) || "**** **** **** ****"}
                          </Text>
                        </View>
                        <Text style={styles.expiryText}>
                          {`${item.cardExpiration.split("-")[1]}/${item.cardExpiration.split("-")[0]}` || "MM/YY"}
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
                    <Text style={styles.addButtonText}>{t.addCard}</Text>
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