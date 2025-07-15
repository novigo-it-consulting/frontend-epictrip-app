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
  Alert,
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
import { useTranslation } from "react-i18next";
import DatePickerAge from "../components/DatePickerAge";
import CustomTabBar from "../components/CustomBar";

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
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

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
            title: t("changePersonalInfo.alertError"),
            textBody: t("changePersonalInfo.loadingData"),
          });
          setLoading(false);
        });
    }
  }, [initialDataLoaded, t]);

  const handleGoBack = () => {
    navigation.navigate("ProfileScreen");
  };

  const getUserInfo = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t("changePersonalInfo.alertError"),
        textBody: t("changePersonalInfo.notFoundAsyncStorage"),
      });
      setLoading(false);
      return;
    }

    try {
      const response = await requestGetUser(userId);
      if (response.status === 200) {
        const { profilePic, fullName, gender, birthDate, email, phone, userRole, language, rental } = response.data.data;
        setProfilePhoto(profilePic);
        const [firstName, lastName] = fullName ? fullName.split(" ") : ["", ""];
        const age = birthDate ? new Date(birthDate) : new Date();

        setUserData({ firstName, lastName, gender, age, email, userRole, phone, language, rental });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t("changePersonalInfo.alertError"),
          textBody: t("changePersonalInfo.failedUserInfo"),
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t("changePersonalInfo.alertError"),
        textBody: t("changePersonalInfo.failedUserInfo"),
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: t("changePersonalInfo.alertAttention"),
        textBody: t("changePersonalInfo.locationPermissionDenied"),
      });
      return;
    }

    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      const response = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (response.length > 0) {
        const { city, region, country } = response[0];
        setAutoLocation(`${city} - ${region}, ${country}`);
      }
    } catch (error) {
      console.error("Error fetching location: ", error);
    }
  };

  const handleSave = async () => {
    if (!userData.firstName || !userData.lastName || !userData.age) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: t("changePersonalInfo.alertAttention"),
        textBody: t("changePersonalInfo.errorEmptyField"),
      });
      return;
    }

    setLoading(true);
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t("changePersonalInfo.alertError"),
        textBody: t("changePersonalInfo.notFoundAsyncStorage"),
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
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: t("changePersonalInfo.alertSuccess"),
          textBody: t("changePersonalInfo.updateSuccess"),
        });
        setTimeout(() => {
          navigation.navigate("ProfileScreen");
        }, 2000);
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t("changePersonalInfo.alertError"),
          textBody: t("changePersonalInfo.failedUpdateUserInfo"),
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t("changePersonalInfo.alertError"),
        textBody: t("changePersonalInfo.failedUpdate"),
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (result) => {
    if (!result.canceled) {
      setLoading(true);
      try {
        const response = await changeProfilePic(result.assets[0]);
        if (response.status === 200) {
          setProfilePhoto(response.data.data.profilePic);
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: t("changePersonalInfo.alertSuccess"),
            textBody: t("changePersonalInfo.pictureUpdate"),
          });
        } else {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: t("changePersonalInfo.alertError"),
            textBody: t("changePersonalInfo.failedUpdatePicture"),
          });
        }
      } catch (error) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t("changePersonalInfo.alertError"),
          textBody: t("changePersonalInfo.failedUpdatePicture"),
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("changePersonalInfo.permissionRequired"),
        t("changePersonalInfo.cameraPermissionDenied")
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    await uploadImage(result);
  };

  const chooseFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("changePersonalInfo.permissionRequired"),
        t("changePersonalInfo.galleryPermissionDenied")
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    await uploadImage(result);
  };

  const handleChoosePhoto = () => {
    Alert.alert(
      t("changePersonalInfo.changePhotoTitle"),
      t("changePersonalInfo.changePhotoMessage"),
      [
        {
          text: t("changePersonalInfo.takePhoto"),
          onPress: takePhoto,
        },
        {
          text: t("changePersonalInfo.chooseFromGallery"),
          onPress: chooseFromGallery,
        },
        {
          text: t("changePersonalInfo.cancel"),
          style: "cancel",
        },
      ]
    );
  };

  return (
    <>
      <AlertNotificationRoot theme={"light"}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.backGroundLight }}>
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
                  <Text style={styles.headerText}>
                    {t("changePersonalInfo.personalInfo")}
                  </Text>
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
                    onPress={handleChoosePhoto}
                  >
                    {t("changePersonalInfo.buttonUploadImage")}
                  </Button>
                </View>
                <TextInput
                  label={t("changePersonalInfo.labelFirstName")}
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
                  label={t("changePersonalInfo.labelLastName")}
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
                  label={t("changePersonalInfo.labelLocation")}
                  disabled
                  value={autoLocation || ""}
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
                      label={t("changePersonalInfo.genderM")}
                      value="Male"
                    />
                    <RadioButton.Item
                      label={t("changePersonalInfo.genderF")}
                      value="Female"
                    />
                    <RadioButton.Item label={t("changePersonalInfo.genderOther")} value="Other" />
                  </View>
                </RadioButton.Group>
                <DatePickerAge userData={userData} updateUserData={setUserData} />
                <Button
                  mode="contained"
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  {t("changePersonalInfo.buttonSave")}
                </Button>
              </View>
            </TouchableWithoutFeedback>
          )}
        </SafeAreaView>
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
    flex: 1,
    backgroundColor: colors.backGroundLight,
  },
  containerBackButton: {
    justifyContent: "space-around",
    alignItems: "flex-start",
    marginLeft: -15,
    flexDirection: "column",
  },
  header: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "85%",
    marginTop: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "500",
  },
  profilePicContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
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
    marginBottom: 5,
  },
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginRight: "auto",
    marginLeft: 12,
    marginTop: 10,
  },
  saveButton: {
    width: "100%",
    padding: 8,
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