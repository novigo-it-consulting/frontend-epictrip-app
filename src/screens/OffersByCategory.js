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
import colors from "../colors";
import SearchBarHome from '../components/SearchViewHome';
import GoBackArrow from '../components/GoBackArrow';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getProductByCategory, getUploadByProduct } from '../services/api';
import CardServicesCategoriesInsideDetailed from '../components/CardServicesCategoriesInsideDetailed';
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const OffersByCategory = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const { cat, catName } = route.params || {};

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    // 2. Criar um estado para armazenar os textos traduzidos
    const [t, setT] = useState({
        loading: "Loading...",
        categoryFallback: "Category",
        noItems: "No item found",
    });

    // 3. useEffect para buscar as traduções
    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const [loading, categoryFallback, noItems] = await Promise.all([
                    translate("Loading...", "en"),
                    translate("Category", "en"),
                    translate("No item found", "en")
                ]);
                setT({ loading, categoryFallback, noItems });
            } catch (error) {
                console.error("Falha ao buscar traduções:", error);
            }
        };
        fetchTranslations();
    }, []);

    const getProducts = async (id) => {
        const data = [];
        const products = await getProductByCategory(id);
        for (const prd of products) {
            try {
                const uploadResponse = await getUploadByProduct(prd.id);
                const obj = {
                    upload: uploadResponse[0],
                    product: prd
                };
                data.push(obj);
            } catch (e) {
                // Continua mesmo se um produto falhar ao carregar a imagem
                console.warn(`Could not get upload for product ${prd.id}`);
            }
        }
        return data;
    };

    useEffect(() => {
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
                {/* 4. Usar o texto traduzido */}
                <Text style={styles.loadingText}>{t.loading}</Text>
            </View>
        );
    }

    return (
        <PaperProvider theme={theme}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    <GoBackArrow />
                    <Text style={styles.titleText}>{catName || t.categoryFallback}</Text>
                </View>

                <View style={styles.searchContainer}>
                    <SearchBarHome widthDesired={"90%"} />
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
                                        title={prd.product.name}
                                        image={prd.upload?.filePath || ""}
                                        description={prd.product.description}
                                    />
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>{t.noItems}</Text>
                            </View>
                        )}
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
        alignItems: 'center',
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#172B4D',
        marginLeft: 36,
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
        marginVertical: 8,
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