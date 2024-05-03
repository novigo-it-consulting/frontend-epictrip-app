import React from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/LoginStyles";

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleOnPressLogout = async () => {
    try {
      // Limpe o token do AsyncStorage
      await AsyncStorage.removeItem("token");
      // Navegue de volta para a tela de login
      navigation.navigate("Login");
    } catch (error) {
      console.log("Erro ao fazer logout:", error);
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
