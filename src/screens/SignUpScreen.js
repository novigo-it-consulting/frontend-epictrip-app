import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
} from "react-native";
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
  ActivityIndicator,
} from "react-native-paper";
import logo from "../../assets/logo.png";
import { useForm, Controller } from "react-hook-form";
import styles from "../styles/globalScreen.js";
import screenNumberStyles from "../styles/ScreenNumberStyles";
import colors from "../colors";
import * as yup from "yup";
import requestLogin from "../services/api";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { Link } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

const SignUpScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),
    shareNumber: yup.number().required("E-mail é obrigatório"),
    password: yup
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .required("Senha é obrigatória"),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await schema.validate(data, { abortEarly: false });
      const response = await requestLogin(data);

      if (response.status === 200) {
        await AsyncStorage.setItem("userData", JSON.stringify(data));
        navigation.navigate("Home");
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

  const handleGoToSignIn = () => {
    navigation.navigate("Login");
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView />
      <AlertNotificationRoot>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? null : null}
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
            <View style={styles.containerBackButton}>
              <Image source={logo} style={styles.imageLogo} />
            </View>
            <View style={styles.container}>
              <Text style={styles.textTitle}>{t("signUpScreen.title")}</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t("signUpScreen.emailLabel")}
                    mode="flat"
                    left={<TextInput.Icon icon="account-outline" />}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textEmail}
                    error={errors.email ? true : false}
                  />
                )}
                name="username"
                rules={{ required: true }}
                defaultValue=""
              />
              {errors.email && (
                <Text style={{ color: colors.error }}>
                  {errors.email.message}
                </Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t("signUpScreen.shareNumberLabel")}
                    mode="flat"
                    left={<TextInput.Icon icon="account-group-outline" />}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textEmail}
                    error={errors.email ? true : false}
                  />
                )}
                name="shareNumber"
                rules={{ required: true }}
                defaultValue=""
              />
              {errors.email && (
                <Text style={{ color: colors.error }}>
                  {errors.email.message}
                </Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t("signUpScreen.phoneLabel")}
                    mode="flat"
                    left={<TextInput.Icon icon="phone-outline" />}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    style={styles.textPassword}
                    error={errors.phone ? true : false}
                    keyboardType="phone-pad"
                  />
                )}
                name="phone"
                rules={{ required: true }}
                defaultValue=""
              />
              {errors.phone && (
                <Text style={{ color: colors.error }}>
                  {errors.phone.message}
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
                  t("signUpScreen.signIn")
                )}
              </Button>
              <Text style={styles.linkPrivacy}>
                {t("signUpScreen.privacyPolicy")}
                <Text style={styles.link} onPress={() => {}}>
                  {" "}
                  {t("signUpScreen.privacyPolicyLink")}{" "}
                </Text>
                {t("signUpScreen.termsAndConditions")}
                <Text style={styles.link} onPress={() => {}}>
                  {" "}
                  {t("signUpScreen.termsAndConditionsLink")}{" "}
                </Text>
              </Text>
            </View>

            <View style={styles.containerText}>
              <Text>{t("signUpScreen.alreadyHaveAccount")}</Text>
              <Button onPress={handleGoToSignIn} style={styles.link}>
                {t("signUpScreen.signIn")}
              </Button>
              <Text style={screenNumberStyles.numberStyle}>03</Text>
            </View>
            <Toast />
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

export default SignUpScreen;
