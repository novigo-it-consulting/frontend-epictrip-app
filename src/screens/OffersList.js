import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView // Usei o ScrollView do react-native
} from "react-native";
import colors from "../colors";
import SearchBarHome from '../components/SearchViewHome';
import GoBackArrow from '../components/GoBackArrow';
import CardServicesCategoriesInside from '../components/CardServicesCategoriesInside';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from '@react-navigation/native';
import { getProductsByGroup, getUploadByProduct, getCategoryByGroup, getUploadByCategory } from '../services/api';
import ExploreCategoriesProducts from '../components/ExploreCategoriesProducts';

const OffersList = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { group } = route.params || {};
    const { groupData } = route.params || {};

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    const getProducts = async () => {
        try {
            let prds = [];
            const products = await getProductsByGroup(group);

            for (const product of products) {
                try {
                    const upload = await getUploadByProduct(product.id);
                    const obj = {
                        product: product,
                        upload: upload[0] // Evita erro caso `filePath` não exista
                    };
                    prds.push(obj);
                } catch (error) {
                    console.warn(`Erro ao obter imagem para o produto ${product.id}:`, error);
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
            const categories = await getCategoryByGroup(group);
            for (const cat of categories) {
                try {
                    const upload = await getUploadByCategory(cat.categoryId);
                    const obj = {
                        categoryData: {
                            cat // Mantive a estrutura original
                        },
                        uri: upload[0]?.filePath
                    };
                    cats.push(obj);
                } catch (error) {
                    console.warn("Erro ao obter conteúdo:", error);
                }
            }
            return cats;
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const categories = await getCategoriesData();
                setCategories(categories);
                const products = await getProducts();
                setData(products);
            } catch (error) {
                console.error('Erro ao buscar dados iniciais:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePressCard = async (uri, prd) => {
        navigation.navigate('ConciergeDetails', { data: data, clickedImage: uri, clickedProduct: prd });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#172B4D" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    return (
        <PaperProvider theme={theme}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    <GoBackArrow />
                    <Text style={styles.titleText}>{groupData?.title || "Categoria"}</Text>
                </View>
                <View style={styles.searchContainer}>
                    <SearchBarHome widthDesired={"90%"} />
                </View>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Categories</Text>
                        <ExploreCategoriesProducts data={categories} />
                    </View>
                    <View style={[styles.sectionContainer, { paddingTop: 8 }]}>
                        <Text style={styles.sectionTitle}>Suggestions</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {data.map((prd) => (
                                <TouchableOpacity key={prd.product.id} onPress={() => handlePressCard(prd.upload.filePath, prd)}>
                                    <CardServicesCategoriesInside
                                        title={prd.product.name}
                                        image={prd.upload.filePath}
                                        description={prd.product.description}
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