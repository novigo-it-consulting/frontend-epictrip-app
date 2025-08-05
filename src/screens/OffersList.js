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
import ContactCard from '../components/ContactCard';
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
                <View style={styles.header}>
                    <GoBackArrow />
                    <Text style={styles.titleText}>{t(groupData?.title) || t('offersList.categoryFallback')}</Text>
                    <View style={styles.searchWrapper}>
                        <SearchBarHome widthDesired={"100%"} />
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Seção de Categorias - Mantida como estava, pois funciona */}
                    <View style={styles.sectionContainerCategories}>
                        <Text style={styles.sectionTitle}>{t('offersList.categories')}</Text>
                        <ExploreCategoriesProducts data={categories} />
                    </View>

                    {/* Seção de Sugestões (COM A CORREÇÃO) */}
                    <View style={styles.sectionContainer}>
                        {/* O título agora tem seu próprio padding para se alinhar */}
                        <Text style={[styles.sectionTitle, { paddingHorizontal: 16 }]}>{t('offersList.suggestions')}</Text>

                        {/* O ScrollView usa contentContainerStyle para dar espaço interno para as sombras */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: 16
                            }}
                        >
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
        paddingHorizontal: 16, // Padding para o conteúdo do header
        backgroundColor: colors.backGroundLight,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    titleText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#172B4D',
        marginTop: 44,
    },
    searchWrapper: {
        width: '100%',
        marginTop: 24,
    },
    // Container da lista horizontal (SEM padding, para não cortar a sombra)
    sectionContainer: {
        marginBottom: 24,
        height: 272,
    },
    // Container da seção de categorias (COM padding, pois não tem lista horizontal)
    sectionContainerCategories: {
        paddingHorizontal: 16,
        marginBottom: 24,
        height: 164
    },
    // Estilo base para os títulos de seção
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#172B4D',
        marginBottom: 12,
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