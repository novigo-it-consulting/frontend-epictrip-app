import React, { useState } from "react";
import { Searchbar, IconButton } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Entypo from '@expo/vector-icons/Entypo';

const SearchBarHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  return (
    <Searchbar
      style={{
        width: "90%",
        backgroundColor: "#F1F5F6",
        borderRadius: 12,
      }}
      placeholder={t("searchViewHome.searchEvents")}
      onChangeText={setSearchQuery}
      value={searchQuery}
      icon={() => <Entypo name="magnifying-glass" size={24} color="#6C798F" />}
      />
  );
};

export default SearchBarHome;
