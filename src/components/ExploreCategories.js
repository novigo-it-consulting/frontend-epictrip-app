import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import ListItem from "./ListItem";
import { useSharedValue } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { getSampleData } from "../data/sampleData";

const ExploreCategories = () => {
  const [data, setData] = useState(null);
  const scrollX = useSharedValue(0);
  const { t } = useTranslation();

  const backupData = [
    { id: 0, title: "sampleData.categoryBooking", uri: "https://epictrip-dev.s3.amazonaws.com/category-icons/1.png" }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSampleData(t); 
        console.log("Data loaded:", result);
        await setData(result);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    fetchData();
  }, []);

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
          bounces={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          // renderItem={({ item, index }) => {
          //   // console.log(item.title);
          //     // <ListItem
          //     //   style={styles.listItem}
          //     //   uri={item.uri}
          //     //   scrollX={scrollX}
          //     //   index={0}
          //     //   dataLength={data.length}
          //     //   title={item.title}
          //     // />
          //     <View style={{backgroundColor: "blue", width: "100%", display: "flex"}}>
          //       <Text style={styles.itemText}>{item.title}</Text>
          //     </View>
          renderItem={({ item }) => (
              <ListItem
                style={styles.listItem}
                uri={item.uri}
                scrollX={scrollX}
                index={0}
                dataLength={data.length}
                title={item.title}
              />
            // <View style={{ backgroundColor: "blue", marginHorizontal: 10 }}>
            //   <Text style={styles.itemText}>{item.title}</Text>
            // </View>
          )}
        />
    </View>
)}

const styles = StyleSheet.create({
  containerText: {
    backgroundColor: "green",
    width: 100,
    height: 100
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
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
