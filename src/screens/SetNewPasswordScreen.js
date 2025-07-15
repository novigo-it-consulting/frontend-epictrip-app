import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
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
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

import logo from "../../assets/logo.png";
import styles from "../styles/globalScreen.js";
import screenNumberStyles from "../styles/ScreenNumberStyles";
import colors from "../colors.js";
import { requestChangePassword } from "../services/api.js";

const SetNewPasswordScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const schema = yup.object().shape({
    newPassword: yup.string().required(t('setNewPasswordScreen.requiredField')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], t('setNewPasswordScreen.passwordsDoNotMatch'))
      .required(t('setNewPasswordScreen.requiredField')),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await requestChangePassword(data);
      if (response.status === 200) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: t('setNewPasswordScreen.successTitle'),
          textBody: t('setNewPasswordScreen.passwordChangedSuccess'),
        });

        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }, 1500);
      } else {
        throw new Error(response?.data?.message || t('setNewPasswordScreen.errorChangingPassword'));
      }
    } catch (error) {
      const message = error?.response?.data?.message || error.message || t('setNewPasswordScreen.errorChangingPassword');
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('setNewPasswordScreen.errorTitle'),
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
    navigation.goBack();
  };

  return (
    <PaperProvider theme={theme}>
      <AlertNotificationRoot theme={"light"}>
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
              <Text style={styles.textTitle}>{t('setNewPasswordScreen.title')}</Text>
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t('setNewPasswordScreen.passwordLabel')}
                    mode="flat"
                    onBlur={onBlur}
                    left={<TextInput.Icon icon="account-key-outline" />}
                    right={
                      <TextInput.Icon
                        icon={!showPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                    secureTextEntry={!showPassword}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    style={styles.textEmail}
                    error={!!errors.newPassword}
                  />
                )}
              />
              {errors.newPassword && (
                <Text style={{ color: colors.error }}>
                  {errors.newPassword.message}
                </Text>
              )}
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t('setNewPasswordScreen.confirmPasswordLabel')}
                    mode="flat"
                    left={<TextInput.Icon icon="account-key-outline" />}
                    onBlur={onBlur}
                    right={
                      <TextInput.Icon
                        icon={
                          !showPasswordConfirm
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        onPress={() =>
                          setShowPasswordConfirm(!showPasswordConfirm)
                        }
                      />
                    }
                    secureTextEntry={!showPasswordConfirm}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    style={styles.textEmail}
                    error={!!errors.confirmPassword}
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text style={{ color: colors.error }}>
                  {errors.confirmPassword.message}
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
                  t('setNewPasswordScreen.continueButton')
                )}
              </Button>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={screenNumberStyles.numberStyle}>08</Text>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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

export default SetNewPasswordScreen;
