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
import { useTranslation } from "react-i18next";

const ForgetPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const schema = yup.object().shape({
    username: yup
      .string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await schema.validate(data, { abortEarly: false });
      const response = await requestGenerateToken(data);
      console.log("Response", response);

      if (response === 201) {
        navigation.navigate("EnterCode");
        return;
      } else {
        throw new Error("Erro ao resetar renha. Por favor, tente novamente.");
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
          textBody: "Erro incomum, tente novamente mais tarde",
        });
      }
      console.log("Error", error);
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

  const handleGoBack = () => {
    navigation.navigate("Login");
  };

  return (
    <PaperProvider theme={theme}>
      <AlertNotificationRoot>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
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
              <Text style={styles.textTitle}>
                {t("forgetPasswordScreen.title")}
              </Text>

              <Text style={styles.linkPrivacy}>
                {t("forgetPasswordScreen.subTitle")}
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t("forgetPasswordScreen.emailLabel")}
                    mode="flat"
                    onBlur={onBlur}
                    left={<TextInput.Icon icon="account-outline" />}
                    onChangeText={(value) => onChange(value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textEmail}
                    error={errors.username ? true : false}
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
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                style={styles.button}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  t("forgetPasswordScreen.continueButton")
                )}
              </Button>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={screenNumberStyles.numberStyle}>06</Text>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        <Toast />
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

export default ForgetPasswordScreen;
