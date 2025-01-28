import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import ListItem from "./ListItem";
import { useNavigation } from '@react-navigation/native';
import { useSharedValue } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";

const ExploreCategories = () => {
  const [data, setData] = useState([]);
  const scrollX = useSharedValue(0);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const assembleData = async (groups) => {
    const token = await AsyncStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const assembled = [];

    for (const group of groups) {
      try {
        const iconUrl = `https://homol-api.fertech.dev.br/uploads?groupId=${group.id}`;
        const responseIcon = await axios.get(iconUrl, { headers });

        if (responseIcon.status === 200) {
          const iconData = responseIcon.data
          assembled.push({
            id: group.id,
            title: group.name,
            icon: () => (
              <Image
                source={{ uri: iconData.data[0].filePath }} // Substitua "responseIcon.data.url" pelo campo correto retornado pela API
                style={{ width: 32, height: 32 }}
                resizeMode="contain"
              />
            )
          });
        }
      } catch (error) {
        console.error(`Failed to fetch icon for group ${group.id}:`, error.message);
        continue;
      }
    }

    setData(assembled); // Atualizando o estado com os dados montados
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "https://homol-api.fertech.dev.br/productgroups";
        const token = await AsyncStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(url, { headers });
        const groupsList = response.data;

        if (groupsList && groupsList.length > 0) {
          await assembleData(groupsList);
        } else {
          console.log("No groups found");
        }
      } catch (error) {
        console.error("Failed to load data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handlePress = async (id) => {
    switch (id) {
      case 1:
        navigation.navigate('BookingScreen');
        break;
      case "9c0ca801-0fab-4f60-a1a2-37d2c4935fb7":
        navigation.navigate('ServiceScreen', { group: '9c0ca801-0fab-4f60-a1a2-37d2c4935fb7' });
        break;
      case 5:
        navigation.navigate('ExperienceScreen');
        break;
      case 3:
        navigation.navigate('ConciergeList');
        break;
      case 8:
        await AsyncStorage.setItem("preMessage", "");
        navigation.navigate('ChatAmico');
        break;
      default:
        console.log("Unhandled ID:", id);
    }
  };

  const onScroll = (e) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.titlePage}>{t("exploreCategories.categories")}</Text>
        <Text>{t("loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titlePage}>{t("exploreCategories.categories")}</Text>
      <FlatList
        data={data}
        horizontal
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <ListItem
            uri={item.uri}
            withIcon={!!item.icon}
            icon={item.icon}
            scrollX={scrollX}
            index={index}
            dataLength={data.length}
            title={item.title}
            id={item.id}
            onPress={handlePress}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#F8F8F8",
  },
  titlePage: {
    color: "#172B4D",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "left",
  }
});

export default ExploreCategories;
