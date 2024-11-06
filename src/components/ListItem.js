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
          <View style={styles.titleContainer}>
            <Animated.Text
              style={[styles.title, animatedStyle]}
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1}
            >
              {title}
            </Animated.Text>
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
    width: 96,
    marginHorizontal: 4,
    marginBottom: -70,
    justifyContent: "center",
    alignItems: "center",
  },
  shadowContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 112,
    width: 96,
  },
  iconContainer: {
    marginBottom: 4,
    alignItems: "center",
  },
  titleContainer: {
    maxWidth: 80, // largura máxima para uniformizar o tamanho
    width: "100%", // para preencher o espaço disponível
    alignItems: "center",
  },
  title: {
    fontSize: 10,
    color: "#172B4D",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ListItem;
