import React, { useState } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
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
import styles from "../styles/globalScreen.js";
import colors from "../colors.js";
import { requestPayment } from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Payment = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      const paymentMethodId = "f2da2487-eb66-43dc-b201-c37886e1fa1d";
      const amount = "0.1";

      const response = await requestPayment(userId, paymentMethodId, amount);

      console.log(JSON.stringify(response));
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Payment successful!",
      });
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

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView />
      <AlertNotificationRoot>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              width: "85%",
              marginRight: "auto",
              marginLeft: "auto",
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
              Pagamento
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
            <Button
              mode="contained"
              onPress={handlePayment}
              style={styles.button}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                "Realizar Pagamento"
              )}
            </Button>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </AlertNotificationRoot>
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

export default Payment;
