import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import SearchBarHome from '../components/SearchViewHome';
import { useNavigation, useRoute } from '@react-navigation/native';
import CardService from '../components/CardServices';
import GoBackArrow from '../components/GoBackArrow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const ServicesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params || {};

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState();

  // 2. Criar um estado para armazenar os textos traduzidos
  const [t, setT] = useState({
    loading: "Loading...",
    services: "Services",
  });

  // 3. useEffect para buscar as traduções
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [loading, services] = await Promise.all([
          translate("Loading...", "en"),
          translate("Services", "en"),
        ]);
        setT({ loading, services });
      } catch (error) {
        console.error("Falha ao buscar traduções:", error);
      }
    };
    fetchTranslations();
  }, []);

  const handleServicePress = (serviceId, prd) => {
    navigation.navigate('ServiceDetails', { serviceId: serviceId, productData: productData, clickedProduct: prd });
  };

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const urlCategories = 'https://homol-api.fertech.dev.br/categories/';
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(urlCategories, { headers });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  };

  const fetchProducts = async () => {
    try {
      const objsToSendAmiko = [];
      const token = await AsyncStorage.getItem('token');
      const urlProducts = `https://homol-api.fertech.dev.br/products/groups/${group}`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(urlProducts, { headers });
      const products = response.data;

      const prds = [];
      for (const product of products) {
        try {
          const urlUploads = `https://homol-api.fertech.dev.br/uploads?productId=${product.id}`;
          const responseUpload = await axios.get(urlUploads, { headers });

          if (responseUpload.status === 200) {
            const upload = responseUpload.data;
            const obj = {
              product: product,
              upload: upload.data[0]
            };
            objsToSendAmiko.push(obj)
            product.name = await translate(product.name, "en");
            prds.push({
              product: product,
              upload: upload.data[0]
            });
          }
        } catch (e) {
          console.warn(`Could not get upload for product ${product.id}`);
        }
      }
      setProductData(objsToSendAmiko)
      return prds;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const categoriesList = await fetchCategories();
        const productsList = await fetchProducts();
        setProducts(productsList);
        setCategories(categoriesList);
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [group]); // Adicionado `group` como dependência para re-buscar se ele mudar

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#172B4D" />
        {/* 4. Usar o texto traduzido */}
        <Text style={styles.loadingText}>{t.loading}</Text>
      </View>
    );
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerIcons}>
              <GoBackArrow />
              <Text style={styles.title}>{t.services}</Text>
            </View>
          </View>
          <SearchBarHome />
          <ScrollView>
            {categories
              .filter((cat) => cat.groupId === 'bbfaecfc-013e-4ce3-9ac1-80d7b4c0010b')
              .map((cat) => (
                <View key={cat.categoryId} style={styles.section}>
                  <Text style={styles.sectionTitle}>{cat.categoryName}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {products
                      .filter((prd) => prd.product.category === cat.categoryId)
                      .map((prd) => (
                        <TouchableOpacity
                          key={prd.product.id}
                          onPress={() => handleServicePress(prd.product.id, prd)}
                        >
                          <CardService
                            title={prd.product.name}
                            image={
                              prd.upload?.filePath ||
                              'https://img.freepik.com/fotos-premium/praia-da-ilha-de-cantor-em-palm-beach-florida-us_79295-5856.jpg?w=996'
                            }
                          />
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              ))}
          </ScrollView>
        </View>
      </SafeAreaView>
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
    marginBottom: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#172B4D',
    textAlign: 'center',
    flex: 1,
    marginLeft: -40, // Compensa o espaço do botão de voltar
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#172B4D',
  },
});

export default ServicesScreen;