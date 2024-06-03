import React from "react";
import { StyleSheet, View, Text } from "react-native";
import PagerView from "react-native-pager-view";

const PopularEvents = () => {
  return (
    <View style={styles.container}>
      <PagerView style={styles.pagerView} initialPage={1}>
        <View style={styles.page} key="1">
          <Text>Popular Events</Text>
          <Text>Swipe ➡️</Text>
        </View>
        {/* Adicione mais páginas de eventos populares conforme necessário */}
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PopularEvents;
