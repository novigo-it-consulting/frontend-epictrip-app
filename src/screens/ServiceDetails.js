import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Image, StatusBar, Text } from 'react-native';
import ProblemInput from '../components/ProblemInput';
import BookingInfo from '../components/BookingInfo';
import CustomBar from '../components/CustomBar';
import mockData from '../data/mockServiceDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoBackArrow from '../components/GoBackArrow';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from "axios";

const ConciergeDetails = () => {
  const route = useRoute();
  const { serviceId } = route.params || {};

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // Gerencie o estado de carregamento

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const url = `https://homol-api.fertech.dev.br/uploads?productId=${serviceId}`;
      const headers = {
        Authorization: `Bearer ${token}`
      };
      const response = await axios.get(url, { headers });
      if (response.status === 200) {
        setData(response.data);
        setLoading(false); // Atualize o estado de carregamento
      }
    } catch (error) {
      alert(`Erro ao carregar dados: ${error.message}`);
      setLoading(false); // Mesmo no erro, o carregamento termina
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { bookingInfo } = mockData;

  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <View style={styles.imageContainer}>
        <View style={styles.arrowView}>
          <GoBackArrow colorArrow={'white'} />
        </View>
        {!loading && data ? ( // Verifique se os dados estão disponíveis e o carregamento terminou
          <Image
            source={{ uri: data.data[0].filePath }}
            style={styles.image}
          />
        ) : null}
      </View>
      <ScrollView style={styles.container}>
        <ProblemInput />
        <BookingInfo bookingInfo={bookingInfo} />
      </ScrollView>
      <CustomBar />
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
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
  },
  arrowView: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  }
});

export default ConciergeDetails;
