import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import logo from "../../assets/logo.png";
import { useForm, Controller } from "react-hook-form";
import styles from "../styles/globalScreen.js";
import screenNumberStyles from "../styles/ScreenNumberStyles.js";
import colors from "../colors.js";
import * as yup from "yup";
import { requestValidateToken, getPlaceById, getAllPlaces } from "../services/api.js";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

const EnterCodeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const schema = yup.object().shape({
    token: yup
      .number()
      .required("E-mail é obrigatório")
      .min(6, "Máximo de 6 digitos"),
  });

  const callFunction = async () => {
    console.log("CARAIO")
    response = await getAllPlaces();
    response2 = await getPlaceById("139e3f6d-a324-480a-aa64-44b9c99aef7d");
    console.log("all", response)
    console.log("by id", response2)
  }

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      await schema.validate(data, { abortEarly: false });
      const response = await requestValidateToken(data);

      if (response.status === 200) {
        await AsyncStorage.setItem("token", response.data.token);
        navigation.navigate("SetNewPassword");
        return;
      } else {
        throw new Error("Erro ao efetuar login. Por favor, tente novamente.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: error.response.data.message,
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody:
            "Erro ao efetuar login. Por favor, tente novamente mais tarde.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Toast.hide();
      }
    );
    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleGoBack = () => {
    navigation.navigate("Home");
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
              justifyContent: "space-around",
              flex: 1,
              width: "75%",
              marginRight: "auto",
              marginLeft: "auto",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 33,
                fontWeight: "bold",
                color: colors.primary,
              }}
              onPress={handleGoBack}
            >
              Em Construção... Clique aqui para voltar
            </Text>
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

export default EnterCodeScreen;
