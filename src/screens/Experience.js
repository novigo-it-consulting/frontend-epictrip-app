import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, Title, Paragraph } from 'react-native-paper';
import { getAllPlaces } from '../services/api';
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const { width } = Dimensions.get('window');

const ExperienceScreen = ({ navigation }) => {
  const [activeItem, setActiveItem] = useState(0); // Inicia com o primeiro item ativo
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);

  // 2. Criar um estado para armazenar os textos traduzidos
  const [t, setT] = useState({
    experiences: "Experiences",
    searchPlaceholder: "Try Disney, Food or Tickets",
    categories: "Categories",
    noPlacesFound: "No places found.",
    categoryItems: ["Parks", "Shows", "Sports", "Tours", "Events"],
  });

  // 3. useEffect para buscar as traduções
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [
          experiences, searchPlaceholder, categories, noPlacesFound,
          parks, shows, sports, tours, events
        ] = await Promise.all([
          translate("Experiences", "en"),
          translate("Try Disney, Food or Tickets", "en"),
          translate("Categories", "en"),
          translate("No places found.", "en"),
          translate("Parks", "en"),
          translate("Shows", "en"),
          translate("Sports", "en"),
          translate("Tours", "en"),
          translate("Events", "en"),
        ]);
        setT({
          experiences,
          searchPlaceholder,
          categories,
          noPlacesFound,
          categoryItems: [parks, shows, sports, tours, events]
        });
      } catch (error) {
        console.error("Falha ao buscar traduções:", error);
      }
    };
    fetchTranslations();
  }, []);

  const fetchPlacesData = async () => {
    try {
      const response = await getAllPlaces();
      if (response.status === 200) {
        setPlaces(response.data.data);
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
    fetchPlacesData();
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
          {/* 4. Usar os textos traduzidos */}
          <Text style={styles.title}>{t.experiences}</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder={t.searchPlaceholder}
          />
          <Icon name="search" size={20} color="#333" style={styles.searchIcon} />
        </View>
      </View>

      <Text style={styles.categoriesText}>{t.categories}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.itemsContainer}
      >
        {t.categoryItems.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.item,
              activeItem === index && styles.itemActive
            ]}
            onPress={() => setActiveItem(index)}
          >
            <Text style={[styles.itemText, activeItem === index && styles.itemTextActive]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <ScrollView contentContainerStyle={styles.carouselContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.verticalContainer}>
            {places.length > 0 ? (
              places.map((place) => (
                <View key={place.id} style={styles.cardWrapper}>
                  {renderCardItem(place)}
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>{t.noPlacesFound}</Text>
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
    marginBottom: 15,
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
  itemTextActive: {
    color: '#fff',
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
    height: 250,
    paddingBottom: 10
  },
  cardImage: {
    height: '60%',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 10,
    lineHeight: 22,
  },
  cardParagraph: {
    fontSize: 14,
    lineHeight: 20,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
});

export default ExperienceScreen;