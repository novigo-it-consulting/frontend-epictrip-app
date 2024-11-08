import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
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
import styles from "../styles/globalScreen";
import screenNumberStyles from "../styles/ScreenNumberStyles";
import colors from "../colors";
import * as yup from "yup";
import { requestLogin } from "../services/api";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typedUsername, setTypedUsername] = useState("");

  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const schema = yup.object().shape({
    username: yup
      .string()
      .email(t("loginScreen.invalidEmailAdress"))
      .required("E-mail é obrigatório"),
    password: yup
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .required("Senha é obrigatória"),
  });

  const handleTypedUsernameChange = (value) => {
    setTypedUsername(value);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await schema.validate(data, { abortEarly: false });

      navigation.navigate("Home");

      const response = await requestLogin(data);

      if (response.status === 200) {
        const userId = response.data.userId;
        await AsyncStorage.setItem("token", response.data.token);
        await AsyncStorage.setItem("username", data.username);

        if (userId) {
          await AsyncStorage.setItem("userId", userId);
          navigation.navigate("Home");
          return;
        }
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: t("loginScreen.genericError"),
      });
      console.error(error);
    } finally {
      ""
      setLoading(false);
    }
  };

  const clearPassword = () => {
    setValue("password", "");
  };

  useFocusEffect(
    React.useCallback(() => {
      clearPassword();
    }, [])
  );

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

  const handleForgotPassword = async () => {
    await AsyncStorage.setItem("typedUsername", typedUsername);
    navigation.navigate("FogotPassword");
  };

  const handleGoToSignUp = () => {
    navigation.navigate("SignUp");
  };

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
    <PaperProvider theme={theme}>
      <AlertNotificationRoot
        toastConfig={defaultToastConfig}
        colors={[lightColors]}
        theme={"light"}
      >
        <SafeAreaView />
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
              <Text style={styles.textTitle}>{t("loginScreen.title")}</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t("loginScreen.emailLabel")}
                    onSubmitEditing={Keyboard.dismiss}
                    mode="flat"
                    left={<TextInput.Icon icon="account-outline" />}
                    onBlur={onBlur}
                    onChangeText={(value) => {
                      onChange(value);
                      handleTypedUsernameChange(value);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textEmail}
                    value={value}
                    error={errors.username ? true : false}
                  />
                )}
                name="username"
                rules={{ required: true }}
                defaultValue=""
              />
              {errors.username && (
                <Text style={{ color: colors.error }}>
                  {errors.username.message}
                </Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t("loginScreen.passwordLabel")}
                    mode="flat"
                    onSubmitEditing={Keyboard.dismiss}
                    left={<TextInput.Icon icon="lock-outline" />}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                    onBlur={onBlur}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                    style={styles.textPassword}
                    value={value}
                    error={errors.password ? true : false}
                  />
                )}
                name="password"
                rules={{ required: true }}
                defaultValue=""
              />
              {errors.password && (
                <Text style={{ color: colors.error }}>
                  {errors.password.message}
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
                  t("loginScreen.loginButton")
                )}
              </Button>

              <Button
                style={styles.linkForgotPassword}
                onPress={handleForgotPassword}
              >
                {t("loginScreen.forgotPassword")}
              </Button>
            </View>
            <View style={styles.containerFooter}>
              <Text style={styles.textFinalTextScreen}>
                {t("loginScreen.noAccount")}
              </Text>
              <Button onPress={handleGoToSignUp} style={styles.link}>
                {t("loginScreen.signUp")}
              </Button>
              <Text style={screenNumberStyles.numberStyle}>02</Text>
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

export default LoginScreen;
