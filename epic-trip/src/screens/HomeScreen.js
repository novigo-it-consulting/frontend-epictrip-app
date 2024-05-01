// HomeScreen.js
import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/LoginStyles";

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.goBack()}>Go Back</Button>
    </View>
  );
};

export default HomeScreen;
