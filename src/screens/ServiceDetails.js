import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Image, StatusBar, Text } from 'react-native';
import ProblemInput from '../components/ProblemInput';
import BookingInfo from '../components/BookingInfo';
import CustomBar from '../components/CustomBar';
import mockData from '../data/mockServiceDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoBackArrow from '../components/GoBackArrow';

const ConciergeDetails = ({ navigation }) => {
  const [imageUri, setImageUri] = useState();

  useEffect(() => {
    const fetchImageUri = async () => {
      const uri = await AsyncStorage.getItem('conciergeUri');
      setImageUri(uri);
    };

    fetchImageUri();
  }, []);

  const { bookingInfo } = mockData;

  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <View style={styles.imageContainer}>
        <View style={styles.arrowView}>
          <GoBackArrow colorArrow={'white'} />
        </View>
        <Image
          source={{ uri: "https://img.freepik.com/fotos-gratis/um-eletricista-trabalha-em-uma-mesa-telefonica-com-um-cabo-eletrico-de-conexao_169016-16570.jpg" }}
          style={styles.image}
        />
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
    position: 'absolute', // Adiciona a posição absoluta para sobreposição
    top: 60, // Ajuste conforme necessário para posicionar o arrow
    left: 20, // Ajuste conforme necessário para posicionar o arrow
    zIndex: 1, // Certifique-se de que o arrow fica na frente da imagem
  }
});

export default ConciergeDetails;
