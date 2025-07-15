import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Image, StatusBar, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import axios from "axios";

import ProblemInput from '../components/ProblemInput';
import BookingInfo from '../components/BookingInfo';
import CustomBar from '../components/CustomBar';
import mockData from '../data/mockServiceDetails';
import GoBackArrow from '../components/GoBackArrow';

const ConciergeDetails = () => {
  const { t } = useTranslation();
  const route = useRoute();
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
          Authorization: `Bearer ${token}`
        };
        const response = await axios.get(url, { headers });
        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.error(`Erro ao carregar dados: ${error.message}`);
        // Você pode adicionar um Toast de erro aqui se desejar
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  const { bookingInfo } = mockData;

  return (
    <>
      <StatusBar barStyle={"light-content"} />
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
      <CustomBar where={t('customBar.product')} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24
  },
  imageContainer: {
    width: "100%",
    height: 300,
    overflow: 'hidden',
    marginBottom: -50,
    position: 'relative',
    backgroundColor: '#ccc', // Cor de fundo enquanto a imagem carrega
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
  },
  arrowView: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  }
});

export default ConciergeDetails;
