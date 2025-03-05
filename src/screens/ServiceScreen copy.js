import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import SearchBarHome from '../components/SearchViewHome';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import CardService from '../components/CardServices';
import GoBackArrow from '../components/GoBackArrow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ServicesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params || {};

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
  const [productData, setProductData] = useState()

  const { t } = useTranslation();

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
        const urlUploads = `https://homol-api.fertech.dev.br/uploads?productId=${product.id}`;
        const responseUpload = await axios.get(urlUploads, { headers });

        if (responseUpload.status === 200) {
          const upload = responseUpload.data;
          const obj = {
            product: product,
            upload: upload.data[0] // Evita erro caso `filePath` não exista
          };
          objsToSendAmiko.push(obj)
          prds.push({
            product: product,
            upload: upload.data[0]
          });
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
        setIsLoading(true); // Começa o carregamento
        const categoriesList = await fetchCategories();
        const productsList = await fetchProducts();
        setProducts(productsList);
        setCategories(categoriesList);
        console.log(products)
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      } finally {
        console.log(products)
        setIsLoading(false); // Finaliza o carregamento
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#172B4D" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <>
      <SafeAreaView />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerIcons}>
            <GoBackArrow />
            <Text style={styles.title}>Services</Text>
          </View>
        </View>
        <SearchBarHome />
        <ScrollView>
          {categories
            .filter((cat) => cat.groupId == '9c0ca801-0fab-4f60-a1a2-37d2c4935fb7')
            .map((cat) => (
              <View key={cat.categoryId} style={styles.section}>
                <Text style={styles.sectionTitle}>{cat.categoryName}</Text>
                <ScrollView horizontal>
                  {products
                    .filter((prd) => prd.product.category === cat.categoryId) // Certifique-se que os campos são correspondentes
                    .map((prd) => (
                      <TouchableOpacity
                        key={prd.product.id}
                        onPress={() => handleServicePress(prd.product.id, prd)}
                      >
                        <CardService
                          title={prd.product.name}
                          image={
                            prd.upload?.filePath || // Use optional chaining para evitar erros
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#172B4D',
    textAlign: 'center',
    width: '100%',
    marginLeft: -80,
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
