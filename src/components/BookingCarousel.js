import { useState } from "react";
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";
import { useTranslation } from "react-i18next";
import { translate } from "../services/translations/translateServices";

const BookingCarousel = () => {
  const width = Dimensions.get("window").width;

  const handleTranslation = async (q, source) => {
    return await translate(q, source);
  }

  const data = [
    {
      title: "Minnesota Vikings vs. New...",
      description: "1525 Sugargrove, Orlando",
      image: require("../../assets/Categories/card_1.png"),
    },
    {
      title: "Disney Roller Coaster Park",
      description: "1525 Sugargrove, Orlando",
      image: require("../../assets/Categories/foto-1.png"),
    },
    // Adicione mais itens conforme necessário
  ];

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.titlePage}>{handleTranslation("Popular Events", "en")}</Text>
      <Carousel
        loop
        width={width}
        height={width / 2}
        itemWidth={width / 3}
        autoPlay={true}
        data={data}
        scrollEnabled={true}
        scrollAnimationDuration={3000}
        renderItem={({ item }) => (
          <View style={styles.carouselContent}>
            <Card style={styles.card}>
              <Card.Cover source={item.image} style={styles.image} />
              <Card.Content>
                <Title style={styles.title}>{item.title}</Title>
                <Paragraph style={styles.description}>
                  {item.description}
                </Paragraph>
              </Card.Content>
            </Card>
          </View>
        )}

      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "columm",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "85%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  titlePage: {
    color: "#172B4D",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    width: "85%",
  },
  image: {
    height: 120,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#172B4D",
    textAlign: "left",
    fontSize: 18,
  },
  description: {
    textAlign: "left",
    color: "#6C798F",
    fontSize: 14,
  },
});

export default BookingCarousel;
