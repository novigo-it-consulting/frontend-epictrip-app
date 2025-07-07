import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  AlertNotificationRoot,
  Toast,
  ALERT_TYPE,
} from "react-native-alert-notification";
import ListItem from "../components/ListItem";
import colors from "../colors";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import CustomTabBar from "../components/CustomBar";
import { getAllPlaces } from "../services/api";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const ExperienceScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollX = useSharedValue(0);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = useNavigation();

  // 2. Criar um estado para armazenar os textos traduzidos
  const [t, setT] = useState({
    noExperience: "No Experience",
    back: "Back",
    experience: "Experience",
    searchPlaceholder: "Try Disney, Food or Tickets",
    errorFetching: "Error fetching places",
    categories: "Categories",
  });

  // 3. useEffect para buscar as traduções
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [
          noExperience, back, experience, searchPlaceholder,
          errorFetching, categories
        ] = await Promise.all([
          translate("No Experience", "en"),
          translate("Back", "en"),
          translate("Experience", "en"),
          translate("Try Disney, Food or Tickets", "en"),
          translate("Error fetching places", "en"),
          translate("Categories", "en"),
        ]);
        setT({ noExperience, back, experience, searchPlaceholder, errorFetching, categories });
      } catch (error) {
        console.error("Falha ao buscar traduções:", error);
      }
    };
    fetchTranslations();
  }, []);

  const fetchPlacesData = async () => {
    try {
      setLoading(true);
      const response = await getAllPlaces();
      if (response.status === 200) {
        setData(response.data.data); // Ajustado para response.data.data
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: t.errorFetching, // Usando a tradução
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: t.errorFetching, // Usando a tradução
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacesData();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const onScroll = (e) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  return (
    <AlertNotificationRoot toastConfig={{ autoClose: 3000 }} theme={"light"}>
      <View style={styles.containerAlpha}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : data.length === 0 ? (
          <View style={styles.noDataView}>
            {/* 4. Usar os textos traduzidos */}
            <Text style={styles.noDataText}>{t.noExperience}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleGoBack}
            >
              <Text style={styles.addButtonText}>{t.back}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleGoBack}>
                <IconButton
                  style={{ marginLeft: -15 }}
                  icon={"arrow-left-thin"}
                  size={30}
                />
              </TouchableOpacity>
              <Text style={styles.title}>{t.experience}</Text>
            </View>
            <Searchbar
              style={styles.searchbar}
              placeholder={t.searchPlaceholder}
              onChangeText={setSearchQuery}
              value={searchQuery}
            />
            <View style={styles.container}>
              <Text style={styles.titlePage}>{t.categories}</Text>
              <FlatList
                data={data}
                horizontal
                bounces={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => ( // Adicionado index
                  <ListItem
                    style={styles.listItem}
                    scrollX={scrollX}
                    index={index} // Passando o index correto
                    dataLength={data.length}
                    title={item.title} // Supondo que o item tenha uma propriedade 'title'
                    id={item.id}
                    onPress={() => { }}
                  />
                )}
              />
            </View>
          </>
        )}
      </View>
      <CustomTabBar />
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  containerAlpha: {
    flex: 0.9,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginRight: "auto",
    marginLeft: "auto",
    backgroundColor: colors.backGroundLight,
  },
  header: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 33,
    fontWeight: "bold",
  },
  container: {
    flex: 0.3,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "95%",
    height: "20%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  titlePage: {
    color: "#172B4D",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchbar: {
    width: "100%",
    backgroundColor: "#F1F5F6",
    borderRadius: 12,
    marginBottom: 30,
  },
  noDataView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.3,
    width: "100%",
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "400",
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
    marginTop: 50,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ExperienceScreen;