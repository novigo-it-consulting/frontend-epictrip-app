import React, { useState, useEffect } from "react";
import { View, Text, Image, Keyboard, TouchableOpacity } from "react-native";
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import LogoEnterCode from "../../assets/enterCode.png";
import { useForm, Controller } from "react-hook-form";
import styles from "../styles/EnterCodeStyles.js";
import colors from "../colors.js";
import * as yup from "yup";
import { requestGenerateToken } from "../services/api.js";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const EnterCodeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
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

  const handleResendCode = () => {
    alert("Erro ao Reenviar código");
  };

  const handleGoBack = () => {
    navigation.navigate("Login");
  };

  return (
    <PaperProvider theme={theme}>
      <AlertNotificationRoot>
        <View style={styles.container}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <IconButton
              icon={"arrow-left-thin"}
              size={30}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Image source={LogoEnterCode} style={styles.imageLogo} />
          <Text style={styles.textTitle}>Tell us your Email</Text>

          <Text style={styles.linkPrivacy}>
            Type in your Epic Trip account e-mail address
          </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
                mode="flat"
                onBlur={onBlur}
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
            <Text style={{ color: colors.error }}>{errors.email.message}</Text>
          )}

          <Button onPress={handleResendCode} style={styles.linkPrivacy}>
            Resend Code
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={colors.white} /> : "Continue"}
          </Button>
        </View>
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

export default EnterCodeScreen;
