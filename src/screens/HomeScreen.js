import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Button,
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import colors from "../colors";
import * as Location from "expo-location";
import styles from "../styles/globalScreen";
import {
  AlertNotificationRoot,
  Toast,
  ALERT_TYPE,
} from "react-native-alert-notification";
import { getDatabase, ref, set } from "firebase/database";
import app from "../firebase"

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userId, setUserId] = useState(null);
  const [displayCurrentAddress, setDisplayCurrentAddress] =
    useState("Localização....");
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);


  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync(); //returns true or false
    if (!enabled) {
      //if not enable
      Alert.alert("Location not enabled", "Please enable your Location", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      setLocationServicesEnabled(enabled); //store true into state
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync(); //used for the pop up box where we give permission to use location
    console.log(status);
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Allow the app to use the location services",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]
      );
    }

    //get current position lat and long
    const { coords } = await Location.getCurrentPositionAsync();
    console.log(coords);

    if (coords) {
      const { latitude, longitude } = coords;
      console.log(latitude, longitude);

      //provide lat and long to get the the actual address
      let responce = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      //loop on the responce to get the actual result
      for (let item of responce) {
        let address = `${item.name} ${item.city} ${item.region} ${item.country}`;
        setDisplayCurrentAddress(address);
      }
    }
  };

  const navigation = useNavigation();

  const handleOnPressLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("Login");
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: error.message,
      });
    }
  };
  
  const updateLocationInFirebase = async (coords, user) => {
    try {
      const db = await getDatabase(app);
      await set(ref(db, `users/${user}`), {
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: Date.now(),
      });
    } catch (error) {
      // console.log(error.message);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: error.message,
      });
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permissão para acessar a localização foi negada");
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Permissão",
        textBody: errorMsg,
      });
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    updateLocationInFirebase(location.coords, await AsyncStorage.getItem("userId"));
  };

  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
    getLocation();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView />
      <AlertNotificationRoot>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? null : null}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-around",
              flex: 1,
              width: "75%",
              marginRight: "auto",
              marginLeft: "auto",
            }}
          >
            <View style={styles.container}>
              <Text
                style={{
                  marginBottom: "5%",
                  fontWeight: "bold",
                  color: colors.primary,
                }}
              >
                ID de usuário:
              </Text>
              <Text style={styles.link}>{`${userId}`}</Text>
              <Text style={{ marginTop: "20%" }}>{displayCurrentAddress}</Text>
              {errorMsg && <Text>{errorMsg}</Text>}
              <Button title="Obter Localização" onPress={getLocation} />
              <Button onPress={handleOnPressLogout}>Logout</Button>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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

export default HomeScreen;
