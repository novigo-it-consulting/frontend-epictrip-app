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
import colors from "../colors.js";
import * as yup from "yup";
import { requestChangePassword } from "../services/api.js";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { translate } from "../services/translations/translateServices";

const SetNewPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [t, setT] = useState({
    title: "Set your new password",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm Password",
    continueButton: "Continue",
    passwordsDoNotMatch: "Passwords do not match",
    requiredField: "Required field",
    errorChangingPassword: "Error changing password. Please try again.",
    passwordChangedSuccess: "Password changed successfully!",
    successTitle: "Success"
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [
          title, passwordLabel, confirmPasswordLabel, continueButton,
          passwordsDoNotMatch, requiredField, errorChangingPassword,
          passwordChangedSuccess, successTitle
        ] = await Promise.all([
          translate("Set your new password", "en"),
          translate("Password", "en"),
          translate("Confirm Password", "en"),
          translate("Continue", "en"),
          translate("Passwords do not match", "en"),
          translate("Required field", "en"),
          translate("Error changing password. Please try again.", "en"),
          translate("Password changed successfully!", "en"),
          translate("Success", "en"),
        ]);
        setT({
          title, passwordLabel, confirmPasswordLabel, continueButton,
          passwordsDoNotMatch, requiredField, errorChangingPassword,
          passwordChangedSuccess, successTitle
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
    newPassword: yup.string().required(t.requiredField),
    confirmPassword: yup.string().required(t.requiredField),
  });

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

  const onSubmit = async (data) => {
    setLoading(true);

    if (data.newPassword !== data.confirmPassword) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: t.passwordsDoNotMatch,
      });
      setLoading(false);
      return;
    }

    try {
      await schema.validate(data, { abortEarly: false });
      const response = await requestChangePassword(data);
      console.log("API Response 0:", JSON.stringify(response, null, 2));

      if (response && JSON.stringify(response, null, 2) == "200") {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: t.successTitle,
          textBody: t.passwordChangedSuccess,
        });

        setTimeout(() => {
          try {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (navError) {
            console.error("Erro de Navegação:", navError);
            Toast.show({
              type: ALERT_TYPE.DANGER,
              title: "Erro de Navegação",
              textBody: "Não foi possível ir para a tela de Login.",
            });
          }
        }, 1500);

      } else {
        console.log("API Response 1:", JSON.stringify(response, null, 2));
        throw new Error(response?.data?.message || t.errorChangingPassword);
      }
    } catch (error) {
      console.log("API Response: 2", error.message);
      const message = error?.response?.data?.message || error.message || t.errorChangingPassword;
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: message,
      });
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
      <AlertNotificationRoot
        toastConfig={defaultToastConfig}
        colors={[lightColors]}
        theme={"light"}
      >
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
              <Text style={styles.textTitle}>{t.title}</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t.passwordLabel}
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
                name="newPassword"
                rules={{ required: true }}
                defaultValue=""
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t.confirmPasswordLabel}
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
                name="confirmPassword"
                rules={{ required: true }}
                defaultValue=""
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
                  t.continueButton
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