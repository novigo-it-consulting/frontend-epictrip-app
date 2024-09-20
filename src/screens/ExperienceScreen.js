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
import { useTranslation } from "react-i18next";
import { Searchbar } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSharedValue } from "react-native-reanimated";
import CustomTabBar from "../components/CustomBar";
import { getAllPlaces } from "../services/api";  // Import the API function

const ExperienceScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollX = useSharedValue(0);
  const [house, setHouse] = useState([]);

  const { t } = useTranslation();
  const navigation = useNavigation();

  const fetchPlacesData = async () => {
    try {
      setLoading(true);
      const response = await getAllPlaces();  // Call the API to get places
      if (response.status === 200) {
        setData(response.data);  // Assuming the API returns an array of places
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Ops",
          textBody: t("experienceScreen.errorFetchingPlaces"),
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Ops",
        textBody: t("experienceScreen.errorFetchingPlaces"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacesData();  // Fetch places when the component loads
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const onScroll = (e) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AlertNotificationRoot toastConfig={{ autoClose: 3000 }} theme={"light"}>
      <View style={styles.containerAlpha}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : data.length === 0 ? (
          <View style={styles.noDataView}>
            <Text style={styles.noDataText}>{t("experienceScreen.noExperience")}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleGoBack}
            >
              <Text style={styles.addButtonText}>{t("profileHandleBack.titleHandleBack")}</Text>
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
              <Text style={styles.title}>{t("experienceScreen.titleScreen")}</Text>
            </View>
            <Searchbar
              style={styles.searchbar}
              placeholder={t("searchViewHome.searchEvents")}
              onChangeText={setSearchQuery}
              value={searchQuery}
              clearIcon
            />
            <View style={styles.container}>
              <Text style={styles.titlePage}>{t("exploreCategories.categoriesWithOutExplor")}</Text>
              <FlatList
                data={data}  // Use fetched data
                horizontal
                bounces={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <ListItem
                    style={styles.listItem}
                    scrollX={scrollX}
                    index={0}
                    dataLength={data.length}
                    title={item.title}
                    id={item.id}
                    onPress={() => {}}
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
