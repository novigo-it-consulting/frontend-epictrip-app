import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useSharedValue } from "react-native-reanimated";
import colors from "../colors";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const ExploreCategoriesProducts = ({ data }) => {
  const scrollX = useSharedValue(0);
  const navigation = useNavigation();
  // 2. Criar estado para o texto de "Loading"
  const [loadingText, setLoadingText] = useState("Loading");

  // useEffect para buscar a tradução
  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const result = await translate("Loading", "en"); // Assumindo tradução do inglês
        setLoadingText(result);
      } catch (error) {
        console.error("Falha ao traduzir 'Loading':", error);
      }
    };

    fetchTranslation();
  }, []); // Array vazio [] garante que rode apenas uma vez

  const handlePress = async (id, catName) => {
    navigation.navigate('OffersByCategory', { cat: id, catName: catName });
  };

  const onScroll = (e) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        {/* 3. Usar o estado com o texto traduzido */}
        <Text>{loadingText}</Text>
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
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.card} onPress={() => handlePress(item.categoryData.cat.categoryId, item.categoryData.cat.categoryName)}>
            {item.uri && <Image source={{ uri: item.uri }} style={styles.image} />}
            {item.icon && <Image source={item.icon} style={styles.icon} />}
            <Text style={styles.text}>{item.categoryData.cat.categoryName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    paddingVertical: 16,
    backgroundColor: colors.backGroundLight,
    // Centraliza o texto de "Loading"
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 8,
    borderRadius: 8,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
});

export default ExploreCategoriesProducts;