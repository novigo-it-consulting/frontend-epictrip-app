import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import ListItem from "./ListItem";
import { useNavigation } from '@react-navigation/native';
import { useSharedValue } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { getSampleData } from "../data/sampleData";

const ExploreCategories = () => {
  const [data, setData] = useState(null);
  const scrollX = useSharedValue(0);
  const { t } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSampleData(t);
        setData(result);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePress = (id) => {
    switch (id) {
      case 1:
        navigation.navigate('BookingScreen');
        break;
      case 2:
        navigation.navigate('ServiceScreen');
        break;
      case 5:
        navigation.navigate('ExperienceScreen');
        break;
      case 3:
        navigation.navigate('ConciergeDetails');
        break;
      // Outros casos, se necessário
    }
  };

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
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item, index }) => (
          <ListItem
            uri={item.uri}
            withIcon={!!item.icon}
            icon={item.icon}
            scrollX={scrollX}
            index={index}
            dataLength={data.length}
            title={item.title}
            id={item.id}
            onPress={handlePress}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#F8F8F8",
  },
  titlePage: {
    color: "#172B4D",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "left",
  },
  flatListContent: {
    paddingVertical: 16,
  },
});

export default ExploreCategories;
