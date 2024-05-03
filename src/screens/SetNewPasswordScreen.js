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
import { requestChangePassword } from "../services/api.js";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ForgetPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const schema = yup.object().shape({
    newPassword: yup.string().required("Campo Obrigatório"),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      await schema.validate(data, { abortEarly: false });
      const token = await AsyncStorage.getItem("token");
      const response = await requestChangePassword(data);
      console.log(token);
      if (response === 200) {
        navigation.navigate("Home");
        return;
      } else {
        throw new Error("Erro ao efetuar login. Por favor, tente novamente.");
      }
    } catch (error) {
      console.log("Error", error);

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

  const handleResendCode = () => {
    navigation.navigate("SignUp");
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
          <Text style={styles.textTitle}>Set your password</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
                mode="flat"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.textEmail}
                error={errors.newPassword ? true : false}
              />
            )}
            name="newPassword"
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

export default ForgetPasswordScreen;
