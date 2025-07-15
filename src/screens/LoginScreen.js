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
  ActivityIndicator,
} from "react-native";
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

import logo from "../../assets/logo.png";
import styles from "../styles/globalScreen";
import screenNumberStyles from "../styles/ScreenNumberStyles";
import colors from "../colors";
import { requestLogin } from "../services/api";

const LoginScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typedUsername, setTypedUsername] = useState("");

  const schema = yup.object().shape({
    username: yup.string().email(t('loginScreen.invalidEmailAdress')).required(t('loginScreen.emailRequired')),
    password: yup.string().min(6, t('loginScreen.passwordMinLength')).required(t('loginScreen.passwordRequired')),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await requestLogin(data);
      if (response.status === 200) {
        const { userId, token, language } = response.data;
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("username", data.username);
        // await AsyncStorage.setItem("language", language); // Descomente se precisar salvar o idioma
        if (userId) {
          await AsyncStorage.setItem("userId", userId);
          navigation.navigate("Home");
        }
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('loginScreen.errorTitle'),
        textBody: error?.response?.data?.message || t('loginScreen.genericError'),
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
                <Text style={styles.textTitle}>{t('loginScreen.title')}</Text>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={t('loginScreen.emailLabel')}
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
                />
                {errors.username && (
                  <Text style={{ color: colors.error }}>
                    {errors.username.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={t('loginScreen.passwordLabel')}
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
                  {loading ? <ActivityIndicator color={colors.white} /> : t('loginScreen.loginButton')}
                </Button>

                <Button
                  style={styles.linkForgotPassword}
                  onPress={handleForgotPassword}
                >
                  {t('loginScreen.forgotPassword')}
                </Button>
              </View>
              <View style={styles.containerFooter}>
                <Text style={styles.textFinalTextScreen}>
                  {t('loginScreen.noAccount')}
                </Text>
                <Button onPress={handleGoToSignUp} style={styles.link}>
                  {t('loginScreen.signUp')}
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
