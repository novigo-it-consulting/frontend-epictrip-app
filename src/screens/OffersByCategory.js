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
import CategoriesBar from '../components/CategoriesBar';
import { getProductByCategory, getUploadByProduct } from '../services/api';
import CardServicesCategoriesInsideDetailed from '../components/CardServicesCategoriesInsideDetailed';

const OffersByCategory = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useTranslation();

    const { cat, catName } = route.params || {};

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('parks');

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
                        // Adiciona o produto mesmo sem imagem para que ele apareça na lista
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


                <CategoriesBar
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                />

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
                                        image={prd.upload?.filePath || ""} // Fallback para imagem vazia
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
