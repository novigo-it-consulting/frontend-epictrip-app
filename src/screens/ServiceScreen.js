import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import CustomBar from '../components/CustomBar';
import SearchBarHome from '../components/SearchViewHome';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import CardService from '../components/CardServices';

const ServicesScreen = () => {
  const navigation = useNavigation();

  const handleServicePress = (serviceId, serviceTitle) => {
    navigation.navigate('ServiceDetails', { serviceId, serviceTitle });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <SafeAreaView />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <IconButton
              icon={"arrow-left-thin"}
              size={24}
              iconColor="#364764"
              onPress={handleGoBack}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Services</Text>
        </View>
        <View style={styles.searchContainer}>
          <SearchBarHome />
        </View>
        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Access</Text>
            <ScrollView horizontal>
              <TouchableOpacity onPress={() => handleServicePress(1, 'Condo')}>
                <CardService 
                  title="Condo" 
                  image="https://www.shutterstock.com/image-vector/example-stamp-red-rubber-on-260nw-2420575109.jpg" 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleServicePress(2, 'Home')}>
                <CardService 
                  title="Home" 
                  image="https://www.shutterstock.com/image-vector/example-stamp-red-rubber-on-260nw-2420575109.jpg" 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleServicePress(3, 'Wifi')}>
                <CardService 
                  title="Wifi" 
                  image="https://www.shutterstock.com/image-vector/example-stamp-red-rubber-on-260nw-2420575109.jpg" 
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Maintenance</Text>
            <ScrollView horizontal>
              <TouchableOpacity onPress={() => handleServicePress(4, 'Air Cond')}>
                <CardService 
                  title="Air Cond" 
                  image="https://www.shutterstock.com/image-vector/example-stamp-red-rubber-on-260nw-2420575109.jpg" 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleServicePress(5, 'Electrics')}>
                <CardService 
                  title="Electrics" 
                  image="https://www.shutterstock.com/image-vector/example-stamp-red-rubber-on-260nw-2420575109.jpg" 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleServicePress(6, 'Hydro')}>
                <CardService 
                  title="Hydro" 
                  image="https://www.shutterstock.com/image-vector/example-stamp-red-rubber-on-260nw-2420575109.jpg" 
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cleaning</Text>
            <ScrollView horizontal>
              <TouchableOpacity onPress={() => handleServicePress(4, 'Air Cond')}>
                <CardService 
                  title="Air Cond" 
                  image="https://www.shutterstock.com/image-vector/example-stamp-red-rubber-on-260nw-2420575109.jpg" 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleServicePress(5, 'Electrics')}>
                <CardService 
                  title="Electrics" 
                  image="https://www.shutterstock.com/image-vector/example-stamp-red-rubber-on-260nw-2420575109.jpg" 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleServicePress(6, 'Hydro')}>
                <CardService 
                  title="Hydro" 
                  image="https://www.shutterstock.com/image-vector/example-stamp-red-rubber-on-260nw-2420575109.jpg" 
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      <CustomBar />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: "center",
    width: "100%",
    marginLeft: -40, 
    color: "#172B4D"
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    margin: 0,
  },
  section: {
    marginBottom: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ServicesScreen;
