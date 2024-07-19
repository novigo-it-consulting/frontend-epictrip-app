import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

const ChatBotton = () => {
  const [searchText, setSearchText] = useState("");

  const handleSend = () => {
    console.log("Send button pressed:", searchText);
    // Aqui você pode adicionar a lógica para o envio do texto de pesquisa
  };

  return (
    <View style={styles.container}>
      <View style={styles.topCard}>
        <Text></Text>
      </View>
      <View style={styles.bottomCard}>
        <TextInput
          style={styles.searchInput}
          placeholder="Digite sua mensagem..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#172B4D29",
  },
  topCard: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    height: 140, 
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    boxShadow: "0px 4px 8px 0px #172B4D14",
  },
  bottomCard: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    height: 110, 
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    boxShadow: "0px -4px 8px 0px #172B4D14",
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#F1F5F6",
    paddingHorizontal: 16,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    marginRight: 8,
  },
  sendButton: {
    height: 40,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatBotton;
