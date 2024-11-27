import React from 'react';
import { ScrollView, View, StyleSheet, Image, StatusBar, Text } from 'react-native';
import ProblemInput from '../components/ProblemInput';
import BookingInfo from '../components/BookingInfo';
import CustomBar from '../components/CustomBar';
import mockData from '../data/mockServiceDetails';

const ConciergeDetails = ({ navigation }) => {
  const { bookingInfo } = mockData;

  const goToChat = (screen) => {
    console.log("CHAMAAA")
    navigation.navigate(screen);
  }

  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: "https://img.freepik.com/free-photo/concierge-assists-with-checkin-hotel_482257-90464.jpg?t=st=1730936507~exp=1730940107~hmac=ce7beabe60ff090357534141f33e0c83537b0020832680ccc86df3aef4e9124c&w=1380" }}
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
