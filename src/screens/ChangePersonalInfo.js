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
import { AlertNotificationRoot, Toast } from "react-native-alert-notification";
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
  const [autoLocation, setAutoLocation] = useState(null);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    gender: "first",
    age: "",
    profilePic: null,
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

    console.log(userId);
    if (!userId) {
      console.error("User ID not found in AsyncStorage");
      return;
    }

    try {
      const response = await requestGetUser(userId);
      if (response.status === 200) {
        const { fullName, location, gender, birthDate, profilePic } =
          response.data.data;
        const [firstName, lastName] = fullName.split(" ");
        const age =
          new Date().getFullYear() - new Date(birthDate).getFullYear();

        setUserData({
          firstName,
          lastName,
          gender: gender === "Male" ? "first" : "second",
          age: age.toString(),
          profilePic,
        });
      } else {
        console.error("Failed to fetch user info:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while fetching user info:", error);
    }
  };

  const fetchLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
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
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in AsyncStorage");
      return;
    }

    const updatedData = {
      fullName: `${userData.firstName} ${userData.lastName}`,
      location: userData.location,
      gender: userData.gender === "first" ? "Male" : "Female",
      birthDate: new Date().getFullYear() - parseInt(userData.age),
    };

    try {
      const response = await requestUpdateUser(userId, updatedData); // Pass userId and updatedData
      if (response.status === 200) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Your personal information has been updated successfully.",
        });
        navigation.navigate("ProfileScreen");
      } else {
        console.error("Failed to update user info:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while updating user info:", error);
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access media library was denied");
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
          const response = await changeProfilePic(result); // Chamar a função de atualização da imagem de perfil
          if (response.status === 200) {
            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Success",
              textBody: "Your profile picture has been updated successfully.",
            });
            // Atualizar opcionalmente a imagem de perfil do usuário no estado local ou contexto
          } else {
            console.error("Failed to update profile picture:", response.status);
          }
        } catch (error) {
          console.error(
            "An error occurred while updating profile picture:",
            error
          );
        }
      }
    } catch (error) {
      console.error(
        "An error occurred while accessing media library permissions:",
        error
      );
    }
  };

  return (
    <>
      <SafeAreaView />
      <AlertNotificationRoot theme={"light"}>
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
