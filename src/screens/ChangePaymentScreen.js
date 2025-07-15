import React, { useRef, useCallback } from "react";
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
  Dialog,
} from "react-native-alert-notification";
import { CreditCardInput } from "react-native-credit-card-input";
import colors from "../colors";
import { requestCreatePaymentMethod } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useTranslation } from "react-i18next";

const ChangePaymentCard = ({ navigation }) => {
  const creditCardRef = useRef(null);
  const { t } = useTranslation();

  const handleSubmit = useCallback(async () => {
    if (creditCardRef.current) {
      const cardDetails = creditCardRef.current.state;

      if (!cardDetails.valid) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t("changePaymentScreen.titleError"),
          textBody: t("changePaymentScreen.errorFields"),
        });
        return;
      }

      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "User not logged in.",
        });
        return;
      }

      const cardData = {
        userId: userId,
        cardType: cardDetails.values.type,
        cardNumber: cardDetails.values.number,
        cardName: cardDetails.values.name,
        cardExpiration: cardDetails.values.expiry,
        cardCVV: cardDetails.values.cvc,
        createdAt: moment().toISOString(),
      };

      try {
        const response = await requestCreatePaymentMethod(cardData);
        if (response.status === 200 || response.status === 201) {
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: t("alertSuccess"),
            textBody: t("changePaymentScreen.cardAddedSuccess"),
            button: 'close',
            onHide: () => {
              navigation.goBack();
            }
          });
        } else {
          console.error("Error adding card:", response.statusText);
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: t("alertError"),
            textBody: t("changePaymentScreen.cardAddedError"),
          });
        }
      } catch (error) {
        console.error("Error adding card:", error);
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t("alertError"),
          textBody: t("changePaymentScreen.cardAddedError"),
        });
      }
    }
  }, [navigation, t]);


  return (
    <AlertNotificationRoot theme={"light"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={20}
          style={styles.containerAlpha}
        >
          <Text style={styles.title}>{t("changePaymentScreen.titleAddCard")}</Text>

          <CreditCardInput
            ref={creditCardRef}
            requiresName={true}
            requiresCVC={true}
            cardScale={1.0}
            labelStyle={styles.label}
            inputStyle={styles.input}
            validColor={"#000"}
            invalidColor={"red"}
            placeholderColor={"#999"}
          />

          <View
            style={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}
          >
            <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
              <Text style={styles.addButtonText}>{t("changePaymentScreen.buttonAddCard")}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  containerAlpha: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.backGroundLight,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.primary,
    textAlign: "center",
  },
  addButton: {
    marginTop: 40,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    color: '#333',
    fontSize: 12,
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  }
});

export default ChangePaymentCard;
