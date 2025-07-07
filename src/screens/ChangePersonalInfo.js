import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import {
  AlertNotificationRoot,
  Toast,
  ALERT_TYPE,
} from "react-native-alert-notification";
import { TextInput, RadioButton, Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import colors from "../colors";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  requestGetUser,
  requestUpdateUser,
  changeProfilePic,
} from "../services/api";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import DatePickerAge from "../components/DatePickerAge";
import CustomTabBar from "../components/CustomBar";
// Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const ChangePersonalInfo = () => {
  const navigation = useNavigation();
  const [autoLocation, setAutoLocation] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    gender: "first",
    age: new Date(),
  });
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Criar um estado para armazenar todos os textos traduzidos
  const [t, setT] = useState({
    personalInfo: "Personal Info",
    uploadImage: "Upload Image",
    firstName: "First Name",
    lastName: "Last Name",
    location: "Location",
    male: "Male",
    female: "Female",
    other: "Other",
    save: "Save",
    permissionDenied: "Permission to access the photo library was denied.",
  });

  // useEffect para buscar todas as traduções
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [
          personalInfo, uploadImage, firstName, lastName, location,
          male, female, other, save, permissionDenied
        ] = await Promise.all([
          translate("Personal Info", "en"),
          translate("Upload Image", "en"),
          translate("First Name", "en"),
          translate("Last Name", "en"),
          translate("Location", "en"),
          translate("Male", "en"),
          translate("Female", "en"),
          translate("Other", "en"),
          translate("Save", "en"),
          translate("Permission to access the photo library was denied.", "en"),
        ]);
        setT({
          personalInfo, uploadImage, firstName, lastName, location,
          male, female, other, save, permissionDenied
        });
      } catch (error) {
        console.error("Falha ao buscar traduções:", error);
      }
    };
    fetchTranslations();
  }, []);

  const getUserInfo = async () => {
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: "User ID not found in AsyncStorage.",
      });
      return;
    }
    try {
      const response = await requestGetUser(userId);
      if (response.status === 200) {
        const { profilePic } = response.data.data;
        setProfilePhoto(profilePic);
        const {
          fullName,
          gender,
          birthDate,
          email,
          phone,
          userRole,
          language,
          rental,
        } = response.data.data;
        const [firstName, lastName] = fullName.split(" ");
        const age = new Date(birthDate);
        setUserData({
          firstName,
          lastName,
          gender,
          age,
          email,
          userRole,
          phone,
          language,
          rental,
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: "Failed to update user information",
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: "Failed to update user information",
      });
    }
  };

  const fetchLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLoading(false);
      return;
    }

    const { coords } = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords;
    const response = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (response.length > 0) {
      const { city, region, country } = response[0];
      setAutoLocation(`${city} - ${region}, ${country}`);
    }
  };

  useEffect(() => {
    if (!initialDataLoaded) {
      Promise.all([getUserInfo(), fetchLocation()])
        .then(() => {
          setLoading(false);
          setInitialDataLoaded(true);
        })
        .catch((error) => {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Ops",
            textBody: "Error loading initial data.",
          });
          setLoading(false);
        });
    }
  }, [initialDataLoaded]);

  const handleGoBack = () => {
    navigation.navigate("ProfileScreen");
  };

  const handleSave = async () => {
    if (!userData.firstName || !userData.lastName || !userData.age) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Attention",
        textBody: "Please fill out all required fields.",
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: "User ID not found in AsyncStorage.",
      });
      setLoading(false);
      return;
    }

    const updatedData = {
      fullName: `${userData.firstName} ${userData.lastName}`,
      gender: userData.gender || "",
      birthDate: userData.age || "",
      phone: userData.phone || "",
      documentNumber: userData.documentNumber || "",
      language: userData.language || "",
      userRole: userData.userRole || "",
      email: userData.email || "",
      rental: userData.rental || "",
    };

    try {
      const response = await requestUpdateUser(userId, updatedData);

      if (response.status === 200) {
        setUserData(updatedData);
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Success",
        });
        setTimeout(() => {
          setLoading(false);
          navigation.navigate("ProfileScreen");
        }, 5000);
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: "Failed to update user information",
        });
        setLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: "Failed to update user information",
      });
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: t.permissionDenied,
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setLoading(true);
      try {
        const response = await changeProfilePic(result);
        setProfilePhoto(response.data);
        if (response.status === 200) {
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Success",
            textBody: "Your profile picture has been successfully updated.",
          });
          return setLoading(false);
        } else {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: "Failed to update profile picture",
          });
        }
      } catch (error) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: "Failed to update profile picture",
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

  const defaultToastConfig = {
    autoClose: 3000,
    titleStyle: { fontSize: 16, fontWeight: "bold" },
  };
  const lightColors = {
    label: "#000",
    card: "#fcfcfc",
    overlay: "#f0f0f0",
    success: "#28a745",
    danger: "rgba(255, 0, 0, 1)",
    warning: "#ffc107",
  };

  return (
    <>
      <AlertNotificationRoot
        toastConfig={defaultToastConfig}
        colors={[lightColors]}
        theme={"light"}
      >
        <SafeAreaView />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.containerAlpha}>
              <View style={styles.containerBackButton}>
                <TouchableOpacity onPress={handleGoBack}>
                  <IconButton icon={"arrow-left-thin"} size={30} />
                </TouchableOpacity>
              </View>
              <View style={styles.header}>
                <Text style={styles.headerText}>{t.personalInfo}</Text>
              </View>
              <View style={styles.profilePicContainer}>
                <Image
                  style={styles.profilePic}
                  source={
                    profilePhoto
                      ? { uri: profilePhoto }
                      : require("../../assets/profile/profileIcon.png")
                  }
                />
                <Button
                  icon="upload"
                  mode="outlined"
                  style={styles.uploadButton}
                  onPress={pickImage}
                >
                  {t.uploadImage}
                </Button>
              </View>
              <TextInput
                label={t.firstName}
                value={userData.firstName}
                onChangeText={(text) =>
                  setUserData({ ...userData, firstName: text })
                }
                keyboardType="default"
                autoCapitalize="words"
                mode="flat"
                style={styles.input}
              />
              <TextInput
                label={t.lastName}
                value={userData.lastName}
                onChangeText={(text) =>
                  setUserData({ ...userData, lastName: text })
                }
                keyboardType="default"
                autoCapitalize="words"
                mode="flat"
                style={styles.input}
              />
              <TextInput
                label={t.location}
                disabled
                value={autoLocation}
                keyboardType="default"
                autoCapitalize="words"
                mode="flat"
                style={styles.input}
              />
              <RadioButton.Group
                onValueChange={(value) =>
                  setUserData({ ...userData, gender: value })
                }
                value={userData.gender}
              >
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Item
                    label={t.male}
                    value="Male"
                  />
                  <RadioButton.Item
                    label={t.female}
                    value="Female"
                  />
                  <RadioButton.Item label={t.other} value="Other" />
                </View>
              </RadioButton.Group>
              <DatePickerAge userData={userData} updateUserData={setUserData} />
              <Button
                mode="contained"
                style={styles.saveButton}
                onPress={handleSave}
              >
                {t.save}
              </Button>
            </View>
          </TouchableWithoutFeedback>
        )}
        <CustomTabBar />
      </AlertNotificationRoot>
    </>
  );
};

const styles = StyleSheet.create({
  containerAlpha: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "85%",
    marginLeft: "auto",
    marginRight: "auto",
    flex: 0.98,
    backgroundColor: colors.backGroundLight,
  },
  containerBackButton: {
    justifyContent: "space-around",
    alignItems: "flex-start",
    marginLeft: -15,
    flexDirection: "column",
    flex: 0.1,
  },
  header: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "85%",
  },
  headerText: {
    fontSize: 26,
    fontWeight: "500",
  },
  profilePicContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  profilePic: {
    marginBottom: 12,
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  uploadButton: {
    width: "80%",
  },
  input: {
    width: "100%",
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginRight: "auto",
    marginLeft: 12
  },
  saveButton: {
    width: "100%",
    marginBottom: 20,
    padding: 12,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backGroundLight,
  },
});

export default ChangePersonalInfo;