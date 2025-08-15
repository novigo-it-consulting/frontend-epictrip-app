import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import ListItem from "./ListItem";
import { useNavigation } from '@react-navigation/native';
import { useSharedValue } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const ExploreCategories = () => {
  const [data, setData] = useState([]);
  // 2. Criar estado para o título traduzido
  const [translatedTitle, setTranslatedTitle] = useState("Explore Categories");
  const scrollX = useSharedValue(0);
  const navigation = useNavigation();

  // useEffect para buscar a tradução do título
  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const result = await translate("Explore Categories", "en"); // Assumindo tradução do inglês
        setTranslatedTitle(result);
      } catch (error) {
        console.error("Falha ao traduzir o título:", error);
      }
    };

    fetchTranslation();
  }, []); // Array vazio [] garante que rode apenas uma vez

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
          const iconData = responseIcon.data;
          assembled.push({
            id: group.id,
            title: await translate(group.name, "en"),
            icon: () => (
              <Image
                source={{ uri: iconData.data[0].filePath }}
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

    setData(assembled);
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

  const handlePress = async (id, data) => {
    switch (id) {
      case "d0ad9914-d969-4144-84e4-c6921974766d":
        navigation.navigate('ServiceScreen', { group: id });
        break;
      case "454de147-58b5-40c5-95cc-806523e9913d":
        console.log("caraio")
        console.log(id)
        navigation.navigate('ConciergeList', { group: id });
        break;
      case "f00977b4-354f-41d5-aaf5-fb3d935022d9":
        navigation.navigate('ChatAmico', { clickedProduct: "a531dd1d-6b90-4fd1-a2e5-0e9e795288e3" })
        break;
      case "b531f523-52a8-4607-98bc-4173224ee7a7":
        navigation.navigate('BookingScreen', { group: id });
        break;
      default:
        navigation.navigate('OffersList', { group: id, groupData: data })
    }
  };

  const onScroll = (e) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        {/* 3. Usar o estado com o texto traduzido */}
        <Text style={styles.titlePage}>{translatedTitle}</Text>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 3. Usar o estado com o texto traduzido */}
      <Text style={styles.titlePage}>{translatedTitle}</Text>
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
            onPress={() => handlePress(item.id, item)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    height: 16
  },
  titlePage: {
    color: "#172B4D",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
  },
});

export default ExploreCategories;