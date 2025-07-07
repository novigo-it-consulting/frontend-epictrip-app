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
  SafeAreaView
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
import { requestGenerateToken } from "../services/api.js";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const ForgetPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [typedUsername, setTypedUsername] = useState("");

  // 2. Criar um estado para armazenar os textos traduzidos
  const [t, setT] = useState({
    title: "Forgot Password",
    subTitle: "Type in your Epic Trip account email address",
    emailLabel: "E-mail",
    continueButton: "Continue",
    noUser: "No user found",
    unexpectedError: "An unexpected error occurred, please try again.",
    invalidEmail: "Invalid e-mail",
    emailRequired: "E-mail is required",
  });

  // 3. useEffect para buscar as traduções
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [
          title, subTitle, emailLabel, continueButton, noUser,
          unexpectedError, invalidEmail, emailRequired
        ] = await Promise.all([
          translate("Forgot Password", "en"), // Título mais apropriado para a tela
          translate("Type in your Epic Trip account email address", "en"),
          translate("E-mail", "en"),
          translate("Continue", "en"),
          translate("No user found", "en"),
          translate("An unexpected error occurred, please try again.", "en"),
          translate("Invalid e-mail", "en"),
          translate("E-mail is required", "en"),
        ]);
        setT({
          title, subTitle, emailLabel, continueButton, noUser,
          unexpectedError, invalidEmail, emailRequired
        });
      } catch (error) {
        console.error("Falha ao buscar traduções:", error);
      }
    };
    fetchTranslations();
  }, []);

  const fetchTypedUsername = async () => {
    const typedUser = await AsyncStorage.getItem("username");
    if (typedUser) {
      setTypedUsername(typedUser);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      username: ''
    }
  });

  useEffect(() => {
    if (typedUsername) {
      setValue('username', typedUsername)
    }
  }, [typedUsername, setValue])

  const schema = yup.object().shape({
    username: yup
      .string()
      .email(t.invalidEmail)
      .required(t.emailRequired),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await schema.validate(data, { abortEarly: false });
      const response = await requestGenerateToken(data);

      if (response === 201) {
        navigation.navigate("EnterCode");
      } else {
        throw new Error(t.unexpectedError);
      }
    } catch (error) {
      const message = error?.response?.data?.message || error.message || t.unexpectedError;
      if (error?.response?.status === 500) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: t.noUser,
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypedUsername();
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
                {/* 4. Usar os textos traduzidos */}
                <Text style={styles.textTitle}>{t.title}</Text>
                <Text style={styles.linkPrivacy}>{t.subTitle}</Text>

                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={t.emailLabel}
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
                    t.continueButton
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