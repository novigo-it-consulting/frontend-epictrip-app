import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useSharedValue } from "react-native-reanimated";
import colors from "../colors";
import { translate } from "../services/translations/translateServices";

const ExploreCategoriesProducts = ({
  data,
  renderItem,
  flatListStyle,
  flatListContentStyle
}) => {
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
      <View style={[styles.container, flatListStyle]}>
        <Text>{loadingText}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, flatListStyle]}>
      <FlatList
        data={data}
        horizontal
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.categoryData.cat.categoryId.toString()}
        contentContainerStyle={[styles.flatListContent, flatListContentStyle]}
        renderItem={
          renderItem
            ? renderItem
            : ({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handlePress(item.categoryData.cat.categoryId, item.categoryData.cat.categoryName)}
              >
                {/* View que cria o círculo azul */}
                <View style={styles.iconBackground}>
                  {item.uri && <Image source={{ uri: item.uri }} style={styles.image} resizeMode="contain" />}
                  {item.icon && <Image source={item.icon} style={styles.image} resizeMode="contain" />}
                </View>
                <Text style={styles.text} numberOfLines={2}>{item.categoryData.cat.categoryName}</Text>
              </TouchableOpacity>
            )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backGroundLight,
    justifyContent: 'center'
  },
  flatListContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 96,
    height: 112,
    marginHorizontal: 8,
    padding: 8,
    shadowColor: '#172B4D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // --- NOVO ESTILO PARA O CÍRCULO AZUL ---
  iconBackground: {
    width: 56,
    height: 56,
    borderRadius: 28, // Metade da largura/altura
    backgroundColor: '#E6F7FF', // Tom de azul claro
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, // Espaço entre o círculo e o texto
  },
  image: {
    width: 32, // Tamanho ajustado para caber bem no círculo
    height: 32, // Tamanho ajustado para caber bem no círculo
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    color: "#172B4D",
    textAlign: "center",
  },
});

export default ExploreCategoriesProducts;