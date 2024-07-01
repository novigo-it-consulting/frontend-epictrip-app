import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import ListItem from "./ListItem";
import { useSharedValue } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { getSampleData } from "../data/sampleData";

const ExploreCategories = () => {
  const [data, setData] = useState([]);
  const scrollX = useSharedValue(0);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSampleData(t); 
        console.log("Data loaded:", result);
        setData(result);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    fetchData();
  }, [t]);

  const onScroll = (e) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.titlePage}>{t("exploreCategories.categories")}</Text>
        <Text>{t("loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titlePage}>{t("exploreCategories.categories")}</Text>
      <FlatList
        data={data}
        horizontal
        style={{ margin: 0 }}
        bounces={false}
        onScroll={onScroll} 
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <ListItem
            uri={item.uri}
            scrollX={scrollX}
            index={index}
            dataLength={data.length}
            title={item.title}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    flexDirection: "column",
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
