import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Card, Title, Paragraph, IconButton } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";

const PopularEvents = () => {
  const width = Dimensions.get("window").width;
  const [index, setIndex] = useState(0);

  const data = [
    {
      title: "Disney Roller Coaster Park",
      description: "1525 Sugargrove, Orlando",
      image: require("../../assets/Categories/card_1.png"),
      badge: "200",
    },
    {
      title: "Universal Studios Parade",
      description: "Hollywood Boulevard, Orlando",
      image: require("../../assets/Categories/foto-1.png"),
      badge: "150",
    },
  ];

  const ITEM_WIDTH = width * 0.85;

  return (
    <View style={styles.container}>
      <Text style={styles.titlePage}>Popular Events</Text>

      <Carousel
        loop
        width={width}
        height={260}
        data={data}
        scrollAnimationDuration={800}
        onSnapToItem={(i) => setIndex(i)}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <Card style={[styles.card, { width: ITEM_WIDTH }]}>
              <View>
                <Card.Cover source={item.image} style={styles.image} />
                {/* Badge */}
                {/* <View style={styles.badge}>
                  <Text style={styles.badgeText}>⚡ {item.badge}</Text>
                </View> */}
              </View>

              <Card.Content style={styles.cardContent}>
                <View style={styles.row}>
                  <View>
                    <Title style={styles.title}>{item.title}</Title>
                    <Paragraph style={styles.description}>
                      {item.description}
                    </Paragraph>
                  </View>
                  {/* Ícone coração */}
                  <IconButton icon="heart-outline" size={20} onPress={() => { }} />
                </View>
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
    width: "100%",
    marginBottom: 120,
  },
  titlePage: {
    color: "#172B4D",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginLeft: 20,
  },
  cardWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
  },
  image: {
    height: 160,
    resizeMode: "cover",
    marginTop: 10
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#1E88E5",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardContent: {
    padding: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#172B4D",
  },
  description: {
    fontSize: 13,
    color: "#6C798F",
    marginTop: 4,
  },
});

export default PopularEvents;
