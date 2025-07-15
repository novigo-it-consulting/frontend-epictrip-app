import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import SearchBarHome from '../components/SearchViewHome';
import CardService from '../components/CardServices';
import GoBackArrow from '../components/GoBackArrow';

const ServicesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const { group } = route.params || {};

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState([]);

  const handleServicePress = (serviceId, prd) => {
    navigation.navigate('ServiceDetails', { serviceId: serviceId, productData: productData, clickedProduct: prd });
  };

  useEffect(() => {
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
        const token = await AsyncStorage.getItem('token');
        const urlProducts = `https://homol-api.fertech.dev.br/products/groups/${group}`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(urlProducts, { headers });
        const fetchedProducts = response.data;

        const prds = [];
        for (const product of fetchedProducts) {
          try {
            const urlUploads = `https://homol-api.fertech.dev.br/uploads?productId=${product.id}`;
            const responseUpload = await axios.get(urlUploads, { headers });

            if (responseUpload.status === 200) {
              prds.push({
                product: product,
                upload: responseUpload.data.data[0]
              });
            }
          } catch (e) {
            console.warn(`Could not get upload for product ${product.id}`);
            prds.push({ product: product, upload: null }); // Adiciona mesmo sem imagem
          }
        }
        setProductData(prds);
        return prds;
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return [];
      }
    };

    const fetchData = async () => {
      if (!group) return;
      try {
        setIsLoading(true);
        const [categoriesList, productsList] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        setProducts(productsList);
        setCategories(categoriesList);
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [group]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#172B4D" />
        <Text style={styles.loadingText}>{t('servicesScreen.loading')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerIcons}>
            <GoBackArrow />
            <Text style={styles.title}>{t('servicesScreen.title')}</Text>
          </View>
        </View>
        <SearchBarHome />
        <ScrollView>
          {categories
            .filter((cat) => cat.groupId === group)
            .map((cat) => (
              <View key={cat.categoryId} style={styles.section}>
                <Text style={styles.sectionTitle}>{t(cat.categoryName)}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {products
                    .filter((prd) => prd.product.category === cat.categoryId)
                    .map((prd) => (
                      <TouchableOpacity
                        key={prd.product.id}
                        onPress={() => handleServicePress(prd.product.id, prd)}
                      >
                        <CardService
                          title={t(prd.product.name)}
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
    marginLeft: -40,
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
