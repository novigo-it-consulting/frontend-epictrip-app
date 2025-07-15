import React from 'react';
import { ScrollView, View, StyleSheet, Image, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import ProblemInput from '../components/ProblemInput';
import BookingInfo from '../components/BookingInfo';
import CustomBar from '../components/CustomBar';
import mockData from '../data/mockServiceDetails';
import { useRoute } from '@react-navigation/native';

const ConciergeDetails = () => {
  const { bookingInfo } = mockData;
  const route = useRoute();
  const { t } = useTranslation();

  const { data, clickedImage, clickedProduct } = route.params || {};

  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: clickedImage }}
          style={styles.image}
        />
      </View>
      <ScrollView style={styles.container}>
        <ProblemInput productData={data} clickedProduct={clickedProduct} />
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
});

export default ConciergeDetails;