import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  AlertNotificationRoot,
  Toast,
  ALERT_TYPE,
} from "react-native-alert-notification";
import colors from "../colors";
import CreditCard from "react-native-credit-card-form-ui";
import {
  requestGetMethodById,
  requestUpdatePaymentMethod,
} from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const UpdateCard = ({ navigation }) => {
  const creditCardRef = useRef();
  const [card, setCard] = useState(null);

  const handleSubmit = useCallback(
    async (methodId) => {
      if (creditCardRef.current) {
        const { error, data } = creditCardRef.current.submit();
        if (error) {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Erro",
            textBody: "Please fill in all fields correctly!",
          });
          return;
        }

        const userId = await AsyncStorage.getItem("userId");
        const cardData = {
          methodId: methodId,
          userId: userId,
          cardType: "visa",
          cardNumber: data.number,
          cardName: data.holder,
          cardExpiration: data.expiration,
          cardCVV: data.cvv,
          createdAt: moment().toISOString(),
        };

        try {
          const response = await requestUpdatePaymentMethod(cardData);
          console.log(response);
          if (response.status === 200 || response.status === 201) {
            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Success!",
              textBody: "Card added successfully!",
            });
            setTimeout(() => {
              navigation.goBack();
            }, 3000);
          } else {
            console.error("Error adding card:", response.statusText);
            Toast.show({
              type: ALERT_TYPE.DANGER,
              title: "Error",
              textBody: "Failed to add card. Please try again.",
            });
          }
        } catch (error) {
          console.error("Error adding card:", error);
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: "Failed to add card. Please try again.",
          });
        }
      }
    },
    [navigation]
  );

  const fetchCard = async () => {
    const cardId = await AsyncStorage.getItem("cardId");
    const response = await requestGetMethodById(cardId);
    if (response.status === 200) {
      const data = response.data.data;
      setCard(data);
    }
  };

  useEffect(() => {
    fetchCard();
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

  return (
    <AlertNotificationRoot
      toastConfig={defaultToastConfig}
      colors={[lightColors]}
      theme={"light"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={20}
          style={styles.containerAlpha}
        >
          <Text style={styles.title}>Editar Cartão</Text>
          {!card ? (
            <></>
          ) : (
            <>
              <CreditCard
                ref={creditCardRef}
                background={"#1a2b45"}
                textColor={"#fff"}
                placeholderTextColor="#ccc"
                expirationDateFormat="MM/YYYY"
                initialValues={{
                  number: card.cardNumber,
                  holder: card.cardName,
                  expiration: `${card.cardExpiration.split("-")[1]}/${card.cardExpiration.split("-")[0]}`,
                  cvv: card.cardCVV,
                }}
              />
              <View
                style={{
                  width: "90%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleSubmit(card.methodId)}
                >
                  <Text style={styles.addButtonText}>Atualizar Cartão</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.primary,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    width: "100%",
    textAlign: "center",
  },
});

export default UpdateCard;
