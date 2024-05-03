import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
  ActivityIndicator,
} from "react-native-paper";
import logo from "../../assets/logo.png";
import { useForm, Controller } from "react-hook-form";
import styles from "../styles/SignUpStyle";
import colors from "../colors";
import * as yup from "yup";
import requestLogin from "../services/api";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { Link } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUpScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

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
      const response = await requestLogin(data);

      if (response.status === 200) {
        await AsyncStorage.setItem("userData", JSON.stringify(data));
        navigation.navigate("Home");
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

  useEffect(() => {
    const checkLoggedIn = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        navigation.navigate("Home");
      }
    };
    checkLoggedIn();
  }, []);

  const handleGoToSignIn = () => {
    navigation.navigate("Login");
  };

  return (
    <PaperProvider theme={theme}>
      <AlertNotificationRoot>
        <View style={styles.container}>
          <Image source={logo} style={styles.imageLogo} />
          <Text style={styles.textTitle}>Sign Up</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
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
                label="Share Number"
                mode="flat"
                left={<TextInput.Icon icon="account-group-outline" />}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.textEmail}
                error={errors.email ? true : false}
              />
            )}
            name="shareNumber"
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
                label="Phone"
                mode="flat"
                left={<TextInput.Icon icon="phone-outline" />}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                style={styles.textPassword}
                error={errors.phone ? true : false}
                keyboardType="phone-pad"
              />
            )}
            name="phone"
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
          <Text style={styles.linkPrivacy}>
            By signin up, you agree to our{" "}
            <Link style={styles.link} to={"https://qa.myepictrip.app"}>
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link style={styles.link} to={"https://qa.myepictrip.app"}>
              Terms & Conditions
            </Link>{" "}
          </Text>

          <View style={styles.containerText}>
            <Text>Already have an account?</Text>
            <Button onPress={handleGoToSignIn} style={styles.link}>
              {" "}
              Sign In
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

export default SignUpScreen;
