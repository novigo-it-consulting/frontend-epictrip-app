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

    // Normaliza e detecta se é a tela de Tickets (aceita "tickets", "ticket", "bilhetes", "bilhete")
    const normalize = (v) => (v || '').toString().toLowerCase();
    const isTickets = normalize(group).includes('ticket') || normalize(group).includes('bilhet') ||
        normalize(groupData?.title).includes('ticket') || normalize(groupData?.title).includes('bilhet');

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
        if (prd.product.group === '031e45b9-20bd-40b2-9bdc-08bdf0fa6481' || prd.product.group === 'f7f9c47e-a45a-4bda-8e1f-11085c0b13a6') {
            navigation.navigate('Coupons', { data: data, clickedImage: uri, clickedProduct: prd });

        } else {
            navigation.navigate('ProductDetailsDesignTwo', { data: data, clickedImage: uri, clickedProduct: prd });
        }
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
                        <ExploreCategoriesProducts data={categories} group={group} />
                    </View>

                    {/* Seção de Sugestões */}
                    <View style={styles.sectionContainer}>
                        <Text style={[styles.sectionTitle, { paddingHorizontal: 16 }]}>
                            {t('offersList.suggestions')}
                        </Text>

                        {isTickets ? (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 16 }}
                            >
                                {data.map((prd) => {
                                    const categoryName = categories.find(
                                        (catItem) => catItem.categoryData?.cat?.categoryId === prd.product?.category
                                    )?.categoryData?.cat?.categoryName;

                                    return (
                                        <TouchableOpacity
                                            key={prd.product.id}
                                            style={styles.imageCardTouchable}
                                            onPress={() => handlePressCard(prd.upload?.filePath, prd)}
                                            activeOpacity={0.85}
                                        >
                                            <View style={styles.imageCard}>
                                                <View style={{ position: 'relative' }}>
                                                    <Image
                                                        source={{ uri: prd.upload?.filePath }}
                                                        style={styles.image}
                                                        resizeMode="cover"
                                                    />
                                                    {categoryName && (
                                                        <Text style={styles.overlayFixedLabel}>{categoryName}</Text>
                                                    )}
                                                </View>
                                                <Text style={styles.imageTitle}>{t(prd.product.name)}</Text>
                                                <Text style={styles.imageDescription}>{t(prd.product.description)}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        ) : (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 16 }}
                            >
                                {data.map((prd) => (
                                    <TouchableOpacity
                                        key={prd.product.id}
                                        onPress={() => handlePressCard(prd.upload?.filePath, prd)}
                                    >
                                        <CardServicesCategoriesInside
                                            title={t(prd.product.name)}
                                            image={prd.upload?.filePath}
                                            description={t(prd.product.description)}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
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
    imageCardTouchable: {
        marginRight: 16,
        marginLeft: 0,
    },
    imageCard: {
        width: 170,
        alignItems: 'flex-start',
    },
    image: {
        width: 170,
        height: 200,
        borderRadius: 16,
        backgroundColor: "#eee",
    },
    imageTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#172B4D",
        marginTop: 8,
        marginLeft: 2,
        marginBottom: 0,
    },
    imageDescription: {
        fontSize: 12,
        color: "#7A869A",
        marginLeft: 2,
        marginBottom: 6,
        marginTop: 2,
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
    sectionContainer: {
        marginBottom: 24,
    },
    sectionContainerCategories: {
        paddingHorizontal: 16,
        marginBottom: 24,
        height: 164
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#172B4D',
        marginBottom: 12,
    },
    cardWrapper: {
        marginBottom: 16,
        width: '100%',
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
        marginTop: 10,
        fontSize: 16,
        color: "#172B4D",
    }
});

export default OffersList;