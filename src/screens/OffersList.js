import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Image
} from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ContactCard from '../components/ContactCard';
import colors from "../colors";
import SearchBarHome from '../components/SearchViewHome';
import GoBackArrow from '../components/GoBackArrow';
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
        navigation.navigate('ProductDetailsDesignTwo', { data: data, clickedImage: uri, clickedProduct: prd });
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
                <View style={styles.header}>
                    <GoBackArrow />
                    <Text style={styles.titleText}>{t(groupData?.title) || t('offersList.categoryFallback')}</Text>
                    <View style={styles.searchWrapper}>
                        <SearchBarHome widthDesired={"100%"} />
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Seção de Categorias */}
                    <View style={styles.sectionContainerCategories}>
                        <Text style={styles.sectionTitle}>{t('offersList.categories')}</Text>
                        <ExploreCategoriesProducts data={categories} />
                    </View>

                    {/* Seção de Sugestões */}
                    <View style={styles.sectionContainer}>
                        <Text style={[styles.sectionTitle, { paddingHorizontal: 16 }]}>{t('offersList.suggestions')}</Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: 16,
                                alignItems: "flex-start"
                            }}
                        >
                            {data.map((prd) => {
                                const categoryName = categories.find(
                                    (catItem) => catItem.categoryData?.cat?.categoryId === prd.product?.category
                                )?.categoryData?.cat?.categoryName;

                                return (
                                    <TouchableOpacity
                                        key={prd.product.id}
                                        style={styles.cardWrapper}
                                        onPress={() => handlePressCard(prd.upload?.filePath, prd)}
                                    >
                                        <View style={styles.imageContainer}>
                                            <Image
                                                source={{ uri: prd.upload?.filePath }}
                                                style={styles.cardImage}
                                                resizeMode="cover"
                                            />
                                            {categoryName && (
                                                <Text style={styles.overlayFixedLabel}>
                                                    {categoryName}
                                                </Text>
                                            )}
                                        </View>
                                        <Text style={styles.cardLabel}>
                                            {t(prd.product.name)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </ScrollView>
                <ContactCard />
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
    header: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: colors.backGroundLight,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    titleText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#172B4D',
        marginTop: 54,
    },
    searchWrapper: {
        width: '100%',
        marginTop: 24,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionContainerCategories: {
        paddingHorizontal: 16,
        marginBottom: 24,
        marginTop: 16,
        height: 164
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#172B4D',
        marginBottom: 5,
    },
    cardWrapper: {
        marginRight: 16,
        width: 160,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 207,
        borderRadius: 12,
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    overlayFixedLabel: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#0065FF',
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#172B4D",
        marginTop: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.backGroundLight,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: "#172B4D",
    }
});

export default OffersList;