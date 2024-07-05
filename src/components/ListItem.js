import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { sampleData } from "../data/sampleData";

const LARGE_IMAGE_WIDTH = 36;
const MEDIUM_IMAGE_WIDTH = LARGE_IMAGE_WIDTH * 1;
const SMALL_IMAGE_WIDTH = MEDIUM_IMAGE_WIDTH * 1;

const ListItem = ({ uri, scrollX, index, dataLength, title, id, onPress }) => {
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

  // console.log(sampleData.title)

  return (
    <TouchableOpacity onPress={() => onPress(id)}>
    <Card style={styles.card}>
      <View style={styles.shadowContainer}>
        <Animated.Image
          source={{ uri }}
          style={[styles.image, animatedStyle]}
        />
        <Card.Title
          titleStyle={{ fontSize: 12, color: "#172B4D", textAlign: "center", fontWeight: "bold" }}
          title={title}
        />
      </View>
    </Card>
    </TouchableOpacity>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  image: {
    width: 48,
    height: 48,
    borderRadius: 13,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    shadowColor: "#000",
    paddingTop: 16,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    height: 110, 
    width: 95,  
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    marginRight: 12,
    marginLeft: 5,
    alignItems: 'center',  
    justifyContent: 'center',  
  },
  shadowContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
  },
});
