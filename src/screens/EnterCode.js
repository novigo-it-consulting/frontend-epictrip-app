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
import screenNumberStyles from "../styles/ScreenNumberStyles";
import colors from "../colors";
import * as yup from "yup";
import { requestValidateToken } from "../services/api";
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
    token: yup
      .number()
      .required("E-mail é obrigatório")
      .min(6, "Máximo de 6 digitos"),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);

    try {
      await schema.validate(data, { abortEarly: false });
      const response = await requestValidateToken(data);
      // console.log(data);
      if (response.status === 200) {
        // console.log(JSON.stringify(response.data.jwt));
        await AsyncStorage.setItem("token", response.data.jwt);
        navigation.navigate("SetNewPassword");
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
        <View onTouchStart={() => Keyboard.dismiss()} style={styles.container}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <IconButton
              icon={"arrow-left-thin"}
              size={30}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Image source={LogoEnterCode} style={styles.imageLogo} />
          <Text style={styles.textTitle}>Enter Code</Text>

          <Text style={styles.linkPrivacy}>
            An 6 digit code has been sent to the your email. Check up in your
            box Spam to.
          </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Code"
                mode="flat"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                keyboardType="phone-pad"
                autoCapitalize="none"
                style={styles.textEmail}
                error={errors.token ? true : false}
              />
            )}
            name="token"
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
            disabled={loading} // Desabilita o botão durante o carregamento
          >
            {loading ? ( // Renderiza o texto do botão com base no estado de carregamento
              <ActivityIndicator color={colors.white} />
            ) : (
              "Continue"
            )}
          </Button>
        </View>
        <Toast />
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={screenNumberStyles.numberStyle}>07</Text>
        </View>
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
