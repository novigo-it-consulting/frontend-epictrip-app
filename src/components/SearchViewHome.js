import React, { useState, useEffect } from "react";
import { Searchbar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Entypo from "@expo/vector-icons/Entypo";
import { StyleSheet } from "react-native";

const SearchBarHome = ({ widthDesired }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchbarWidth, setSearchbarWidth] = useState(0);
  const { t } = useTranslation();
  const placeholderText = t("searchViewHome.searchEvents");

  const styles = StyleSheet.create({
    searchBar: {
      width: widthDesired,
      backgroundColor: "#F1F5F6",
      borderRadius: 12,
    },
  });

  const getTruncatedText = () => {
    const charWidthEstimate = 8;
    const maxChars = Math.floor(searchbarWidth / charWidthEstimate);
    return placeholderText.length > maxChars ? `${placeholderText.substring(0, maxChars - 3)}...` : placeholderText;
  };

  // Evita chamadas desnecessárias de setSearchbarWidth
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
