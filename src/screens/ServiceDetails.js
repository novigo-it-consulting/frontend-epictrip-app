import React from 'react';
import { ScrollView, View, StyleSheet, Image, StatusBar, Text } from 'react-native';
import ProblemInput from '../components/ProblemInput';
import BookingInfo from '../components/BookingInfo';
import CustomBar from '../components/CustomBar';
import mockData from '../data/mockServiceDetails';

const ServiceDetails = () => {
  const { bookingInfo } = mockData;

  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: "https://img.freepik.com/fotos-gratis/um-eletricista-trabalha-em-uma-mesa-telefonica-com-um-cabo-eletrico-de-conexao_169016-16570.jpg" }} 
          style={styles.image}
        />
      </View>
      <ScrollView style={styles.container}>
        <ProblemInput />
        <BookingInfo bookingInfo={bookingInfo} />
      </ScrollView>
      <CustomBar/>
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
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Corrigido para o React Native
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
});

export default ServiceDetails;
