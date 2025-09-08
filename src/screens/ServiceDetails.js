import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import ContactCard from "../components/ContactCard";
import ProblemInput from "../components/ProblemInput";
import BookingInfo from "../components/BookingInfo";
import mockData from "../data/mockServiceDetails";
import GoBackArrow from "../components/GoBackArrow";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ConciergeDetails = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { serviceId, productData, clickedProduct } = route.params || {};

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!serviceId) {
        setLoading(false);
        return;
      }
      try {
        const token = await AsyncStorage.getItem("token");
        const url = `https://homol-api.fertech.dev.br/uploads?productId=${serviceId}`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(url, { headers });
        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.error(`Erro ao carregar dados: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  const { bookingInfo } = mockData;

  return (
    <>
      {/* Faz a barra de status ficar transparente e permite que a imagem vá até o topo */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View style={styles.imageContainer}>
        <View style={styles.arrowView}>
          <GoBackArrow colorArrow={'white'} />
        </View>
        {loading ? (
          <ActivityIndicator style={styles.loader} size="large" color="#fff" />
        ) : data && data.data && data.data[0] ? (
          <Image
            source={{ uri: data.data[0].filePath }}
            style={styles.image}
          />
        ) : null}
      </View>

      <ScrollView style={styles.container}>
        <ProblemInput productData={productData} clickedProduct={clickedProduct} />
        <BookingInfo bookingInfo={bookingInfo} />
      </ScrollView>

      <ContactCard />
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -40, // sobrepõe suavemente a imagem
  },
  imageContainer: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.35, // altura proporcional
    backgroundColor: "#ccc",
    justifyContent: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  loader: {
    position: "absolute",
    alignSelf: "center",
  },
  arrowView: {
    position: "absolute",
    top: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 50,
    left: 20,
    zIndex: 1,
  },
});

export default ConciergeDetails;