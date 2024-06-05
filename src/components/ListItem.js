import { View, Image, StyleSheet, Dimensions } from "react-native";
import React from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Avatar, Button, Card, Text } from "react-native-paper";

const { width } = Dimensions.get("window");

const LARGE_IMAGE_WIDTH = 36;
const MEDIUM_IMAGE_WIDTH = LARGE_IMAGE_WIDTH * 1;
const SMALL_IMAGE_WIDTH = MEDIUM_IMAGE_WIDTH * 1;

const ListItem = ({ uri, scrollX, index, dataLength }) => {
  const inputRange = [
    (index - 2) * SMALL_IMAGE_WIDTH,
    (index - 1) * SMALL_IMAGE_WIDTH,
    index * SMALL_IMAGE_WIDTH,
    (index + 1) * SMALL_IMAGE_WIDTH,
  ];

  const isLastItem = dataLength === index + 1;
  const isSecondLastItem = dataLength === index + 2;

  const outputRange = isLastItem
    ? [
        SMALL_IMAGE_WIDTH,
        LARGE_IMAGE_WIDTH,
        LARGE_IMAGE_WIDTH,
        LARGE_IMAGE_WIDTH,
      ]
    : isSecondLastItem
    ? [
        SMALL_IMAGE_WIDTH,
        LARGE_IMAGE_WIDTH,
        MEDIUM_IMAGE_WIDTH,
        MEDIUM_IMAGE_WIDTH,
      ]
    : [
        SMALL_IMAGE_WIDTH,
        MEDIUM_IMAGE_WIDTH,
        LARGE_IMAGE_WIDTH,
        SMALL_IMAGE_WIDTH,
      ];

  const animatedStyle = useAnimatedStyle(() => ({
    width: interpolate(scrollX.value, inputRange, outputRange, "clamp"),
    alignSelf: "center", // Alinhar a imagem no meio do card
  }));

  return (
    <Card style={styles.card}>
      <View style={styles.shadowContainer}>
        <Animated.Image
          source={{ uri }}
          style={[styles.image, animatedStyle]}
        />
        <Card.Title
          titleStyle={{ fontSize: 12, color: "#172B4D", fontWeight: "bold" }}
          title="Bookings"
        />
      </View>
    </Card>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  image: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 14,
    },
    height: 96,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    marginRight: 12,
    marginLeft: 5,
  },
  shadowContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "baseline",
    flexDirection: "column",
    paddingTop: 18,
  },
});
