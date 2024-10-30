import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { Card } from "react-native-paper";

const ListItem = ({ scrollX, index, dataLength, title, id, onPress, withIcon, icon }) => {

  const inputRange = [
    (index - 2) * 36,
    (index - 1) * 36,
    index * 36,
    (index + 1) * 36,
  ];

  const isLastItem = dataLength === index + 1;
  const isSecondLastItem = dataLength === index + 2;

  const outputRange = isLastItem
    ? [36, 36, 36, 36]
    : isSecondLastItem
      ? [36, 36, 36, 36]
      : [36, 36, 36, 36];

  const animatedStyle = useAnimatedStyle(() => ({
    width: interpolate(scrollX.value, inputRange, outputRange, "clamp"),
    alignSelf: "center",
  }));

  return (
    <TouchableOpacity onPress={() => onPress(id)}>
      <Card style={withIcon ? styles.card : stylesWithOutIcon.card}>
        <View style={styles.shadowContainer}>
          {withIcon && icon && (
            <View style={styles.iconContainer}>{icon()}</View>
          )}
          <Animated.Text style={[styles.title, animatedStyle]}>
            {title}
          </Animated.Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 8,
    height: 110,
    width: 110, // Aumente a largura para dar mais espaço para o texto
    marginHorizontal: 4,
    marginBottom: -70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  shadowContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 4,
    alignItems: "center",
  },
  title: {
    fontSize: 10,
    color: "#172B4D",
    textAlign: "center",
    fontWeight: "bold",
    maxWidth: "100%",
    whiteSpace: "nowrap", // evita quebra de linha
    overflow: "hidden",
  },
});

const stylesWithOutIcon = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    height: 110,
    width: 95,
    marginHorizontal: 4,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default ListItem;
