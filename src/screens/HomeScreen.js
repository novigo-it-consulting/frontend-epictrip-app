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
import "firebase/database";
import styles from "../styles/globalScreen";
import {
  AlertNotificationRoot,
  Toast,
  ALERT_TYPE,
} from "react-native-alert-notification";
import { getDatabase, ref, set } from "firebase/database";
import app from "../firebase";

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userId, setUserId] = useState(null);

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

  useEffect(() => {
    getLocation();
  }, []);

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
    setLocation(location.coords);
    updateLocationInFirebase(location.coords);

    setUserId(await AsyncStorage.getItem("userId"));
    console.log(userId);
  };

  const updateLocationInFirebase = async (coords) => {
    try {
      const db = getDatabase();
      const tempUserId = userId; // Substituir pelo user.id
      await set(ref(db, `users/${tempUserId}`), {
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
              <Text style={styles.link}>{`ID de usuário: ${userId}`}</Text>
              <Text> </Text>
              <Text>Latitude: {location ? location.latitude : "---"}</Text>
              <Text>Longitude: {location ? location.longitude : "---"}</Text>
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
