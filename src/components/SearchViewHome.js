import React, { useState } from 'react';
import { Searchbar } from "react-native-paper";
import Entypo from "@expo/vector-icons/Entypo";
import { StyleSheet } from "react-native";
import { useTranslation } from 'react-i18next';

const SearchBarHome = ({ widthDesired }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const styles = StyleSheet.create({
    searchBar: {
      width: widthDesired || '100%', // Usa a largura desejada ou 100% como padrão
      backgroundColor: "#F1F5F6",
      borderRadius: 12,
    },
  });

  return (
    <Searchbar
      style={styles.searchBar}
      placeholder={t('searchViewHome.searchEvents')}
      onChangeText={setSearchQuery}
      value={searchQuery}
      icon={() => <Entypo name="magnifying-glass" size={24} color="#6C798F" />}
    />
  );
};

export default SearchBarHome;
