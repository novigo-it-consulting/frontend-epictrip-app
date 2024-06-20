import React from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import ListItem from "./ListItem";
import { sampleData } from "../data/sampleData";
import { useSharedValue } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

const ExploreCategories = () => {
  const scrollX = useSharedValue(0);
  const onScroll = (e) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };
  const { t } = useTranslation();


  return (
    <View style={styles.container}>
      <Text style={styles.titlePage}>{t("exploreCategories.categories")}</Text>
      <FlatList
        data={sampleData}
        horizontal
        style={{ margin: 0 }}
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={18}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <ListItem
            uri={item.uri}
            scrollX={scrollX}
            index={index}
            dataLength={sampleData.length}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    flexDirection: "columm",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "85%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  titlePage: {
    color: "#172B4D",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ExploreCategories;
