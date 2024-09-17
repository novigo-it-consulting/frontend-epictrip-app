import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, Title, Paragraph } from 'react-native-paper';

const { width } = Dimensions.get('window');

const ExperienceScreen = ({ navigation }) => {
  const [activeItem, setActiveItem] = useState(null);

  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const latestHouse = [
    { housePhoto: 'https://example.com/house1.jpg', houseName: 'House 1', address: '123 Main St', number: '1', neighbourhood: 'Downtown', city: 'City', country: 'Country' },
    { housePhoto: 'https://example.com/house2.jpg', houseName: 'House 2', address: '456 Elm St', number: '2', neighbourhood: 'Uptown', city: 'City', country: 'Country' },
  ];

  const renderCardItem = (item) => (
    <View style={styles.cardContainer}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item.housePhoto }} style={styles.cardImage} />
        <Card.Content>
          <Title style={styles.cardTitle}>{item.houseName}</Title>
          <Paragraph style={styles.cardParagraph}>
            <Icon name="location-outline" size={15} color="#000" />{' '}
            {`${item.address}, ${item.number}, ${item.neighbourhood}, ${item.city}, ${item.country}`}
          </Paragraph>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <SafeAreaView style={styles.experience}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Experiences</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Try Disney, Food or Tickets"
          />
          <Icon name="search" size={20} color="#333" style={styles.searchIcon} />
        </View>
      </View>
      <Text style={styles.categoriesText}>Categories</Text>
      <View style={styles.itemsWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.itemsContainer}
        >
          {Array.from({ length: 7 }, (_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.item,
                activeItem === index && styles.itemActive
              ]}
              onPressIn={() => setActiveItem(index)}
              onPressOut={() => setActiveItem(null)}
            >
              <Text style={styles.itemText}>Item {index + 1}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView
        contentContainerStyle={styles.carouselContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.verticalContainer}>
          {latestHouse.map((house, index) => (
            <View key={index} style={styles.cardWrapper}>
              {renderCardItem(house)}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  experience: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centraliza o conteúdo horizontalmente
    marginBottom: 15,
  },
  backButton: {
    position: 'absolute', // Faz o botão ficar na esquerda
    left: 0,
    padding: 10,
  },
  title: {
    fontSize: 20, // Diminuído o tamanho da fonte de 24 para 20
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 40, // Adiciona margem para centralizar o texto
  },
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 10,
  },
  categoriesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 10,
  },
  itemsWrapper: {
    marginBottom: 20,
    alignItems: 'center',
  },
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  item: {
    width: 70,
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  itemActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  itemText: {
    fontSize: 12,
    color: '#333',
  },
  carouselContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  verticalContainer: {
    alignItems: 'center',
  },
  cardWrapper: {
    width: width * 0.9,
    marginVertical: 10,
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    height: 200,
  },
  cardImage: {
    height: '60%',
  },
  cardTitle: {
    fontSize: 16,
  },
  cardParagraph: {
    fontSize: 14,
  },
});

export default ExperienceScreen;