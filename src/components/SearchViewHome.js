import React, { useState } from "react";

import { Searchbar } from "react-native-paper";

const SearchBarHome = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Searchbar
      style={{
        width: "100%",
        backgroundColor: "#F1F5F6",
        borderRadius: 12,
        marginTop: 30,
      }}
      placeholder="Try Disney, Food or Tickets"
      onChangeText={setSearchQuery}
      value={searchQuery}
      clearIcon
    />
  );
};

export default SearchBarHome;
