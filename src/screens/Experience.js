import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, Title, Paragraph } from 'react-native-paper';
import { getAllPlaces } from '../services/api'; // Supondo que você tenha essa função de API implementada

const { width } = Dimensions.get('window');

const ExperienceScreen = ({ navigation }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState(["Parks", "Shows", "Sports", "Tours", "Events"]); // Exemplo de categorias

  // Função para buscar os dados da API
  const fetchPlacesData = async () => {
    try {
      const response = await getAllPlaces();
      if (response.status === 200) {
        setPlaces(response.data.data);
        console.log(response.data.data); // Supondo que `response.data` seja a lista de lugares
      } else {
        console.error('Erro ao buscar dados: ', response.status);
      }
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacesData(); // Buscar os dados quando o componente for montado
  }, []);

  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const renderCardItem = (item) => (
    <View style={styles.cardContainer}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item.pics[0] }} style={styles.cardImage} />
        <Card.Content>
          <Title style={styles.cardTitle}>{item.overview}</Title>
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

      {/* Renderizando as Categorias como um menu horizontal */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.itemsContainer}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.item,
              activeItem === index && styles.itemActive
            ]}
            onPress={() => setActiveItem(index)}
          >
            <Text style={styles.itemText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <ScrollView contentContainerStyle={styles.carouselContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.verticalContainer}>
            {places.length > 0 ? (
              places.map((place, index) => (
                <View key={index} style={styles.cardWrapper}>
                  {renderCardItem(place)}
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No places found.</Text>
            )}
          </View>
        </ScrollView>
      )}
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
    justifyContent: 'center',
    marginBottom: 15,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 40,
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
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15, // Espaçamento abaixo das categorias
  },
  item: {
    width: 100,
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
    fontSize: 14,
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
    paddingBottom: 10
  },
  cardImage: {
    height: '60%',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 10
  },
  cardParagraph: {
    fontSize: 14,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
});

export default ExperienceScreen;
