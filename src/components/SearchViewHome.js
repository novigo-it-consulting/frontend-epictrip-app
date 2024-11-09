import React, { useState } from "react";
import { Searchbar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Entypo from '@expo/vector-icons/Entypo';

const SearchBarHome = ({ wid }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchbarWidth, setSearchbarWidth] = useState(0);
  const { t } = useTranslation();
  const placeholderText = t("searchViewHome.searchEvents");

  const getTruncatedText = () => {
    const charWidthEstimate = 8;
    const maxChars = Math.floor(searchbarWidth / charWidthEstimate);
    return placeholderText.length > maxChars ? `${placeholderText.substring(0, maxChars - 3)}...` : placeholderText;
  };

  return (
    <Searchbar
      style={{
        width: wid === null ? "90%" : wid,
        backgroundColor: "#F1F5F6",
        borderRadius: 12,
      }}
      placeholder={getTruncatedText()}
      onLayout={(event) => setSearchbarWidth(event.nativeEvent.layout.width)}
      onChangeText={setSearchQuery}
      value={searchQuery}
      icon={() => <Entypo name="magnifying-glass" size={24} color="#6C798F" />}
    />
  );
};

export default SearchBarHome;
