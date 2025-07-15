import React, { useState } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet
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
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

import styles from "../styles/globalScreen.js";
import colors from "../colors.js";
import { requestPayment } from "../services/api";

const PaymentSelectCard = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handlePayment = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      // Este ID de método de pagamento está fixo para teste
      const paymentMethodId = "f2da2487-eb66-43dc-b201-c37886e1fa1d";
      const amount = "0.1";

      const response = await requestPayment(userId, paymentMethodId, amount);

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: t('paymentSelectCard.successTitle'),
        textBody: t('paymentSelectCard.successMessage'),
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('paymentSelectCard.errorTitle'),
        textBody: t('paymentSelectCard.errorMessage'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <AlertNotificationRoot>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : null}
              style={combinedStyles.keyboardAvoidingView}
            >
              <Text style={combinedStyles.title}>
                {t('paymentSelectCard.title')}
              </Text>
              <Text style={combinedStyles.amount}>
                U$ 0,1
              </Text>
              <Button
                mode="contained"
                onPress={handlePayment}
                style={styles.button}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  t('paymentSelectCard.buttonText')
                )}
              </Button>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </AlertNotificationRoot>
      </SafeAreaView>
    </PaperProvider>
  );
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
  },
};

const combinedStyles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 100,
    color: "#000",
  },
  amount: {
    textAlign: "center",
    fontSize: 60,
    fontWeight: "bold",
    marginBottom: 50,
    color: colors.primary,
  }
});

export default PaymentSelectCard;
