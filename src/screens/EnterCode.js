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
import logo from "../../assets/logo.png";
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
import { useTranslation } from "react-i18next";

const EnterCodeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

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
          <Image source={logo} style={styles.imageLogo} />
          <Text style={styles.textTitle}>{t("enterCode.title")}</Text>

          <Text style={styles.linkPrivacy}>{t("enterCode.subTitle")}</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label={t("enterCode.codeLabel")}
                mode="flat"
                onBlur={onBlur}
                left={<TextInput.Icon icon="shield-check-outline" />}
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

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              t("enterCode.continueButton")
            )}
          </Button>
        </View>
        <Toast />
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
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

export default EnterCodeScreen;
