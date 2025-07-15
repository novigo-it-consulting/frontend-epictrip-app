import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
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
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

import logo from "../../assets/logo.png";
import styles from "../styles/globalScreen.js";
import screenNumberStyles from "../styles/ScreenNumberStyles";
import colors from "../colors";
import { requestValidateToken } from "../services/api";

const EnterCodeScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation();

  // O schema de validação agora é definido dentro do componente
  // para que possa acessar a função `t` do hook.
  const schema = yup.object().shape({
    token: yup
      .string()
      .required(t('enterCode.codeRequired'))
      .length(6, t('enterCode.maxDigits')),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // Integração do Yup com o React Hook Form
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await requestValidateToken(data);

      if (response.status === 200) {
        await AsyncStorage.setItem("changePasswordToken", response.data.token);
        navigation.navigate("SetNewPassword");
      } else {
        // Lança um erro se o status não for 200 para ser pego pelo catch
        throw new Error(t('enterCode.genericError'));
      }
    } catch (error) {
      const message = error?.response?.data?.message || error.message || t('enterCode.genericError');
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('enterCode.errorTitle'),
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
                <Text style={styles.textTitle}>{t('enterCode.title')}</Text>
                <Text style={styles.linkPrivacy}>{t('enterCode.subTitle')}</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={t('enterCode.codeLabel')}
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
                    t('enterCode.continueButton')
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