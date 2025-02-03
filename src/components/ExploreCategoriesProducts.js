import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import ListItem from "./ListItem";
import { useNavigation } from '@react-navigation/native';
import { useSharedValue } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import colors from "../colors";

const ExploreCategoriesProducts = ({ data }) => {
  const scrollX = useSharedValue(0);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handlePress = async (id, catName) => {
    navigation.navigate('OffersByCategory', { cat: id, catName: catName });
  };

  const onScroll = (e) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text>{t("loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        horizontal
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.categoryData.cat.categoryId.toString()}
        contentContainerStyle={styles.flatListContent} // Espaçamento interno
        renderItem={({ item, index }) => (
          <ListItem
            uri={item.uri} // Agora a URI será passada corretamente
            withIcon={!!item.icon}
            icon={item.icon}
            scrollX={scrollX}
            index={index}
            dataLength={data.length}
            title={item.categoryData.cat.categoryName}
            id={item.categoryData.cat.categoryId}
            onPress={() => handlePress(item.categoryData.cat.categoryId, item.categoryData.cat.categoryName)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200, // Defina uma altura adequada para o container
    paddingVertical: 16,
    backgroundColor: colors.backGroundLight,
  },
  flatListContent: {
    paddingHorizontal: 16, // Espaçamento horizontal para evitar cortes
  },
  titlePage: {
    color: "#172B4D",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "left",
  }
});

export default ExploreCategoriesProducts;