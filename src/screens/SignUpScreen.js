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
  ScrollView,
  SafeAreaView
} from "react-native";
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
  ActivityIndicator,
  Chip,
} from "react-native-paper";
import logo from "../../assets/logo.png";
import { useForm, Controller } from "react-hook-form";
import styles from "../styles/globalScreen.js";
import screenNumberStyles from "../styles/ScreenNumberStyles";
import colors from "../colors";
import { requestSignUpGuest } from "../services/api";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { translate } from "../services/translations/translateServices";

const SignUpScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");

  const [t, setT] = useState({
    signUp: "Sign Up",
    fullName: "Full Name",
    email: "E-mail",
    shareNumber: "Share Number",
    phone: "Phone",
    language: "Language",
    spanish: "Spanish",
    english: "English",
    portuguese: "Portuguese",
    bySigningUp: "By signing up, you agree to our",
    privacyPolicy: " Privacy Policy ",
    andOur: "and our",
    terms: " Terms and Conditions ",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign In",
    errorCreatingAccount: "Error creating your account. Please try again later.",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const translations = await Promise.all([
          translate("Sign Up", "en"),
          translate("Full Name", "en"),
          translate("E-mail", "en"),
          translate("Share Number", "en"),
          translate("Phone", "en"),
          translate("Language", "en"),
          translate("Spanish", "en"),
          translate("English", "en"),
          translate("Portuguese", "en"),
          translate("By signing up, you agree to our", "en"),
          translate(" Privacy Policy ", "en"),
          translate("and our", "en"),
          translate(" Terms and Conditions ", "en"),
          translate("Already have an account?", "en"),
          translate("Sign In", "en"),
          translate("Error creating your account. Please try again later.", "en"),
        ]);
        setT({
          signUp: translations[0], fullName: translations[1], email: translations[2],
          shareNumber: translations[3], phone: translations[4], language: translations[5],
          spanish: translations[6], english: translations[7], portuguese: translations[8],
          bySigningUp: translations[9], privacyPolicy: translations[10], andOur: translations[11],
          terms: translations[12], alreadyHaveAccount: translations[13], signIn: translations[14],
          errorCreatingAccount: translations[15],
        });
      } catch (error) {
        console.error("Falha ao buscar traduções:", error);
      }
    };
    fetchTranslations();
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await requestSignUpGuest(data);
      if (response.status === 201) {
        navigation.navigate("Login");
      } else {
        throw new Error(t.errorCreatingAccount);
      }
    } catch (error) {
      const message = error?.response?.data?.message || t.errorCreatingAccount;
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValue("language", "EN");
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => Toast.hide()
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
      <AlertNotificationRoot>
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={combinedStyles.keyboardAvoidingView}
            >
              <View style={styles.containerBackButton}>
                <Image source={logo} style={styles.imageLogo} />
              </View>
              <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                <View style={styles.container}>
                  <Text style={styles.textTitle}>{t.signUp}</Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label={t.fullName}
                        mode="flat"
                        left={<TextInput.Icon icon="account-outline" />}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="words"
                        style={styles.textEmail}
                        error={!!errors.fullName}
                      />
                    )}
                    name="fullName"
                    rules={{ required: true }}
                  />
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label={t.email}
                        mode="flat"
                        left={<TextInput.Icon icon="at" />}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.textEmail}
                        error={!!errors.email}
                      />
                    )}
                    name="email"
                    rules={{ required: true }}
                  />
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label={t.shareNumber}
                        mode="flat"
                        left={<TextInput.Icon icon="account-group-outline" />}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="none"
                        style={styles.textEmail}
                        error={!!errors.shareNumber}
                      />
                    )}
                    name="shareNumber"
                    rules={{ required: true }}
                  />
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label={t.phone}
                        mode="flat"
                        left={<TextInput.Icon icon="phone-outline" />}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        style={styles.textPassword}
                        error={!!errors.phone}
                        keyboardType="phone-pad"
                      />
                    )}
                    name="phone"
                    rules={{ required: true }}
                  />

                  <Text style={styles.textLabel}>{t.language}</Text>
                  <View style={combinedStyles.chipsContainer}>
                    <Chip
                      selected={selectedLanguage === "ES"}
                      onPress={() => {
                        setSelectedLanguage("ES");
                        setValue("language", "ES");
                      }}
                      style={[combinedStyles.chip, selectedLanguage === "ES" && combinedStyles.selectedChip]}
                      textStyle={{ color: selectedLanguage === "ES" ? "white" : "black" }}
                    >
                      {t.spanish}
                    </Chip>
                    <Chip
                      selected={selectedLanguage === "EN"}
                      onPress={() => {
                        setSelectedLanguage("EN");
                        setValue("language", "EN");
                      }}
                      style={[combinedStyles.chip, selectedLanguage === "EN" && combinedStyles.selectedChip]}
                      textStyle={{ color: selectedLanguage === "EN" ? "white" : "black" }}
                    >
                      {t.english}
                    </Chip>
                    <Chip
                      selected={selectedLanguage === "PT"}
                      onPress={() => {
                        setSelectedLanguage("PT");
                        setValue("language", "PT");
                      }}
                      style={[combinedStyles.chip, selectedLanguage === "PT" && combinedStyles.selectedChip]}
                      textStyle={{ color: selectedLanguage === "PT" ? "white" : "black" }}
                    >
                      {t.portuguese}
                    </Chip>
                  </View>

                  <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    style={styles.button}
                    disabled={loading}
                  >
                    {loading ? <ActivityIndicator color={colors.white} /> : t.signUp}
                  </Button>
                  <Text style={styles.linkPrivacy}>
                    {t.bySigningUp}
                    <Text style={styles.link} onPress={() => navigation.navigate("Terms")}>
                      {t.privacyPolicy}
                    </Text>
                    {t.andOur}
                    <Text style={styles.link} onPress={() => navigation.navigate("Terms")}>
                      {t.terms}
                    </Text>
                  </Text>
                </View>
              </ScrollView>

              <View style={styles.containerText}>
                <Text>{t.alreadyHaveAccount}</Text>
                <Button onPress={handleGoToSignIn} style={styles.link}>
                  {t.signIn}
                </Button>
                <Text style={screenNumberStyles.numberStyle}>03</Text>
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
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '85%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  chipsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: 'center',
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: "#E0E0E0",
    flex: 1,
    marginHorizontal: 4,
  },
  selectedChip: {
    backgroundColor: colors.primary,
  },
});

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
  },
};

export default SignUpScreen;