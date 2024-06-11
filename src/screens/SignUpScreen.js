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
  Chip,
} from "react-native-paper";
import logo from "../../assets/logo.png";
import { useForm, Controller } from "react-hook-form";
import styles from "../styles/globalScreen.js";
import screenNumberStyles from "../styles/ScreenNumberStyles";
import colors from "../colors";
import * as yup from "yup";
import { WebView } from "react-native-webview";
import { requestSignUpGuest } from "../services/api";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { useTranslation } from "react-i18next";

const SignUpScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");

  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

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
    try {
      const response = await requestSignUpGuest(data);
      if (response.status === 201) {
        navigation.navigate("Login");
        return;
      } else {
        throw new Error("Erro ao criar sua conta. Por favor, tente novamente.");
      }
    } catch (error) {
      if (error.response.data.message === 500) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: t("signUpScreen.errorCreate"),
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: t("signUpScreen.errorCreate"),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    register("language");
    setValue("language", "EN");
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
      <AlertNotificationRoot
        toastConfig={defaultToastConfig}
        colors={[lightColors]}
        theme={"light"}
      >
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
                    label={t("signUpScreen.nameLabel")}
                    mode="flat"
                    left={<TextInput.Icon icon="account-outline" />}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    autoCapitalize="none"
                    style={styles.textEmail}
                    {...register("fullName")}
                  />
                )}
                name="fullName"
                rules={{ required: true }}
                defaultValue=""
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t("signUpScreen.emailLabel")}
                    mode="flat"
                    left={<TextInput.Icon icon="at" />}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textEmail}
                    error={errors.email ? true : false}
                    {...register("email")}
                  />
                )}
                name="email"
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
                    {...register("shareNumber")}
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
                    {...register("phone")}
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

              <Text style={styles.textLabel}>
                {t("signUpScreen.languageLabel")}
              </Text>
              <View style={styles.container}>
                <View style={styles.chipsContainer}>
                  <Chip
                    selected={selectedLanguage === "ES"}
                    onPress={() => {
                      setSelectedLanguage("ES");
                      setValue("language", "ES");
                    }}
                    style={[
                      styles.chip,
                      selectedLanguage === "ES" && styles.selectedChip,
                    ]}
                    textStyle={{ color: "white" }}
                    selectedColor="white"
                  >
                    {t("signUpScreen.languages.spanish")}
                  </Chip>
                  <Chip
                    selected={selectedLanguage === "EN"}
                    onPress={() => {
                      setSelectedLanguage("EN");
                      setValue("language", "EN");
                    }}
                    style={[
                      styles.chip,
                      selectedLanguage === "EN" && styles.selectedChip,
                    ]}
                    textStyle={{ color: "white" }}
                    selectedColor="white"
                  >
                    {t("signUpScreen.languages.english")}
                  </Chip>
                  <Chip
                    selected={selectedLanguage === "PT"}
                    onPress={() => {
                      setSelectedLanguage("PT");
                      setValue("language", "PT");
                    }}
                    style={[
                      styles.chip,
                      selectedLanguage === "PT" && styles.selectedChip,
                    ]}
                    textStyle={{ color: "white" }}
                    selectedColor="white"
                  >
                    {t("signUpScreen.languages.portuguese")}
                  </Chip>
                </View>
              </View>

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
                <Text
                  style={styles.link}
                  onPress={() => {
                    navigation.navigate("Terms");
                  }}
                >
                  {" "}
                  {t("signUpScreen.privacyPolicyLink")}{" "}
                </Text>
                {t("signUpScreen.termsAndConditions")}
                <Text
                  style={styles.link}
                  onPress={() => {
                    navigation.navigate("Terms");
                  }}
                >
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
