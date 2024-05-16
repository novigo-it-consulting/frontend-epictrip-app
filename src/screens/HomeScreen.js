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
import firebase from "../../firebase";
import "firebase/database";
import styles from "../styles/globalScreen";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { getDatabase, ref, set } from "firebase/database";

const HomeScreen = () => {
  // Estado para armazenar a localização do usuário
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const navigation = useNavigation();

  const handleOnPressLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      n;
      navigation.navigate("Login");
    } catch (error) {
      alert("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permissão para acessar a localização foi negada");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
    updateLocationInFirebase(location.coords);
  };

  const updateLocationInFirebase = async (coords) => {
    try {
      const db = getDatabase();
      const userId = "userId1"; // Substitua pelo ID do usuário atual
      await set(ref(db, `users/${userId}`), {
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Erro ao atualizar localização no Firebase:", error);
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
