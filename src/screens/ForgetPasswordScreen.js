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
  StyleSheet,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
  IconButton,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

import logo from "../../assets/logo.png";
import styles from "../styles/globalScreen.js";
import screenNumberStyles from "../styles/ScreenNumberStyles";
import colors from "../colors.js";
import { requestGenerateToken } from "../services/api.js";

const ForgetPasswordScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [typedUsername, setTypedUsername] = useState("");

  const schema = yup.object().shape({
    username: yup
      .string()
      .email(t('forgetPasswordScreen.invalidEmail'))
      .required(t('forgetPasswordScreen.emailRequired')),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: ''
    }
  });

  useEffect(() => {
    const fetchTypedUsername = async () => {
      const typedUser = await AsyncStorage.getItem("username");
      if (typedUser) {
        setTypedUsername(typedUser);
        setValue('username', typedUser);
      }
    };
    fetchTypedUsername();
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await requestGenerateToken(data);
      if (response.status === 201) { // Verifica o status da resposta
        navigation.navigate("EnterCode");
      } else {
        // Lança um erro para ser pego pelo bloco catch
        throw new Error(t('forgetPasswordScreen.unexpectedError'));
      }
    } catch (error) {
      const message = error?.response?.data?.message || error.message || t('forgetPasswordScreen.unexpectedError');
      // Trata o erro 500 especificamente como "usuário não encontrado"
      if (error?.response?.status === 500) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t('forgetPasswordScreen.errorTitle'),
          textBody: t('forgetPasswordScreen.noUser'),
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t('forgetPasswordScreen.errorTitle'),
          textBody: message,
        });
      }
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
    navigation.goBack();
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
                    icon={"arrow-left-thin"}
                    size={30}
                    style={styles.backIcon}
                  />
                </TouchableOpacity>
                <View style={{ width: "85%" }}>
                  <Image source={logo} style={styles.imageLogo} />
                </View>
              </View>
              <View style={styles.container}>
                <Text style={styles.textTitle}>{t('forgetPasswordScreen.title')}</Text>
                <Text style={styles.linkPrivacy}>{t('forgetPasswordScreen.subTitle')}</Text>

                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={t('forgetPasswordScreen.emailLabel')}
                      mode="flat"
                      onBlur={onBlur}
                      left={<TextInput.Icon icon="account-outline" />}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={styles.textEmail}
                      error={!!errors.username}
                    />
                  )}
                  name="username"
                />

                {errors.username && (
                  <Text style={{ color: colors.error }}>
                    {errors.username.message}
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
                    t('forgetPasswordScreen.continueButton')
                  )}
                </Button>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={screenNumberStyles.numberStyle}>06</Text>
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
});

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
  },
};

export default ForgetPasswordScreen;
