import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useSharedValue } from "react-native-reanimated";
import colors from "../colors";
import { translate } from "../services/translations/translateServices";

const ExploreCategoriesProducts = ({ data }) => {
  const scrollX = useSharedValue(0);
  const navigation = useNavigation();
  const [loadingText, setLoadingText] = useState("Loading");

  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const result = await translate("Loading", "en");
        setLoadingText(result);
      } catch (error) {
        console.error("Falha ao traduzir 'Loading':", error);
      }
    };

    fetchTranslation();
  }, []);

  const handlePress = async (id, catName) => {
    navigation.navigate('OffersByCategory', { cat: id, catName: catName });
  };

  const onScroll = (e) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
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
            <View style={styles.iconView}>
              {item.uri && <Image source={{ uri: item.uri }} style={styles.image} />}
            </View>
            <Text style={styles.text}>{item.categoryData.cat.categoryName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: 200, // LINHA REMOVIDA! O contêiner agora se ajusta ao conteúdo.
    backgroundColor: colors.backGroundLight,
    // As propriedades abaixo ainda são úteis para centralizar o texto "Loading"
    alignItems: 'center',
    justifyContent: 'center'
  },
  flatListContent: {
    // O padding foi movido do container para cá para evitar que o "Loading" fique descentralizado
    padding: 16,
  },
  iconView: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E9F3FF",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 96,
    marginHorizontal: 8,
    padding: 8,
    // --- Sombras para iOS ---
    shadowColor: '#172B4D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    // --- Sombra para Android ---
    elevation: 3,
  },
  image: {
    width: 26,
    height: 16,
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
});

export default ExploreCategoriesProducts;