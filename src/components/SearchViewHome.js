import React, { useState, useEffect } from "react";
import { Searchbar } from "react-native-paper";
import Entypo from "@expo/vector-icons/Entypo";
import { StyleSheet } from "react-native";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const SearchBarHome = ({ widthDesired }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchbarWidth, setSearchbarWidth] = useState(0);

  // 2. Criar um estado para armazenar o texto traduzido do placeholder
  const [placeholderText, setPlaceholderText] = useState("Try Disney, Food or Tickets");

  // 3. useEffect para buscar a tradução
  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const translated = await translate("Try Disney, Food or Tickets", "en");
        setPlaceholderText(translated);
      } catch (error) {
        console.error("Falha ao buscar tradução do placeholder:", error);
      }
    };
    fetchTranslation();
  }, []);


  const styles = StyleSheet.create({
    searchBar: {
      width: widthDesired,
      backgroundColor: "#F1F5F6",
      borderRadius: 12,
    },
  });

  const getTruncatedText = () => {
    if (searchbarWidth === 0) return ''; // Retorna vazio até o layout ser medido

    const charWidthEstimate = 8; // Estimativa da largura de um caractere
    const maxChars = Math.floor(searchbarWidth / charWidthEstimate);

    // Usa o texto do placeholder do estado, que já foi traduzido
    return placeholderText.length > maxChars
      ? `${placeholderText.substring(0, maxChars - 3)}...`
      : placeholderText;
  };

  const handleLayout = (event) => {
    const newWidth = event.nativeEvent.layout.width;
    if (newWidth !== searchbarWidth) {
      setSearchbarWidth(newWidth);
    }
  };

  return (
    <Searchbar
      style={styles.searchBar}
      placeholder={getTruncatedText()}
      onLayout={handleLayout}
      onChangeText={setSearchQuery}
      value={searchQuery}
      icon={() => <Entypo name="magnifying-glass" size={24} color="#6C798F" />}
    />
  );
};

export default SearchBarHome;