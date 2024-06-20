import React, { useState } from "react";
import { Searchbar } from "react-native-paper";
import { useTranslation } from "react-i18next";

const SearchBarHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  return (
    <Searchbar
      style={{
        width: "100%",
        backgroundColor: "#F1F5F6",
        borderRadius: 12,
        marginTop: 30,
      }}
      placeholder={t("searchViewHome.searchEvents")}
      onChangeText={setSearchQuery}
      value={searchQuery}
      clearIcon
    />
  );
};

export default SearchBarHome;
