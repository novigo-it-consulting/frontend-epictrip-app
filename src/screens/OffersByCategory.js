import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView
} from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ContactCard from '../components/ContactCard';
import colors from "../colors";
import SearchBarHome from '../components/SearchViewHome';
import GoBackArrow from '../components/GoBackArrow';
import ExploreCategoriesProducts from '../components/ExploreCategoriesProducts';
import { getProductByCategory, getUploadByProduct } from '../services/api';
import CardServicesCategoriesInsideDetailed from '../components/CardServicesCategoriesInsideDetailed';

const categories = [
    { categoryData: { cat: { categoryId: 'parks', categoryName: 'Parks' } } },
    { categoryData: { cat: { categoryId: 'shows', categoryName: 'Shows' } } },
    { categoryData: { cat: { categoryId: 'sports', categoryName: 'Sports' } } },
    { categoryData: { cat: { categoryId: 'car', categoryName: 'Car' } } },
    { categoryData: { cat: { categoryId: 'tours', categoryName: 'Tours' } } },
];

const OffersByCategory = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useTranslation();

    const { cat, catName } = route.params || {};

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(cat || categories[0].categoryData.cat.categoryId);

    useEffect(() => {
        const getProducts = async (id) => {
            const productData = [];
            try {
                const products = await getProductByCategory(id);
                for (const prd of products) {
                    try {
                        const uploadResponse = await getUploadByProduct(prd.id);
                        const obj = {
                            upload: uploadResponse[0],
                            product: prd
                        };
                        productData.push(obj);
                    } catch (e) {
                        console.warn(`Could not get upload for product ${prd.id}`);
                        productData.push({ product: prd, upload: null });
                    }
                }
            } catch (error) {
                console.error('Error fetching products by category:', error);
            }
            return productData;
        };

        if (cat) {
            const fetchData = async () => {
                try {
                    setIsLoading(true);
                    const products = await getProducts(cat);
                    setData(products);
                } catch (error) {
                    console.error('Erro ao buscar dados iniciais:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [cat]);

    const handlePressCard = async (uri, clickedPrd) => {
        navigation.navigate('ConciergeDetails', { data: data, clickedImage: uri, clickedProduct: clickedPrd });
    };

    // Renderização customizada para as categorias no estilo CategoriesBar
    const renderCategoryChip = ({ item }) => (
        <TouchableOpacity
            key={item.categoryData.cat.categoryId}
            style={[
                styles.chip,
                selected === item.categoryData.cat.categoryId && styles.chipSelected
            ]}
            onPress={() => {
                setSelected(item.categoryData.cat.categoryId);
                navigation.navigate('OffersByCategory', {
                    cat: item.categoryData.cat.categoryId,
                    catName: item.categoryData.cat.categoryName
                });
            }}
        >
            <Text style={[
                styles.chipText,
                selected === item.categoryData.cat.categoryId && styles.chipTextSelected
            ]}>
                {item.categoryData.cat.categoryName}
            </Text>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#172B4D" />
                <Text style={styles.loadingText}>{t('offersByCategory.loading')}</Text>
            </View>
        );
    }

    return (
        <PaperProvider theme={theme}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    <GoBackArrow />
                    <Text style={styles.titleText}>{t(catName) || t('offersByCategory.categoryFallback')}</Text>
                </View>

                <View style={styles.searchContainer}>
                    <SearchBarHome widthDesired={"90%"} />
                </View>

                <View style={styles.categoriesContainer}>
                    <Text style={styles.categoriesTitle}>Categorias</Text>
                    <ExploreCategoriesProducts
                        data={categories}
                        renderItem={renderCategoryChip}
                        flatListStyle={{ height: 56, paddingVertical: 0, backgroundColor: 'transparent' }}
                        flatListContentStyle={{ paddingHorizontal: 0 }}
                    />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.cardsContainer}>
                        {data.length > 0 ? (
                            data.map((prd) => (
                                <TouchableOpacity
                                    key={prd.product.id}
                                    onPress={() => handlePressCard(prd.upload?.filePath, prd)}
                                    style={styles.cardTouchable}
                                >
                                    <CardServicesCategoriesInsideDetailed
                                        title={t(prd.product.name)}
                                        image={prd.upload?.filePath || ""}
                                        description={t(prd.product.description)}
                                    />
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>{t('offersByCategory.noItems')}</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
            <ContactCard />
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
        alignItems: 'center',
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        position: 'relative',
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#172B4D',
        textAlign: 'center',
        flex: 1,
    },
    searchContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
    },
    categoriesContainer: {
        width: '100%',
        marginBottom: 10,
        marginLeft: 20,
        paddingLeft: 10,
    },
    categoriesTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#172B4D',
        marginTop: 10,
        marginBottom: 15,
    },
    exploreCategoriesOverride: {
        height: 60,
        paddingVertical: 0,
        backgroundColor: 'transparent',
    },
    chip: {
        backgroundColor: '#F4F6FA',
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 8,
        marginRight: 10,
        minWidth: 80,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        elevation: 0,
        shadowOpacity: 0,
    },
    chipSelected: {
        backgroundColor: '#2563EB',
    },
    chipText: {
        color: '#172B4D',
        fontWeight: '500',
        fontSize: 15,
    },
    chipTextSelected: {
        color: '#fff',
    },
    scrollView: {
        width: '100%',
    },
    scrollViewContent: {
        paddingBottom: 20,
        alignItems: 'center',
    },
    cardsContainer: {
        width: '90%',
    },
    cardTouchable: {
        width: '100%',
        marginVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        padding: 0,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyText: {
        color: "#172B4D",
        fontSize: 16,
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

export default OffersByCategory;