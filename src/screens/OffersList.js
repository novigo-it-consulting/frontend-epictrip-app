import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView
} from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import colors from "../colors";
import SearchBarHome from '../components/SearchViewHome';
import GoBackArrow from '../components/GoBackArrow';
import CardServicesCategoriesInside from '../components/CardServicesCategoriesInside';
import ExploreCategoriesProducts from '../components/ExploreCategoriesProducts';
import { getProductsByGroup, getUploadByProduct, getCategoryByGroup, getUploadByCategory } from '../services/api';

const OffersList = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useTranslation();
    const { group, groupData } = route.params || {};

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                let prds = [];
                const products = await getProductsByGroup(group);

                for (const product of products) {
                    try {
                        const upload = await getUploadByProduct(product.id);
                        const obj = {
                            product: product,
                            upload: upload[0]
                        };
                        prds.push(obj);
                    } catch (error) {
                        console.warn(`Erro ao obter imagem para o produto ${product.id}:`, error);
                        prds.push({ product: product, upload: null });
                    }
                }
                return prds;
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
                return [];
            }
        };

        const getCategoriesData = async () => {
            try {
                let cats = [];
                const categoriesData = await getCategoryByGroup(group);
                for (const cat of categoriesData) {
                    try {
                        const upload = await getUploadByCategory(cat.categoryId);
                        const obj = {
                            categoryData: { cat },
                            uri: upload[0]?.filePath
                        };
                        cats.push(obj);
                    } catch (error) {
                        console.warn("Erro ao obter conteúdo:", error);
                        cats.push({ categoryData: { cat }, uri: null });
                    }
                }
                return cats;
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
                return [];
            }
        };

        const fetchData = async () => {
            if (!group) return;
            try {
                setIsLoading(true);
                const [categoriesData, productsData] = await Promise.all([
                    getCategoriesData(),
                    getProducts()
                ]);
                setCategories(categoriesData);
                setData(productsData);
            } catch (error) {
                console.error('Erro ao buscar dados iniciais:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [group]);

    const handlePressCard = (uri, prd) => {
        navigation.navigate('ConciergeDetails', { data: data, clickedImage: uri, clickedProduct: prd });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#172B4D" />
                <Text style={styles.loadingText}>{t('offersList.loading')}</Text>
            </View>
        );
    }

    return (
        <PaperProvider theme={theme}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    <GoBackArrow />
                    <Text style={styles.titleText}>{t(groupData?.title) || t('offersList.categoryFallback')}</Text>
                </View>
                <View style={styles.searchContainer}>
                    <SearchBarHome widthDesired={"90%"} />
                </View>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>{t('offersList.categories')}</Text>
                        <ExploreCategoriesProducts data={categories} />
                    </View>
                    <View style={[styles.sectionContainer, { paddingTop: 8 }]}>
                        <Text style={styles.sectionTitle}>{t('offersList.suggestions')}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {data.map((prd) => (
                                <TouchableOpacity key={prd.product.id} onPress={() => handlePressCard(prd.upload?.filePath, prd)}>
                                    <CardServicesCategoriesInside
                                        title={t(prd.product.name)}
                                        image={prd.upload?.filePath}
                                        description={t(prd.product.description)}
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </PaperProvider>
    );
};

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
    },
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.backGroundLight,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.backGroundLight,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#172B4D',
        marginLeft: 40
    },
    searchContainer: {
        alignItems: 'center',
        padding: 16,
    },
    scrollView: {
        flex: 1,
    },
    sectionContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#172B4D',
        marginBottom: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.backGroundLight,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#172B4D",
    }
});

export default OffersList;
