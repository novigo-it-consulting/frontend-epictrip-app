import React from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/HomeStyles";

const HomeScreen = () => {
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

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button onPress={handleOnPressLogout}>Logout</Button>
    </View>
  );
};

export default HomeScreen;
