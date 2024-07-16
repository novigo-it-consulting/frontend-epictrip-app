import { useState } from "react";
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel"; // Importe o componente de dots
import colors from "../colors";
import { useTranslation } from "react-i18next";


const PopularEvents = () => {
  const width = Dimensions.get("window").width;
  
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
    {
      title: "Orlando city vs New York City",
      description: "W Church St, Orlando",
      image: require("../../assets/Categories/8.png"),
    },
    {
      title: "Copa America 2024",
      description: "Mercedes-Benz Stadium, Atlanta",
      image: require("../../assets/Categories/7.png"),
    }
    
    // Adicione mais itens conforme necessário
  ];
  
  const [index, setIndex] = useState(0);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.titlePage}>{t("popularEvents.events")}</Text>
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
          <Card style={styles.card}>
            <Card.Cover source={item.image} style={styles.image} />
            <Card.Content>
              <Title style={styles.title}>{item.title}</Title>
              <Paragraph style={styles.description}>
                {item.description}
              </Paragraph>
            </Card.Content>
          </Card>
        )}
        onSnapToItem={(index) => setIndex(index)}
      />
      <View
        style={{
          marginTop: -30,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <AnimatedDotsCarousel
          length={data.length}
          currentIndex={index}
          maxIndicators={4}
          interpolateOpacityAndColor={true}
          activeIndicatorConfig={{
            color: colors.primary,
            margin: 3,
            opacity: 1,
            size: 6,
          }}
          inactiveIndicatorConfig={{
            color: "grey",
            margin: 3,
            opacity: 0.2,
            size: 6,
          }}
          decreasingDots={[
            {
              config: { color: "white", margin: 3, opacity: 0.5, size: 6 },
              quantity: 1,
            },
            {
              config: { color: "white", margin: 3, opacity: 0.5, size: 4 },
              quantity: 1,
            },
          ]}
        />
      </View>
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

export default PopularEvents;
