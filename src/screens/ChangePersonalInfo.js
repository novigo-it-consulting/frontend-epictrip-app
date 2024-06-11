import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  AlertNotificationRoot,
  Toast,
  ALERT_TYPE,
} from "react-native-alert-notification";
import { TextInput, RadioButton, Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import profilePhoto from "../../assets/profile/100.png";
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

const ChangePersonalInfo = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [autoLocation, setAutoLocation] = useState(null);
  const [userData, setUserData] = useState({
    userRole: "",
    email: "",
    fullName: "",
    documentNumber: "",
    birthDate: "",
    rental: "",
    gender: "",
    phone: "",
    language: "",
  });

  const handleGoBack = () => {
    navigation.navigate("ProfileScreen");
  };

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Toast.hide();
      }
    );

    getUserInfo();
    fetchLocation();

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const getUserInfo = async () => {
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found in AsyncStorage");
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "User ID not found in AsyncStorage",
      });
      return;
    }

    try {
      const response = await requestGetUser(userId);
      console.log("Dados Recebido", response.data.data);
      if (response.status === 200) {
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
        const age =
          new Date().getFullYear() - new Date(birthDate).getFullYear();

        setUserData({
          firstName,
          lastName,
          gender: gender === "Male" ? "first" : "second",
          age: age.toString(),
          email,
          userRole,
          phone,
          language,
          rental,
        });
      } else {
        console.error("Failed to fetch user info:", response.status);
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: `Failed to fetch user info: ${response.status}`,
        });
      }
    } catch (error) {
      console.error("An error occurred while fetching user info:", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: `An error occurred while fetching user info: ${error.message}`,
      });
    }
  };

  const fetchLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Permission to access location was denied",
      });
      return;
    }

    const { coords } = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords;

    const response = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    for (let item of response) {
      const address = ` ${item.region}, ${item.country}`;
      setAutoLocation(address);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in AsyncStorage");
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "User ID not found in AsyncStorage",
      });
      setLoading(false);
      return;
    }

    // Calcula a data de nascimento a partir da idade fornecida
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - parseInt(userData.age));
    const formattedBirthDate = birthDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD

    const updatedData = {
      fullName: `${userData.firstName} ${userData.lastName}`,
      gender: userData.gender === "first" ? "Male" : "Female",
      birthDate: formattedBirthDate,
      phone: userData.phone || "",
      documentNumber: userData.documentNumber || "",
      language: userData.language || "",
      userRole: userData.userRole || "",
      email: userData.email || "",
      rental: userData.rental || "",
    };

    try {
      const response = await requestUpdateUser(userId, updatedData);
      console.log("Dados Enviados PUT", response);

      if (response.status === 200) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Your personal information has been updated successfully.",
        });
        setTimeout(() => {
          setLoading(false);
          navigation.navigate("ProfileScreen");
        }, 5000);
      } else {
        console.error("Failed to update user info:", response.status);
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: `Failed to update user info: ${response.status}`,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("An error occurred while updating user info:", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: `An error occurred while updating user info: ${error.message}`,
      });
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access media library was denied");
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Permission to access media library was denied",
        });
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setUserData({ ...userData, profilePic: result.uri });
        try {
          const response = await changeProfilePic(result);
          if (response.status === 200) {
            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Success",
              textBody: "Your profile picture has been updated successfully.",
            });
          } else {
            console.error("Failed to update profile picture:", response.status);
            Toast.show({
              type: ALERT_TYPE.DANGER,
              title: "Error",
              textBody: `Failed to update profile picture: ${response.status}`,
            });
          }
        } catch (error) {
          console.error(
            "An error occurred while updating profile picture:",
            error
          );
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: `An error occurred while updating profile picture: ${error.message}`,
          });
        }
      }
    } catch (error) {
      console.error(
        "An error occurred while accessing media library permissions:",
        error
      );
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: `An error occurred while accessing media library permissions: ${error.message}`,
      });
    }
  };

  const defaultToastConfig = {
    titleStyle: { fontSize: 16, fontWeight: "bold" },
    textBodyStyle: { fontSize: 14 },
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.containerAlpha}>
            <View style={styles.containerBackButton}>
              <TouchableOpacity onPress={handleGoBack}>
                <IconButton icon={"arrow-left-thin"} size={30} />
              </TouchableOpacity>
            </View>
            <View style={styles.header}>
              <Text style={styles.headerText}>Personal Info</Text>
            </View>
            <View style={styles.profilePicContainer}>
              <Image
                style={styles.profilePic}
                source={
                  userData.profilePic
                    ? { uri: userData.profilePic }
                    : profilePhoto
                }
              />
              <Button
                icon="upload"
                mode="outlined"
                style={styles.uploadButton}
                onPress={pickImage}
              >
                Upload Imagem
              </Button>
            </View>
            <TextInput
              label={"First Name"}
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
              label={"Last Name"}
              value={userData?.lastName}
              onChangeText={(text) =>
                setUserData({ ...userData, lastName: text })
              }
              keyboardType="default"
              autoCapitalize="words"
              mode="flat"
              style={styles.input}
            />
            <TextInput
              label={"Location"}
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
                <RadioButton.Item label="Masculino" value="first" />
                <RadioButton.Item label="Feminino" value="second" />
              </View>
            </RadioButton.Group>
            <TextInput
              label={"Age"}
              value={userData.age}
              onChangeText={(text) => setUserData({ ...userData, age: text })}
              keyboardType="numeric"
              autoCapitalize="none"
              mode="flat"
              style={styles.input}
            />
            <Button
              mode="contained"
              style={styles.saveButton}
              onPress={handleSave}
              loading={loading}
            >
              Salvar
            </Button>
          </View>
        </TouchableWithoutFeedback>
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
    flex: 0.1,
  },
  header: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "85%",
  },
  headerText: {
    fontSize: 22,
  },
  profilePicContainer: {
    flex: 0.6,
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
    marginVertical: 5,
  },
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  saveButton: {
    width: "100%",
    marginBottom: 20,
    padding: 12,
    marginTop: 20,
  },
});

export default ChangePersonalInfo;
