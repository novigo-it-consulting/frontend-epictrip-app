import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import React from "react";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { Card } from "react-native-paper";

const ListItem = ({ scrollX, index, dataLength, title, id, onPress, withIcon, icon, uri }) => {
  const inputRange = [
    (index - 2) * 36,
    (index - 1) * 36,
    index * 36,
    (index + 1) * 36,
  ];

  const animatedStyle = useAnimatedStyle(() => ({
    width: interpolate(scrollX.value, inputRange, [36, 36, 36, 36], "clamp"),
    alignSelf: "center",
  }));

  return (
    <TouchableOpacity onPress={() => onPress(id)}>
      <Card style={withIcon ? styles.card : styles.cardWithoutIcon}>
        <View style={styles.shadowContainer}>
          {/* Renderiza o ícone com o fundo azul */}
          {withIcon && icon && (
            <View style={styles.iconBackground}>
              <View style={styles.iconContainer}>{icon()}</View>
            </View>
          )}

          {/* Renderiza a imagem da URI */}
          {uri && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          )}

          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    height: 112,
    width: 104,
    marginHorizontal: 4,
    marginBottom: -70,
    justifyContent: "center",
    alignItems: "center",
  },
  cardWithoutIcon: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    height: 112,
    width: 96,
    marginHorizontal: 4,
    marginBottom: -70,
    justifyContent: "center",
    alignItems: "center",
  },
  shadowContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // Centralizar os itens verticalmente
    height: 112,
    width: 96,
  },
  // Novo estilo para o fundo azul do ícone
  iconBackground: {
    backgroundColor: '#E6F7FF', // Cor do círculo azul
    width: 56, // Ajuste o tamanho conforme necessário
    height: 56, // Ajuste o tamanho conforme necessário
    borderRadius: 28, // Metade da largura/altura para ser um círculo
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainer: {
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    width: 96,
    height: 30, // Aumentei a altura para melhor acomodar o texto
    justifyContent: 'center', // Centralizar o texto verticalmente
  },
  title: {
    fontSize: 12,
    color: "#172B4D",
    fontWeight: "bold",
    textAlign: 'center', // Centralizar o texto
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  image: {
    width: 64,
    height: 64,
  },
});

export default ListItem;