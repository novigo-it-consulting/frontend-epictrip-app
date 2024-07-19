// BlankScreenWithFooter.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChatBotton from "../components/ChatBotton";

const ChatNotification = () => {
  const navigation = useNavigation();

  const navigateToNextScreen = () => {
    navigation.navigate(""); // Altere "NextScreen" para o nome da tela de destino
  };

  return (
 
      <ChatBotton />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#172B4D",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  footerText: {
    fontSize: 18,
    color: "#007BFF",
  },
});

export default ChatNotification;
