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
  SegmentedButtons,
} from "react-native-paper";
import logo from "../../assets/logo.png";
import { useForm, Controller } from "react-hook-form";
import styles from "../styles/globalScreen.js";
import screenNumberStyles from "../styles/ScreenNumberStyles.js";
import colors from "../colors.js";
import * as yup from "yup";
import registerUserGuest from "../services/api.js";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

const SignUpFinishingScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const { signUpPersonalData } = route.params;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const [items, setItems] = useState([
    { label: "Portugês", value: "portuguese" },
    { label: "Inglês", value: "english" },
    { label: "Espanhol", value: "spanish" },
  ]);

  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),
    shareNumber: yup.number().required("E-mail é obrigatório"),
    password: yup
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .required("Senha é obrigatória"),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await schema.validate(data, { abortEarly: false });
      const response = await registerUserGuest(data);
      console.log(response);
      if (response.status === 201) {
        await AsyncStorage.setItem("userData", JSON.stringify(data));
        navigation.navigate("Login");
        return;
      } else {
        throw new Error("Erro ao efetuar login. Por favor, tente novamente.");
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
          textBody:
            "Erro ao efetuar login. Por favor, tente novamente mais tarde.",
        });
      }
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

  const handleGoToSignIn = () => {
    navigation.navigate("Login");
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView />
      <AlertNotificationRoot>
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
              <Text style={styles.textTitle}>{"Continue seu cadastro"}</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={"Nome Completo"}
                    mode="flat"
                    left={<TextInput.Icon icon="account-outline" />}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textEmail}
                    error={errors.email ? true : false}
                  />
                )}
                name="name"
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
                    label={"E-mail"}
                    mode="flat"
                    left={<TextInput.Icon icon="email-outline" />}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textEmail}
                    error={errors.email ? true : false}
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
                render={({ field: { value } }) => (
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                  />
                )}
                name="language"
                rules={{ required: true }}
                defaultValue=""
              />
              {errors.phone && (
                <Text style={{ color: colors.error }}>
                  {errors.phone.message}
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
                  t("signUpScreen.signIn")
                )}
              </Button>
              <Text style={styles.linkPrivacy}>
                {t("signUpScreen.privacyPolicy")}
                <Text style={styles.link} onPress={() => {}}>
                  {" "}
                  {t("signUpScreen.privacyPolicyLink")}{" "}
                </Text>
                {t("signUpScreen.termsAndConditions")}
                <Text style={styles.link} onPress={() => {}}>
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

export default SignUpFinishingScreen;
