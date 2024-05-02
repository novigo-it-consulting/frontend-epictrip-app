import React, { useState, useEffect } from "react";
import { View, Text, Image, Keyboard } from "react-native";
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";
import logo from "../../assets/logo.png";
import { useForm, Controller } from "react-hook-form";
import styles from "../styles/LoginStyles";
import colors from "../colors";
import * as yup from "yup";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
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
    password: yup
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .required("Senha é obrigatória"),
  });

  const onSubmit = async (data) => {
    try {
      await schema.validate(data, { abortEarly: false });
      console.log("Dados válidos:", data);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Sucesso",
        textBody: "Seja bem vindo de volta.",
      });
    } catch (error) {
      if (error.inner) {
        error.inner.forEach((err) => {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Ops",
            textBody: err.message,
          });
        });
      }
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

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPasswordScreen");
  };

  const handleGoToSignUp = () => {
    navigation.navigate("SignUpScreen");
  };

  return (
    <PaperProvider theme={theme}>
      <AlertNotificationRoot>
        <View style={styles.container}>
          <Image source={logo} style={styles.imageLogo} />
          <Text style={styles.textTitle}>Login</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="E-mail"
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
            name="email"
            rules={{ required: true }}
            defaultValue=""
          />
          {errors.email && (
            <Text style={{ color: colors.error }}>{errors.email.message}</Text>
          )}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Senha"
                mode="flat"
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    name={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                secureTextEntry={!showPassword}
                style={styles.textPassword}
                error={errors.password ? true : false}
              />
            )}
            name="password"
            rules={{ required: true }}
            defaultValue=""
          />
          {errors.password && (
            <Text style={{ color: colors.error }}>
              {errors.password.message}
            </Text>
          )}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          >
            Login
          </Button>
          <Button
            style={styles.linkForgotPassword}
            onPress={handleForgotPassword}
          >
            Esqueceu a senha?
          </Button>
          <View style={styles.containerText}>
            <Text>Don't have an account?</Text>
            <Button onPress={handleGoToSignUp} style={styles.link}>
              {" "}
              Sign Up
            </Button>
          </View>
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

export default LoginScreen;
