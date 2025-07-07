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
  StyleSheet
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
import screenNumberStyles from "../styles/ScreenNumberStyles";
import colors from "../colors";
import * as yup from "yup";
import { requestValidateToken } from "../services/api";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const EnterCodeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  // 2. Criar um estado para armazenar os textos traduzidos
  const [t, setT] = useState({
    title: "Enter your code",
    subTitle: "A 6-digit code has been sent to your email. Check your spam folder.",
    codeLabel: "Code",
    continueButton: "Continue",
    codeRequired: "Code is required",
    maxDigits: "Maximum of 6 digits",
    genericError: "An error occurred. Please try again later.",
  });

  // 3. useEffect para buscar as traduções
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [
          title, subTitle, codeLabel, continueButton,
          codeRequired, maxDigits, genericError
        ] = await Promise.all([
          translate("Enter your code", "en"),
          translate("A 6-digit code has been sent to your email. Check your spam folder.", "en"),
          translate("Code", "en"),
          translate("Continue", "en"),
          translate("Code is required", "en"),
          translate("Maximum of 6 digits", "en"),
          translate("An error occurred. Please try again later.", "en"),
        ]);
        setT({
          title, subTitle, codeLabel, continueButton,
          codeRequired, maxDigits, genericError
        });
      } catch (error) {
        console.error("Falha ao buscar traduções:", error);
      }
    };
    fetchTranslations();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const schema = yup.object().shape({
    token: yup
      .string() // Validar como string é melhor para comprimento
      .required(t.codeRequired)
      .length(6, t.maxDigits),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await schema.validate(data, { abortEarly: false });
      const response = await requestValidateToken(data);

      if (response.status === 200) {
        await AsyncStorage.setItem("changePasswordToken", response.data.token);
        navigation.navigate("SetNewPassword");
      } else {
        throw new Error(t.genericError);
      }
    } catch (error) {
      const message = error?.response?.data?.message || error.message || t.genericError;
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => Toast.hide()
    );
    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleGoBack = () => {
    navigation.navigate("Login");
  };

  return (
    <PaperProvider theme={theme}>
      <AlertNotificationRoot>
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={combinedStyles.keyboardAvoidingView}
            >
              <View style={styles.containerBackButton}>
                <TouchableOpacity onPress={handleGoBack} style={{ width: "40%" }}>
                  <IconButton
                    icon="arrow-left-thin"
                    size={30}
                    style={styles.backIcon}
                  />
                </TouchableOpacity>
                <View style={{ width: "85%" }}>
                  <Image source={logo} style={styles.imageLogo} />
                </View>
              </View>
              <View style={styles.container}>
                {/* 4. Usar os textos traduzidos */}
                <Text style={styles.textTitle}>{t.title}</Text>
                <Text style={styles.linkPrivacy}>{t.subTitle}</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={t.codeLabel}
                      mode="flat"
                      onBlur={onBlur}
                      left={<TextInput.Icon icon="shield-check-outline" />}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="number-pad"
                      maxLength={6}
                      autoCapitalize="none"
                      style={styles.textEmail}
                      error={!!errors.token}
                    />
                  )}
                  name="token"
                  rules={{ required: true }}
                  defaultValue=""
                />
                {errors.token && (
                  <Text style={{ color: colors.error }}>
                    {errors.token.message}
                  </Text>
                )}
                <Button
                  mode="contained"
                  onPress={handleSubmit(onSubmit)}
                  style={styles.button}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    t.continueButton
                  )}
                </Button>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={screenNumberStyles.numberStyle}>07</Text>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </AlertNotificationRoot>
    </PaperProvider>
  );
};

const combinedStyles = StyleSheet.create({
  keyboardAvoidingView: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
    width: "75%",
    marginRight: "auto",
    marginLeft: "auto",
  }
})

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
  },
};

export default EnterCodeScreen;