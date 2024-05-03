import React, { useState, useEffect } from "react";
import { View, Text, Image, Keyboard, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
  ActivityIndicator,
} from "react-native-paper";
import logo from "../../assets/logo.png";
import { useForm, Controller } from "react-hook-form";
import styles from "../styles/LoginStyles";
import colors from "../colors";
import * as yup from "yup";
import { requestLogin } from "../services/api";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
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
    password: yup
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .required("Senha é obrigatória"),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await schema.validate(data, { abortEarly: false });
      const response = await requestLogin(data);
      console.log(response);

      if (response.status === 200) {
        // Salvando as informações de login no AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(data));

        // Navega para a tela HomeScreen
        navigation.navigate("Home");
        return;
      } else {
        throw new Error("Erro ao efetuar login. Por favor, tente novamente."); // Lançamos um erro se o status não for 200
      }
    } catch (error) {
      // Tratamento de erros
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Se o erro foi retornado pela API
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: error.response.data.message,
        });
      } else {
        // Se ocorreu um erro inesperado
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody:
            "Erro ao efetuar login. Por favor, tente novamente mais tarde.",
        });
        console.error(error); // Registra o erro no console para depuração
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

  const handleForgotPassword = () => {
    navigation.navigate("FogotPassword");
  };

  const handleGoToSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <PaperProvider theme={theme}>
      <AlertNotificationRoot>
        <View onTouchStart={() => Keyboard.dismiss()} style={styles.container}>
          <Image source={logo} style={styles.imageLogo} />
          <Text style={styles.textTitle}>Login</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="E-mail"
                onSubmitEditing={Keyboard.dismiss}
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
            name="username"
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
                onSubmitEditing={Keyboard.dismiss}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-outline-off" : "eye-outline"}
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
            disabled={loading} // Desabilita o botão durante o carregamento
          >
            {loading ? ( // Renderiza o texto do botão com base no estado de carregamento
              <ActivityIndicator color={colors.white} />
            ) : (
              "Login"
            )}
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
