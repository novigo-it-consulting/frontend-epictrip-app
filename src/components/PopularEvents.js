import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";

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
    // Adicione mais itens conforme necessário
  ];

  const [index, setIndex] = React.useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.titlePage}>Popular Events</Text>
      <Carousel
        loop
        width={width}
        height={width / 2}
        itemWidth={width / 3}
        autoPlay={false}
        data={data}
        scrollEnabled={true}
        scrollAnimationDuration={2000}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Cover source={item.image} style={styles.image} />
            <Card.Content>
              <Title style={styles.title}>{item.title}</Title>
              <Paragraph style={styles.description}>
                Minnesota Vikings vs. New...
              </Paragraph>
            </Card.Content>
          </Card>
        )}
        onSnapToItem={(index) => setIndex(index)}
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

export default PopularEvents;
