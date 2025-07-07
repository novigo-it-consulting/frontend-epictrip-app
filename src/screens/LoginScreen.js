import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  StyleSheet,
  SafeAreaView,
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
import { useFocusEffect } from "@react-navigation/native";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typedUsername, setTypedUsername] = useState("");

  // 2. Criar um estado para armazenar os textos traduzidos
  const [t, setT] = useState({
    login: "Login",
    emailLabel: "E-mail",
    passwordLabel: "Password",
    forgotPassword: "Forgot your password?",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign Up",
    invalidEmail: "Invalid e-mail address",
    emailRequired: "E-mail is required",
    passwordMinLength: "Password must have at least 6 characters",
    passwordRequired: "Password is required",
    genericError: "Error logging in. Please try again.",
  });

  // 3. useEffect para buscar as traduções
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [
          login, emailLabel, passwordLabel, forgotPassword, dontHaveAccount, signUp,
          invalidEmail, emailRequired, passwordMinLength, passwordRequired, genericError
        ] = await Promise.all([
          translate("Login", "en"),
          translate("E-mail", "en"),
          translate("Password", "en"),
          translate("Forgot your password?", "en"),
          translate("Don't have an account?", "en"),
          translate("Sign Up", "en"),
          translate("Invalid e-mail address", "en"),
          translate("E-mail is required", "en"),
          translate("Password must have at least 6 characters", "en"),
          translate("Password is required", "en"),
          translate("Error logging in. Please try again.", "en"),
        ]);
        setT({
          login, emailLabel, passwordLabel, forgotPassword, dontHaveAccount, signUp,
          invalidEmail, emailRequired, passwordMinLength, passwordRequired, genericError
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
    setValue,
    formState: { errors },
  } = useForm();

  // Usa os textos traduzidos no schema de validação
  const schema = yup.object().shape({
    username: yup.string().email(t.invalidEmail).required(t.emailRequired),
    password: yup.string().min(6, t.passwordMinLength).required(t.passwordRequired),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await schema.validate(data, { abortEarly: false });
      const response = await requestLogin(data);
      if (response.status === 200) {
        const userId = response.data.userId;
        await AsyncStorage.setItem("token", response.data.token);
        await AsyncStorage.setItem("username", data.username);
        await AsyncStorage.setItem("language", response.data.language);
        if (userId) {
          await AsyncStorage.setItem("userId", userId);
          navigation.navigate("Home");
        }
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: error?.response?.data?.message || t.genericError,
      });
      console.error(error);
    } finally {
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
      () => Toast.hide()
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
                <Image source={logo} style={styles.imageLogo} />
              </View>
              <View style={styles.container}>
                {/* 4. Usar os textos traduzidos */}
                <Text style={styles.textTitle}>{t.login}</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={t.emailLabel}
                      onSubmitEditing={Keyboard.dismiss}
                      mode="flat"
                      left={<TextInput.Icon icon="account-outline" />}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text);
                        setTypedUsername(text);
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={styles.textEmail}
                      value={value}
                      error={!!errors.username}
                    />
                  )}
                  name="username"
                  rules={{ required: true }}
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
                      label={t.passwordLabel}
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
                      error={!!errors.password}
                    />
                  )}
                  name="password"
                  rules={{ required: true }}
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
                  {loading ? <ActivityIndicator color={colors.white} /> : t.login}
                </Button>

                <Button
                  style={styles.linkForgotPassword}
                  onPress={handleForgotPassword}
                >
                  {t.forgotPassword}
                </Button>
              </View>
              <View style={styles.containerFooter}>
                <Text style={styles.textFinalTextScreen}>
                  {t.dontHaveAccount}
                </Text>
                <Button onPress={handleGoToSignUp} style={styles.link}>
                  {t.signUp}
                </Button>
                <Text style={screenNumberStyles.numberStyle}>02</Text>
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
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
});

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
  },
};

export default LoginScreen;